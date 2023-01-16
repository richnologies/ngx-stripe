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
  StripeAddressElement,
  StripeAddressElementOptions,
  StripeAddressElementChangeEvent
} from '@stripe/stripe-js';

import { NgxStripeElementLoadingTemplateDirective } from '../directives/stripe-element-loading-template.directive';
import { StripeElementsDirective } from '../directives/elements.directive';

import { StripeInstance } from '../services/stripe-instance.class';
import { StripeElementsService } from '../services/stripe-elements.service';

@Component({
  selector: 'ngx-stripe-address',
  template: `
    <div class="field" #stripeElementRef>
      <ng-container *ngIf="state !== 'ready' && loadingTemplate" [ngTemplateOutlet]="loadingTemplate"></ng-container>
    </div>
  `
})
export class StripeAddressComponent implements OnInit, OnChanges, OnDestroy {
  @ContentChild(NgxStripeElementLoadingTemplateDirective, { read: TemplateRef })
  loadingTemplate?: TemplateRef<NgxStripeElementLoadingTemplateDirective>;
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripeAddressElement;

  @Input() containerClass: string;
  @Input() options: StripeAddressElementOptions;
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeInstance;

  @Output() load = new EventEmitter<StripeAddressElement>();

  @Output() blur = new EventEmitter<void>();
  @Output() change = new EventEmitter<StripeAddressElementChangeEvent>();
  @Output() focus = new EventEmitter<void>();
  @Output() ready = new EventEmitter<void>();
  @Output() escape = new EventEmitter<void>();
  @Output() loaderror = new EventEmitter<void>();
  @Output() loaderstart = new EventEmitter<void>();

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

  update(options: Partial<StripeAddressElementOptions>): StripeAddressElement {
    return this.element.update(options);
  }

  getValue(): Promise<{
    complete: boolean;
    isNewAddress: boolean;
    value: {
      name: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      address: {
        line1: string;
        line2: string | null;
        city: string;
        state: string;
        country: string;
        postal_code: string;
      }
    }
  }> {
    const address = this.elements.getElement('address');
    return (address as any).getValue();
  }

  /**
   * @deprecated
   */
  getAddressElement() {
    return this.element;
  }

  private createElement(options: StripeAddressElementOptions) {
    if (this.element) {
      this.element.unmount();
    }

    this.element = this.elements.create('address', options);
    this.element.on('change', (ev: StripeAddressElementChangeEvent) => this.change.emit(ev));
    this.element.on('blur', () => this.blur.emit());
    this.element.on('focus', () => this.focus.emit());
    this.element.on('ready', () => this.ready.emit());
    this.element.on('escape', () => this.escape.emit());
    this.element.on('loaderror', () => this.loaderror.emit());
    this.element.on('loaderstart', () => this.loaderstart.emit());

    this.element.mount(this.stripeElementRef.nativeElement);

    this.load.emit(this.element);
  }
}
