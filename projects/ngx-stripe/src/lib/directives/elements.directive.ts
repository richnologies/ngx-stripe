import { Directive, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { from } from 'rxjs';

import {
  StripeAddressElement,
  StripeAuBankAccountElement,
  StripeCardCvcElement,
  StripeContactDetailsElement,
  StripeCurrencySelectorElement,
  StripeCardElement,
  StripeCardExpiryElement,
  StripeCardNumberElement,
  StripeElements,
  StripeElementsOptions,
  StripeElementsUpdateOptions,
  StripeExpressCheckoutElement,
  StripeIbanElement,
  StripeIssuingCardCopyButtonElement,
  StripeLinkAuthenticationElement,
  StripePaymentElement,
  StripePaymentMethodMessagingElement,
  StripePaymentRequestButtonElement,
  StripeShippingAddressElement,
  StripeTaxIdElement,
  StripeTermsElement
} from '@stripe/stripe-js';

import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { StripeElementsService } from '../services/stripe-elements.service';

@Directive({
  selector: 'ngx-stripe-elements,[ngxStripeElements]',
  standalone: true
})
export class StripeElementsDirective implements OnInit, OnChanges {
  @Input() elementsOptions: StripeElementsOptions;
  @Input() stripe: StripeServiceInterface;

  @Output() elements = new EventEmitter<StripeElements>();

  _elements: StripeElements;
  state: 'notready' | 'starting' | 'ready' = 'notready';

  constructor(public stripeElementsService: StripeElementsService) {}

  async ngOnChanges(changes: SimpleChanges) {
    this.state = 'starting';

    const elementsOptions = this.elementsOptions;
    const stripe = this.stripe;

    if (!stripe) {
      this.state = 'notready';
      return;
    }

    if (changes.elementsOptions) {
      if (this._elements) {
        const payload = Object.keys(elementsOptions).reduce((acc, key) => {
          if (
            elementsOptions[key] !== changes.elementsOptions.previousValue[key] &&
            !['fonts', 'loader', 'clientSecret'].includes(key)
          ) {
            acc[key] = elementsOptions[key];
          }
          return acc;
        }, {});

        this._elements.update(payload);
      } else {
        this._elements = await this.stripeElementsService.elements(stripe, elementsOptions).toPromise();
        this.elements.emit(this._elements);

        this.state = 'ready';
      }
    }
  }

  async ngOnInit() {
    if (this.state === 'notready') {
      this.state = 'starting';

      this._elements = await this.stripeElementsService.elements(this.stripe).toPromise();
      this.elements.emit(this._elements);

      this.state = 'ready';
    }
  }

  fetchUpdates() {
    if (!this._elements) return null;
    return from(this._elements.fetchUpdates());
  }

  update(options: StripeElementsUpdateOptions) {
    if (!this._elements) return null;
    return this._elements.update(options);
  }

  submit() {
    if (!this._elements) return null;
    return from(this._elements.submit());
  }

  getElement(elementType: 'address'): StripeAddressElement | null;
  getElement(elementType: 'contactDetails'): StripeContactDetailsElement | null;
  getElement(elementType: 'currencySelector'): StripeCurrencySelectorElement | null;
  getElement(elementType: 'paymentMethodMessaging'): StripePaymentMethodMessagingElement | null;
  getElement(elementType: 'auBankAccount'): StripeAuBankAccountElement | null;
  getElement(elementType: 'card'): StripeCardElement | null;
  getElement(elementType: 'cardNumber'): StripeCardNumberElement | null;
  getElement(elementType: 'cardExpiry'): StripeCardExpiryElement | null;
  getElement(elementType: 'cardCvc'): StripeCardCvcElement | null;
  getElement(elementType: 'iban'): StripeIbanElement | null;
  getElement(elementType: 'issuingCardCopyButton'): StripeIssuingCardCopyButtonElement | null;
  getElement(elementType: 'linkAuthentication'): StripeLinkAuthenticationElement | null;
  getElement(elementType: 'expressCheckout'): StripeExpressCheckoutElement | null;
  getElement(elementType: 'payment'): StripePaymentElement | null;
  getElement(elementType: 'paymentRequestButton'): StripePaymentRequestButtonElement | null;
  getElement(elementType: 'shippingAddress'): StripeShippingAddressElement | null;
  getElement(elementType: 'taxId'): StripeTaxIdElement | null;
  getElement(elementType: 'terms'): StripeTermsElement | null;
  getElement(elementType) {
    if (!this._elements) return null;

    switch (elementType) {
      case 'address':
        return this._elements.getElement('address');
      case 'contactDetails':
        return this._elements.getElement('contactDetails');
      case 'currencySelector':
        return this._elements.getElement('currencySelector');
      case 'paymentMethodMessaging':
        return this._elements.getElement('paymentMethodMessaging');
      case 'auBankAccount':
        return this._elements.getElement('auBankAccount');
      case 'card':
        return this._elements.getElement('card');
      case 'cardNumber':
        return this._elements.getElement('cardNumber');
      case 'cardExpiry':
        return this._elements.getElement('cardExpiry');
      case 'cardCvc':
        return this._elements.getElement('cardCvc');
      case 'iban':
        return this._elements.getElement('iban');
      case 'issuingCardCopyButton':
        return (this._elements as any).getElement('issuingCardCopyButton') as StripeIssuingCardCopyButtonElement | null;
      case 'linkAuthentication':
        return this._elements.getElement('linkAuthentication');
      case 'expressCheckout':
        return this._elements.getElement('expressCheckout');
      case 'payment':
        return this._elements.getElement('payment');
      case 'paymentRequestButton':
        return this._elements.getElement('paymentRequestButton');
      case 'shippingAddress':
        return this._elements.getElement('shippingAddress');
      case 'taxId':
        return this._elements.getElement('taxId');
      case 'terms':
        return this._elements.getElement('terms');
      default:
        return this._elements.getElement(elementType);
    }
  }
}
