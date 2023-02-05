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
  Optional,
  ChangeDetectorRef
} from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';

import {
  StripeElementsOptions,
  StripeElements,
  StripeIssuingCardExpiryDisplayElement,
  StripeIssuingCardExpiryDisplayElementOptions
} from '@stripe/stripe-js';

import { NgxStripeElementLoadingTemplateDirective } from '../directives/stripe-element-loading-template.directive';
import { StripeElementsDirective } from '../directives/elements.directive';

import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { StripeElementsService } from '../services/stripe-elements.service';

@Component({
  selector: 'ngx-stripe-issuing-card-expiry-display',
  template: `
    <div class="field" #stripeElementRef>
      <ng-container *ngIf="state !== 'ready' && loadingTemplate" [ngTemplateOutlet]="loadingTemplate"></ng-container>
    </div>
  `
})
export class StripeIssuingCardExpiryDisplayComponent implements OnInit, OnChanges, OnDestroy {
  @ContentChild(NgxStripeElementLoadingTemplateDirective, { read: TemplateRef })
  loadingTemplate?: TemplateRef<NgxStripeElementLoadingTemplateDirective>;
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripeIssuingCardExpiryDisplayElement;

  @Input() containerClass: string;
  @Input() options: StripeIssuingCardExpiryDisplayElementOptions;
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeServiceInterface;

  @Output() load = new EventEmitter<StripeIssuingCardExpiryDisplayElement>();

  elements: StripeElements;
  state: 'notready' | 'starting' | 'ready' = 'notready';
  private elementsSubscription: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
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
  }

  async ngOnInit() {
    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);

    if (this.elementsProvider) {
      this.elementsSubscription = this.elementsProvider.elements.subscribe((elements) => {
        this.elements = elements;
        this.createElement(options);
      });
    } else if (this.state === 'notready') {
      this.state = 'starting';

      this.elements = await lastValueFrom(this.stripeElementsService.elements(this.stripe));
      this.createElement(options);
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

  update(options: Partial<StripeIssuingCardExpiryDisplayElementOptions>) {
    this.element.update(options);
  }

  private createElement(options: StripeIssuingCardExpiryDisplayElementOptions) {
    this.state = 'ready';
    this.cdr.detectChanges();

    if (this.element) {
      this.element.unmount();
    }

    this.element = this.elements.create('issuingCardExpiryDisplay', options);
    this.element.mount(this.stripeElementRef.nativeElement);

    this.load.emit(this.element);
  }
}
