import { Component, inject } from '@angular/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { PaymentRequestPaymentMethodEvent, PaymentRequestShippingAddressEvent } from '@stripe/stripe-js';
import { StripePaymentRequestButtonComponent, injectStripe } from 'ngx-stripe';

import { NgStrPlutoService } from '../../core';

import {
  NgStrCodeComponent,
  NgStrCodeGroupComponent,
  NgStrDocsHeaderComponent,
  NgStrLinkComponent,
  NgStrPanelComponent,
  NgStrSectionAsideDirective,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-payment-request-button',
  templateUrl: './payment-request-button.component.html',
  standalone: true,
  imports: [
    StripePaymentRequestButtonComponent,
    NgStrCodeComponent,
    NgStrCodeGroupComponent,
    NgStrDocsHeaderComponent,
    NgStrLinkComponent,
    NgStrPanelComponent,
    NgStrSectionComponent,
    NgStrSectionAsideDirective,
    NgStrSubheaderComponent
  ]
})
export default class NgStrPaymentRequestButtonComponent {
  private readonly plutoService = inject(NgStrPlutoService);

  stripe = injectStripe(this.plutoService.KEYS.main);
  paymentRequestOptions = {
    country: 'US',
    currency: 'usd',
    total: {
      label: 'Demo Total',
      amount: 1099
    },
    requestPayerName: true,
    requestPayerEmail: true
  };

  onPaymentMethod(ev: PaymentRequestPaymentMethodEvent) {
    this.plutoService
      .createPaymentIntent({
        amount: this.paymentRequestOptions.total.amount,
        currency: this.paymentRequestOptions.currency
      })
      .pipe(
        switchMap((pi) => {
          return this.stripe
            .confirmCardPayment(pi.client_secret, { payment_method: ev.paymentMethod.id }, { handleActions: false })
            .pipe(
              switchMap((confirmResult) => {
                if (confirmResult.error) {
                  // Report to the browser that the payment failed,
                  // prompting it to re-show the payment interface,
                  // or show an error message and close the payment.
                  ev.complete('fail');
                  return of({
                    error: new Error('Error Confirming the payment')
                  });
                } else {
                  // Report to the browser that the confirmation was
                  // successful, prompting it to close the browser
                  // payment method collection interface.
                  ev.complete('success');

                  if (confirmResult.paymentIntent.status === 'requires_action') {
                    // Let Stripe.js handle the rest of the payment flow.
                    return this.stripe.confirmCardPayment(pi.client_secret);
                  }
                }

                return of({ error: null });
              })
            );
        })
      )
      .subscribe((result) => {
        console.log('R', result);
        if (result.error) {
          // The payment failed -- ask your customer for a new payment method.
        } else {
          // The payment has succeeded.
        }
      });
  }

  onShippingAddressChange(ev: PaymentRequestShippingAddressEvent) {
    if (ev.shippingAddress.country !== 'US') {
      ev.updateWith({ status: 'invalid_shipping_address' });
    } else {
      // Replace this with your own custom implementation if needed
      fetch('/calculateShipping', {
        data: JSON.stringify({
          shippingAddress: ev.shippingAddress
        })
      } as any)
        .then((response) => response.json())
        .then((result) =>
          ev.updateWith({
            status: 'success',
            shippingOptions: result.supportedShippingOptions
          })
        );
    }
  }

  paymentButtonTS = `
    import { Component } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable, of } from 'rxjs';
    import { switchMap } from 'rxjs/operators';

    import { StripeService } from 'ngx-stripe';
    import {
      StripeElementsOptions,
      PaymentRequestPaymentMethodEvent,
      PaymentIntent,
      PaymentRequestShippingAddressEvent,
    } from '@stripe/stripe-js';

    @Component({
      selector: 'ngstr-payment-request-button',
      templateUrl: './payment-request-button.component.html',
    })
    export class PaymentRequestButtonComponent {
      elementsOptions: StripeElementsOptions = {
        locale: 'es',
      };

      paymentRequestOptions = {
        country: 'ES',
        currency: 'eur',
        total: {
          label: 'Demo Total',
          amount: 1099,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      };

      constructor(
        private http: HttpClient,
        private stripeService: StripeService
      ) {}

      onPaymentMethod(ev: PaymentRequestPaymentMethodEvent) {
        this.createPaymentIntent()
          .pipe(
            switchMap((pi) => {
              return this.stripeService
                .confirmCardPayment(
                  pi.client_secret,
                  { payment_method: ev.paymentMethod.id },
                  { handleActions: false }
                )
                .pipe(
                  switchMap((confirmResult) => {
                    if (confirmResult.error) {
                      // Report to the browser that the payment failed,
                      // prompting it to re-show the payment interface,
                      // or show an error message and close the payment.
                      ev.complete('fail');
                      return of({
                        error: new Error('Error Confirming the payment'),
                      });
                    } else {
                      // Report to the browser that the confirmation was
                      // successful, prompting it to close the browser
                      // payment method collection interface.
                      ev.complete('success');
                      // Let Stripe.js handle the rest of the payment flow.
                      return this.stripeService.confirmCardPayment(
                        pi.client_secret
                      );
                    }
                  })
                );
            })
          )
          .subscribe((result) => {
            if (result.error) {
              // The payment failed -- ask your customer for a new payment method.
            } else {
              // The payment has succeeded.
            }
          });
      }

      onShippingAddressChange(ev: PaymentRequestShippingAddressEvent) {
        if (ev.shippingAddress.country !== 'US') {
          ev.updateWith({ status: 'invalid_shipping_address' });
        } else {
          // Replace this with your own custom implementation if needed
          fetch('/calculateShipping', {
            data: JSON.stringify({
              shippingAddress: ev.shippingAddress,
            }),
          } as any)
            .then((response) => response.json())
            .then((result) =>
              ev.updateWith({
                status: 'success',
                shippingOptions: result.supportedShippingOptions,
              })
            );
        }
      }

      onNotAvailable() {
        // Subscribe to this event in case you want to act
        // base on availability
        console.log('Payment Request is not Available');
      }

      createPaymentIntent(): Observable<PaymentIntent> {
        // Replace this with your own custom implementation
        // to perform a Payment Intent Creation
        // You will need your own Server to do that
        return this.http.post<PaymentIntent>(
          '/create-payment-intent',
          { amount: this.paymentRequestOptions.total.amount }
        );
      }
    }
  `;
  paymentButtonHTML = `
    <h2>Payment Request Button</h2>
    <ngx-stripe-payment-request-button
      [paymentOptions]="paymentRequestOptions"
      (paymentMethod)="onPaymentMethod($event)"
      (shippingaddresschange)="onShippingAddressChange($event)"
      (notavailable)="onNotAvailable()"
    ></ngx-stripe-payment-request-button>
  `;
}
