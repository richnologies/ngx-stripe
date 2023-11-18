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
  selector: 'ngstr-express-checkout',
  templateUrl: './express-checkout.component.html',
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
export default class NgStrExpressCheckoutComponent {
  expressCheckoutTS = `
    import { Component, inject } from '@angular/core';

    import {
      injectStripe,
      StripeElementsDirective,
      StripeExpressCheckoutComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions,
      StripeExpressCheckoutElementOptions
    } from '@stripe/stripe-js';

    import { YourOwnAPIService } from '../core';

    @Component({
      selector: 'ngstr-express-checkout-element-example',
      template: \`
        <div maxWidth="900">
          <div color="secondary" section-content-header>
            <span>Express Checkout Element</span>
          </div>
          <div section-content>
            <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
              <ngx-stripe-express-checkout [options]="options" />
            </ngx-stripe-elements>
            <button (click)="pay()">PAY</button>
          </div>
        </div>
      \`,
      standalone: true,
      imports: [
        StripeElementsDirective,
        StripeExpressCheckoutComponent
      ]
    })
    export default class ExpressCheckoutElementExampleComponent {
      private readonly yourOwnAPI = inject(YourOwnAPIService);

      stripe = injectStripe(this.plutoService.KEYS.main);
      elementsOptions: StripeElementsOptions = {
        mode: 'payment',
        amount: 1099,
        currency: 'usd',
        locale: 'es'
      };

      options: StripeExpressCheckoutElementOptions = {
        buttonType: {
          applePay: 'buy',
          googlePay: 'buy'
        }
      };

      pay() {}
    }
  `;

  expressCheckoutClickEventTS = `
    import { Component, inject } from '@angular/core';

    import {
      injectStripe,
      StripeElementsDirective,
      StripeExpressCheckoutComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions,
      StripeExpressCheckoutElementOptions,
      StripeExpressCheckoutElementClickEvent
    } from '@stripe/stripe-js';

    import { YourOwnAPIService } from '../core';

    @Component({
      selector: 'ngstr-express-checkout-element-example',
      template: \`
        <div maxWidth="900">
          <div color="secondary" section-content-header>
            <span>Express Checkout Element</span>
          </div>
          <div section-content>
            <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
              <ngx-stripe-express-checkout
                [options]="options"
                (clicked)="onClicked($event)"
              />
            </ngx-stripe-elements>
            <button (click)="pay()">PAY</button>
          </div>
        </div>
      \`,
      standalone: true,
      imports: [
        StripeElementsDirective,
        StripeExpressCheckoutComponent
      ]
    })
    export default class ExpressCheckoutElementExampleComponent {
      private readonly yourOwnAPI = inject(YourOwnAPIService);

      stripe = injectStripe(this.plutoService.KEYS.main);
      elementsOptions: StripeElementsOptions = {
        mode: 'payment',
        amount: 1099,
        currency: 'usd',
        locale: 'es'
      };

      options: StripeExpressCheckoutElementOptions = {
        buttonType: {
          applePay: 'buy',
          googlePay: 'buy'
        }
      };

      onClicked(event: StripeExpressCheckoutElementClickEvent) {
        const { elementType, expressPaymentType, resolve } = event;

        // You must call the resolve function within 1 second
      }
    }
  `;

  expressCheckoutConfirmEventTS = `
    import { Component, inject } from '@angular/core';

    import {
      injectStripe,
      StripeElementsDirective,
      StripeExpressCheckoutComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions,
      StripeExpressCheckoutElementOptions,
      StripeExpressCheckoutElementConfirmEvent
    } from '@stripe/stripe-js';

    import { YourOwnAPIService } from '../core';

    @Component({
      selector: 'ngstr-express-checkout-element-example',
      template: \`
        <div maxWidth="900">
          <div color="secondary" section-content-header>
            <span>Express Checkout Element</span>
          </div>
          <div section-content>
            <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
              <ngx-stripe-express-checkout
                [options]="options"
                (confirm)="onConfirm($event)"
              />
            </ngx-stripe-elements>
            <button (click)="pay()">PAY</button>
          </div>
        </div>
      \`,
      standalone: true,
      imports: [
        StripeElementsDirective,
        StripeExpressCheckoutComponent
      ]
    })
    export default class ExpressCheckoutElementExampleComponent {
      @ViewChild(StripeExpressCheckoutComponent)
      expressCheckout!: StripeExpressCheckoutComponent;

      private readonly yourOwnAPI = inject(YourOwnAPIService);

      stripe = injectStripe(this.plutoService.KEYS.main);
      elementsOptions: StripeElementsOptions = {
        mode: 'payment',
        amount: 1099,
        currency: 'usd',
        locale: 'es',
        clientSecret: '{{ YOUR_CLIENT_SECRET  }}'
      };

      options: StripeExpressCheckoutElementOptions = {
        buttonType: {
          applePay: 'buy',
          googlePay: 'buy'
        }
      };

      onConfirm(event: StripeExpressCheckoutElementConfirmEvent) {
        const { elementType, expressPaymentType, paymentFailed } = event;

        // You can only call \`paymentFailed\` before calling \`confirmPayment\` to signal
        // an error before payment confirmation.

        this.stripe
          .confirmPayment({
            elements: this.expressCheckout.elements,
            clientSecret: this.elementsOptions.clientSecret,
            confirmParams: {
              return_url: 'https://ngx-stripe.dev'
            }
          })
          .subscribe((result) => {
            // Handle result.error or result.paymentIntent
          });
      }
    }
  `;

  expressCheckoutCancelEventTS = `
    import { Component, inject } from '@angular/core';

    import {
      injectStripe,
      StripeElementsDirective,
      StripeExpressCheckoutComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions,
      StripeExpressCheckoutElementOptions
    } from '@stripe/stripe-js';

    import { YourOwnAPIService } from '../core';

    @Component({
      selector: 'ngstr-express-checkout-element-example',
      template: \`
        <div maxWidth="900">
          <div color="secondary" section-content-header>
            <span>Express Checkout Element</span>
          </div>
          <div section-content>
            <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
              <ngx-stripe-express-checkout
                [options]="options"
                (cancel)="onCancel()"
              />
            </ngx-stripe-elements>
            <button (click)="pay()">PAY</button>
          </div>
        </div>
      \`,
      standalone: true,
      imports: [
        StripeElementsDirective,
        StripeExpressCheckoutComponent
      ]
    })
    export default class ExpressCheckoutElementExampleComponent {
      private readonly yourOwnAPI = inject(YourOwnAPIService);

      stripe = injectStripe(this.plutoService.KEYS.main);
      elementsOptions: StripeElementsOptions = {
        mode: 'payment',
        amount: 1099,
        currency: 'usd',
        locale: 'es'
      };

      options: StripeExpressCheckoutElementOptions = {
        buttonType: {
          applePay: 'buy',
          googlePay: 'buy'
        }
      };

      onCancel() {
        // handle cancel event
      }
    }
  `;

  expressCheckoutShippingEventsTS = `
    import { Component, inject } from '@angular/core';

    import {
      injectStripe,
      StripeElementsDirective,
      StripeExpressCheckoutComponent
    } from 'ngx-stripe';
    import {
      StripeElementsOptions,
      StripeExpressCheckoutElementOptions,
      StripeExpressCheckoutElementShippingAddressChangeEvent,
      StripeExpressCheckoutElementShippingRateChangeEvent
    } from '@stripe/stripe-js';

    import { YourOwnAPIService } from '../core';

    @Component({
      selector: 'ngstr-express-checkout-element-example',
      template: \`
        <div maxWidth="900">
          <div color="secondary" section-content-header>
            <span>Express Checkout Element</span>
          </div>
          <div section-content>
            <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
              <ngx-stripe-express-checkout
                [options]="options"
                (shippingaddresschange)="onShippingAddressChange()"
                (shippingratechange)="onShippingRateChange()"
              />
            </ngx-stripe-elements>
            <button (click)="pay()">PAY</button>
          </div>
        </div>
      \`,
      standalone: true,
      imports: [
        StripeElementsDirective,
        StripeExpressCheckoutComponent
      ]
    })
    export default class ExpressCheckoutElementExampleComponent {
      private readonly yourOwnAPI = inject(YourOwnAPIService);

      stripe = injectStripe(this.plutoService.KEYS.main);
      elementsOptions: StripeElementsOptions = {
        mode: 'payment',
        amount: 1099,
        currency: 'usd',
        locale: 'es'
      };

      options: StripeExpressCheckoutElementOptions = {
        buttonType: {
          applePay: 'buy',
          googlePay: 'buy'
        }
      };

      onShippingAddressChange(event: StripeExpressCheckoutElementShippingAddressChangeEvent) {
        const { name, address, resolve, reject } = event;
        const { city, state, postal_code, country } = address;

        // handle shippingaddresschange event

        // call event.resolve within 20 seconds
      }

      onShippingRateChange(event: StripeExpressCheckoutElementShippingRateChangeEvent) {
        const { shippingRate, resolve, reject } = event;
        const { id, amount, displayName } = shippingRate;

        // handle shippingratechange event

        // call event.resolve within 20 seconds
      }
    }
  `;
}
