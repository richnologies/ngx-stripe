import { Component } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

import {
  NgStrBadgeComponent,
  NgStrCodeComponent,
  NgStrCodeGroupComponent,
  NgStrContainerComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrLinkComponent,
  NgStrPanelComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-issuing-elements',
  templateUrl: './issuing.component.html',
  standalone: true,
  imports: [
    MatDividerModule,
    MatTabsModule,
    NgStrBadgeComponent,
    NgStrCodeComponent,
    NgStrCodeGroupComponent,
    NgStrContainerComponent,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrLinkComponent,
    NgStrPanelComponent,
    NgStrSectionComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrIssuingElementsComponent {
  oneCardHTML = `
    <div>
      @if (cardOptions) {
        <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-issuing-card-number-display [options]="cardOptions" />
          <ngx-stripe-issuing-card-expiry-display [options]="cardOptions" />
          <ngx-stripe-issuing-card-cvc-display [options]="cardOptions" />
          <ngx-stripe-issuing-card-pin-display [options]="cardOptions" />
        </ngx-stripe-elements>
      }
    </div>
  `;

  oneCardTS = `
    import { Component, inject, OnInit, ViewChild } from '@angular/core';

    import {
      injectStripe,
      StripeElementsDirective,
      StripeIssuingCardCvcDisplayComponent,
      StripeIssuingCardExpiryDisplayComponent,
      StripeIssuingCardNumberDisplayComponent,
      StripeIssuingCardPinDisplayComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions, 
      StripeIssuingCardNumberDisplayElement,
      StripeIssuingCardNumberDisplayElementOptions
    } from '@stripe/stripe-js';

    import { YourOwnAPIService } from './your-own-api.service';

    @Component({
      selector: 'ngstr-issuing-one-card-example',
      templateUrl: './one-card.component.html',
      standalone: true,
      imports: [
        StripeElementsDirective,
        StripeIssuingCardCvcDisplayComponent,
        StripeIssuingCardExpiryDisplayComponent,
        StripeIssuingCardNumberDisplayComponent,
        StripeIssuingCardPinDisplayComponent
      ]
    })
    export class CheckoutFormComponent implements OnInit {
      @ViewChild(StripeIssuingCardNumberDisplayElement)
      card!: StripeIssuingCardNumberDisplayElement;

      private readonly yourOwnAPI = inject(YourOwnAPIService);

      cardId = '{{yourcardid}}';
      nonce: string;
      ek: string;

      elementsOptions: StripeElementsOptions = {
        locale: 'en'
      };

      // Replace with your own public key
      stripe = injectStripe(this.yourOwnAPI.StripePublicKey);
      cardOptions?: StripeIssuingCardNumberDisplayElementOptions;

      ngOnInit() {
        this.stripe
          .createEphemeralKeyNonce({ issuingCard: this.cardId })
          .pipe(
            switchMap(({ nonce }) => {
              this.nonce = nonce;
              const data: any = { issuing_card: this.cardId, nonce };
              return this.yourOwnAPI.createEphemeralKeys(data);
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
  `;
}
