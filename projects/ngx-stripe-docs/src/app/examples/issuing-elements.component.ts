import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs';

import { StripeFactoryService, StripeElementsDirective, StripeIssuingCardNumberDisplayComponent, StripeIssuingCardCvcDisplayComponent, StripeIssuingCardExpiryDisplayComponent, StripeIssuingCardPinDisplayComponent } from 'ngx-stripe';
import { StripeElementsOptions, StripeIssuingCardNumberDisplayElement, StripeIssuingCardNumberDisplayElementOptions } from '@stripe/stripe-js';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-issuing-elements-example',
  template: `
    <div>
      <div color="secondary" section-content-header>
        <span>One Card Example</span>
      </div>
      <div section-content>
        <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions" *ngIf="cardOptions">
          <ngx-stripe-issuing-card-number-display [options]="cardOptions"
          ></ngx-stripe-issuing-card-number-display>
          <br />
          <ngx-stripe-issuing-card-expiry-display [options]="cardOptions"
          ></ngx-stripe-issuing-card-expiry-display>
          <br />
          <ngx-stripe-issuing-card-cvc-display [options]="cardOptions"
          ></ngx-stripe-issuing-card-cvc-display>
          <br />
          <ngx-stripe-issuing-card-pin-display [options]="cardOptions"
          ></ngx-stripe-issuing-card-pin-display>
        </ngx-stripe-elements>
      </div>
    </div>
  `,
  styles: [],
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
export class IssuingElementsExampleComponent implements OnInit {
  @ViewChild('card') card: StripeIssuingCardNumberDisplayElement;

  cardId = 'ic_1MXkbPCFzZvO65bFj561Zea7';
  nonce: string;
  ek: string;

  stripe = this.stripeFactory.create(this.plutoService.KEYS.usa);
  cardOptions: StripeIssuingCardNumberDisplayElementOptions;
  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  constructor(
    private stripeFactory: StripeFactoryService,
    private plutoService: NgStrPlutoService
  ) {}

  ngOnInit() {
    this.stripe.createEphemeralKeyNonce({ issuingCard: this.cardId })
      .pipe(
        switchMap(({ nonce }) => {
          this.nonce = nonce;
          const data: any = { issuing_card: this.cardId, nonce };
          return this.plutoService.createEphemeralKeys(data, { clientId: 'b3eb5880-ee40-4c96-9356-cb43da836aa6' });
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
              },
            },
          };
        },
        error: err => console.error(err)
      });
  }
}
