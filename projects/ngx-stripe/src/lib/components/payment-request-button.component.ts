import { Component, Input, ViewChild, ElementRef, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, from } from 'rxjs';

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

import { StripeInstance } from '../services/stripe-instance.class';
import { StripeElementsService } from '../services/stripe-elements.service';

@Component({
  selector: 'ngx-stripe-payment-request-button',
  template: `<div class="field" #stripeElementRef></div>`
})
export class StripePaymentRequestButtonComponent implements OnChanges {
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripePaymentRequestButtonElement;
  paymentRequest!: PaymentRequest;

  @Input() containerClass: string;
  @Input() paymentOptions: PaymentRequestOptions;
  @Input() options: StripePaymentRequestButtonElementOptions;
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeInstance;

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

  constructor(public stripeElementsService: StripeElementsService) {}

  async ngOnChanges(changes: SimpleChanges) {
    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);
    const elementsOptions = this.elementsOptions;
    const stripe = this.stripe;
    let updateElements = false;

    if (changes.elementsOptions || changes.stripe || !this.elements) {
      const elements = await this.stripeElementsService.elements(stripe, elementsOptions).toPromise();
      this.elements = elements;
      updateElements = true;
    }

    if (changes.paymentOptions && this.paymentRequest) {
      this.updateRequest(this.paymentOptions);
    }

    if (changes.options || changes.containerClass || !this.element || updateElements) {
      if (this.element && !updateElements) {
        this.update(options);
      } else if (this.elements && updateElements) {
        this.paymentRequest = this.stripeElementsService.paymentRequest(stripe, this.paymentOptions);
        this.paymentRequest.on('token', (ev) => this.token.emit(ev));
        if (this.paymentMethod.observed) this.paymentRequest.on('paymentmethod', (ev) => this.paymentMethod.emit(ev));
        if (this.source.observed && !this.paymentMethod.observed)
          this.paymentRequest.on('source', (ev) => this.source.emit(ev));
        this.paymentRequest.on('cancel', () => this.cancel.emit());
        this.paymentRequest.on('shippingaddresschange', (ev) => this.shippingaddresschange.emit(ev));
        this.paymentRequest.on('shippingoptionchange', (ev) => this.shippingoptionchange.emit(ev));
        this.element = this.elements.create('paymentRequestButton', {
          paymentRequest: this.paymentRequest,
          ...options
        });

        this.canMakePayment().subscribe((result) => {
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
        });
      }
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

  show() {
    this.paymentRequest.show();
  }

  /**
   * @deprecated
   */
  getButton() {
    return this.element;
  }
}
