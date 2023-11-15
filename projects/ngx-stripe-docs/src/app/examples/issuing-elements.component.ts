import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { switchMap } from 'rxjs';

import {
  StripeElementsDirective,
  StripeIssuingCardNumberDisplayComponent,
  StripeIssuingCardCvcDisplayComponent,
  StripeIssuingCardExpiryDisplayComponent,
  StripeIssuingCardPinDisplayComponent,
  injectStripe
} from 'ngx-stripe';
import {
  StripeElementsOptions,
  StripeIssuingCardNumberDisplayElement,
  StripeIssuingCardNumberDisplayElementOptions
} from '@stripe/stripe-js';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-issuing-elements-example',
  template: `
    <div>
      <div color="secondary" section-content-header>
        <span>One Card Example</span>
      </div>
      <div section-content>
        @if (cardOptions) {
          <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
            <ngx-stripe-issuing-card-number-display [options]="cardOptions" />
            <br />
            <ngx-stripe-issuing-card-expiry-display [options]="cardOptions" />
            <br />
            <ngx-stripe-issuing-card-cvc-display [options]="cardOptions" />
            <br />
            <ngx-stripe-issuing-card-pin-display [options]="cardOptions" />
          </ngx-stripe-elements>
        }
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    StripeElementsDirective,
    StripeIssuingCardCvcDisplayComponent,
    StripeIssuingCardExpiryDisplayComponent,
    StripeIssuingCardNumberDisplayComponent,
    StripeIssuingCardPinDisplayComponent
  ]
})
export default class IssuingElementsExampleComponent implements OnInit {
  @ViewChild('card') card: StripeIssuingCardNumberDisplayElement;

  private readonly plutoService = inject(NgStrPlutoService);

  cardId = 'ic_1MXkbPCFzZvO65bFj561Zea7';
  nonce: string;
  ek: string;

  stripe = injectStripe(this.plutoService.KEYS.usa);
  cardOptions: StripeIssuingCardNumberDisplayElementOptions;
  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  ngOnInit() {
    this.stripe
      .createEphemeralKeyNonce({ issuingCard: this.cardId })
      .pipe(
        switchMap(({ nonce }) => {
          this.nonce = nonce;
          const data: any = { issuing_card: this.cardId, nonce };
          return this.plutoService.createEphemeralKeys(data, {
            clientId: 'b3eb5880-ee40-4c96-9356-cb43da836aa6'
          });
        })
      )
      .subscribe({
        next: ({ ephemeralKeySecret }) => {
          this.ek = ephemeralKeySecret;
          this.cardOptions = {
            issuingCard: this.cardId,
            nonce: this.nonce,
            ephemeralKeySecret: this.ek,
            style: {
              base: {
                color: '#000',
                fontSize: '16px'
              }
            }
          };
        },
        error: (err) => console.error(err)
      });
  }
}
