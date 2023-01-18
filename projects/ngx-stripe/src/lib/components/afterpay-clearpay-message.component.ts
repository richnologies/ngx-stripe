import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ContentChild,
  TemplateRef,
  Optional
} from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';

import {
  StripeElementsOptions,
  StripeElements,
  StripeAfterpayClearpayMessageElementOptions,
  StripeAfterpayClearpayMessageElement
} from '@stripe/stripe-js';

import { NgxStripeElementLoadingTemplateDirective } from '../directives/stripe-element-loading-template.directive';
import { StripeElementsDirective } from '../directives/elements.directive';

import { StripeInstance } from '../services/stripe-instance.class';
import { StripeElementsService } from '../services/stripe-elements.service';

@Component({
  selector: 'ngx-stripe-afterpay-clearpay-message',
  standalone: true,
  template: `
    <div class="field" #stripeElementRef>
      <ng-container *ngIf="state !== 'ready' && loadingTemplate" [ngTemplateOutlet]="loadingTemplate"></ng-container>
    </div>
  `,
  imports: [CommonModule]
})
export class StripeAfterpayClearpayMessageComponent implements OnInit, OnChanges, OnDestroy {
  @ContentChild(NgxStripeElementLoadingTemplateDirective, { read: TemplateRef })
  loadingTemplate?: TemplateRef<NgxStripeElementLoadingTemplateDirective>;
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripeAfterpayClearpayMessageElement;

  @Input() containerClass: string;
  @Input() options: StripeAfterpayClearpayMessageElementOptions;
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeInstance;

  @Output() load = new EventEmitter<StripeAfterpayClearpayMessageElement>();
  @Output() ready = new EventEmitter<void>();

  elements: StripeElements;
  state: 'notready' | 'starting' | 'ready' = 'notready';
  private elementsSubscription: Subscription;

  constructor(
    public stripeElementsService: StripeElementsService,
    @Optional() private elementsProvider: StripeElementsDirective
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    this.state = 'starting';
    let updateElements = false;

    if (!this.elementsProvider && (changes.elementsOptions || changes.stripe || !this.elements)) {
      this.elements = await lastValueFrom(this.stripeElementsService.elements(this.stripe, this.elementsOptions));
      updateElements = true;
    }

    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);
    if (changes.options || changes.containerClass || !this.element || updateElements) {
      if (this.element && !updateElements) {
        this.update(options);
      } else if (this.elements && updateElements) {
        this.createElement(options);
      }
    }

    this.state = 'ready';
  }

  async ngOnInit() {
    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);

    if (this.elementsProvider) {
      this.elementsSubscription = this.elementsProvider.elements.subscribe((elements) => {
        this.elements = elements;
        this.createElement(options);
        this.state = 'ready';
      });
    } else if (this.state === 'notready') {
      this.state = 'starting';

      this.elements = await lastValueFrom(this.stripeElementsService.elements(this.stripe));
      this.createElement(options);

      this.state = 'ready';
    }
  }

  ngOnDestroy() {
    if (this.element) {
      this.element.destroy();
    }
    if (this.elementsSubscription) {
      this.elementsSubscription.unsubscribe();
    }
  }

  update(options: Partial<StripeAfterpayClearpayMessageElementOptions>) {
    this.element.update(options);
  }

  /**
   * @deprecated
   */
  getAfterpayClearpayMessage() {
    return this.element;
  }

  private createElement(options: StripeAfterpayClearpayMessageElementOptions) {
    if (this.element) {
      this.element.unmount();
    }

    this.element = this.elements.create('afterpayClearpayMessage', options);
    this.element.on('ready', () => this.ready.emit());

    this.element.mount(this.stripeElementRef.nativeElement);

    this.load.emit(this.element);
  }
}
