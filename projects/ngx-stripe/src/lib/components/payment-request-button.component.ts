import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
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
} from '../interfaces/stripejs.interface';

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

  @Output() change = new EventEmitter<
    StripePaymentRequestButtonElementClickEvent
  >();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();
  @Output() ready = new EventEmitter<void>();

  @Output() token = new EventEmitter<PaymentRequestTokenEvent>();
  @Output() paymentMethod = new EventEmitter<
    PaymentRequestPaymentMethodEvent
  >();
  @Output() source = new EventEmitter<PaymentRequestSourceEvent>();
  @Output() cancel = new EventEmitter<void>();
  @Output() shippingaddresschange = new EventEmitter<
    PaymentRequestShippingAddressEvent
  >();
  @Output() shippingoptionchange = new EventEmitter<
    PaymentRequestShippingOptionEvent
  >();

  elements: StripeElements;

  constructor(public stripeElementsService: StripeElementsService) {}

  async ngOnChanges(changes: SimpleChanges) {
    const options = this.stripeElementsService.mergeOptions(
      this.options,
      this.containerClass
    );
    const elementsOptions = this.elementsOptions;
    const stripe = this.stripe;

    if (changes.elementsOptions || changes.stripe) {
      const elements = await this.stripeElementsService
        .elements(stripe, elementsOptions)
        .toPromise();
      this.elements = elements;
    }

    if (changes.paymentOptions && this.paymentRequest) {
      this.updateRequest(this.paymentOptions);
    }

    if (changes.options || changes.containerClass) {
      if (this.element) {
        this.update(options);
      } else {
        this.paymentRequest = this.stripeElementsService.paymentRequest(
          stripe,
          this.paymentOptions
        );
        this.paymentRequest.on('token', (ev) => this.token.emit(ev));
        this.paymentRequest.on('paymentmethod', (ev) =>
          this.paymentMethod.emit(ev)
        );
        this.paymentRequest.on('source', (ev) => this.source.emit(ev));
        this.paymentRequest.on('cancel', () => this.cancel.emit());
        this.paymentRequest.on('shippingaddresschange', (ev) =>
          this.shippingaddresschange.emit(ev)
        );
        this.paymentRequest.on('shippingoptionchange', (ev) =>
          this.shippingoptionchange.emit(ev)
        );
        this.element = this.elements.create('paymentRequestButton', {
          paymentRequest: this.paymentRequest,
          ...options
        });

        console.log('Payment Request', this.paymentRequest);

        this.canMakePayment().subscribe(result => {
          console.log('Result', result);
          if (result.applePay) {
            this.element.on('click', (ev) => this.change.emit(ev));
            this.element.on('blur', () => this.blur.emit());
            this.element.on('focus', () => this.focus.emit());
            this.element.on('ready', () => this.ready.emit());

            this.element.mount(this.stripeElementRef.nativeElement);

            this.load.emit({
              paymentRequestButton: this.element,
              paymentRequest: this.paymentRequest
            });
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
    this.paymentRequest.update(options);
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
