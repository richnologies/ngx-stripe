import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  Optional,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Observable, from, Subscription } from 'rxjs';

import {
  StripeElementsOptions,
  StripeElements,
  PaymentRequestOptions,
  PaymentRequest,
  CanMakePaymentResult,
  PaymentRequestUpdateOptions,
  StripePaymentRequestButtonElement,
  StripePaymentRequestButtonElementOptions,
  StripePaymentRequestButtonElementClickEvent,
  PaymentRequestTokenEvent,
  PaymentRequestPaymentMethodEvent,
  PaymentRequestSourceEvent,
  PaymentRequestShippingAddressEvent,
  PaymentRequestShippingOptionEvent
} from '@stripe/stripe-js';

import { StripeElementsDirective } from '../directives/elements.directive';

import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { StripeElementsService } from '../services/stripe-elements.service';

@Component({
  selector: 'ngx-stripe-payment-request-button',
  standalone: true,
  template: `<div class="field" #stripeElementRef></div>`,
  imports: [CommonModule]
})
export class StripePaymentRequestButtonComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripePaymentRequestButtonElement;
  paymentRequest!: PaymentRequest;

  @Input() containerClass: string;
  @Input() paymentOptions: PaymentRequestOptions;
  @Input() options: StripePaymentRequestButtonElementOptions;
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeServiceInterface;

  @Output() load = new EventEmitter<{
    paymentRequestButton: StripePaymentRequestButtonElement;
    paymentRequest: PaymentRequest;
  }>();

  @Output() change = new EventEmitter<StripePaymentRequestButtonElementClickEvent>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();
  @Output() ready = new EventEmitter<void>();

  @Output() token = new EventEmitter<PaymentRequestTokenEvent>();
  @Output() paymentMethod = new EventEmitter<PaymentRequestPaymentMethodEvent>();
  @Output() source = new EventEmitter<PaymentRequestSourceEvent>();
  @Output() cancel = new EventEmitter<void>();
  @Output() shippingaddresschange = new EventEmitter<PaymentRequestShippingAddressEvent>();
  @Output() shippingoptionchange = new EventEmitter<PaymentRequestShippingOptionEvent>();
  @Output() notavailable = new EventEmitter<void>();

  elements: StripeElements;
  private state: 'notready' | 'starting' | 'ready' = 'notready';
  private elementsSubscription: Subscription;

  constructor(
    public stripeElementsService: StripeElementsService,
    @Optional() private elementsProvider: StripeElementsDirective
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    let updateElements = false;

    if (!this.elementsProvider && (changes.elementsOptions || changes.stripe || !this.elements)) {
      const elements = await this.stripeElementsService.elements(this.stripe, this.elementsOptions).toPromise();
      this.elements = elements;
      updateElements = true;
    }

    if (changes.paymentOptions && this.paymentRequest) {
      this.updateRequest(this.paymentOptions);
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
        this.state = 'ready';
      });
    } else if (this.state === 'notready') {
      this.state = 'starting';

      this.elements = await this.stripeElementsService.elements(this.stripe).toPromise();
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

  canMakePayment(): Observable<CanMakePaymentResult | null> {
    return from(this.paymentRequest.canMakePayment());
  }

  update(options: Partial<StripePaymentRequestButtonElementOptions>) {
    this.element.update(options);
  }

  updateRequest(options: PaymentRequestUpdateOptions) {
    const { currency, total, displayItems, shippingOptions } = options;

    this.paymentRequest.update({
      currency,
      total,
      displayItems,
      shippingOptions
    });
  }

  show(): void {
    this.paymentRequest.show();
  }

  abort(): void {
    this.paymentRequest.abort();
  }

  isShowing(): boolean {
    return this.paymentRequest.isShowing();
  }

  /**
   * @deprecated
   */
  getButton() {
    return this.element;
  }

  private async createElement(options: Partial<StripePaymentRequestButtonElementOptions> = {}) {
    this.paymentRequest = this.stripeElementsService.paymentRequest(this.stripe, this.paymentOptions);
    this.paymentRequest.on('token', (ev) => this.token.emit(ev));
    if (this.paymentMethod.observed) this.paymentRequest.on('paymentmethod', (ev) => this.paymentMethod.emit(ev));
    if (this.source.observed && !this.paymentMethod.observed)
      this.paymentRequest.on('source', (ev) => this.source.emit(ev));
    this.paymentRequest.on('cancel', () => this.cancel.emit());
    this.paymentRequest.on('shippingaddresschange', (ev) => this.shippingaddresschange.emit(ev));
    this.paymentRequest.on('shippingoptionchange', (ev) => this.shippingoptionchange.emit(ev));

    if (this.element) {
      this.element.unmount();
    }
    this.element = this.elements.create('paymentRequestButton', {
      paymentRequest: this.paymentRequest,
      ...options
    });

    const result = await this.paymentRequest.canMakePayment();
    if (result) {
      this.element.on('click', (ev) => this.change.emit(ev));
      this.element.on('blur', () => this.blur.emit());
      this.element.on('focus', () => this.focus.emit());
      this.element.on('ready', () => this.ready.emit());

      this.element.mount(this.stripeElementRef.nativeElement);

      this.load.emit({
        paymentRequestButton: this.element,
        paymentRequest: this.paymentRequest
      });
    } else {
      this.notavailable.emit();
    }
  }
}
