import { Component } from '@angular/core';

import {
  NgStrCodeComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrLinkComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-setup-application',
  templateUrl: './setup-application.component.html',
  standalone: true,
  imports: [
    NgStrCodeComponent,
    NgStrHighlightComponent,
    NgStrLinkComponent,
    NgStrSectionComponent,
    NgStrDocsHeaderComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrSetupApplicationComponent {
  appModule = `
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';

    // Import your library
    import { NgxStripeModule } from 'ngx-stripe';

    @NgModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        NgxStripeModule.forRoot('***your-stripe-publishable-key***'),
        LibraryModule
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
  `;
  appConfig = `
    import { provideNgxStripe } from 'ngx-stripe';

    bootstrapApplication(AppComponent, {
      providers: [provideNgxStripe('***your-stripe-publishable-key***')]
    });
  `;
  options = `options?: { stripeAccount?: string; }`;

  /** Key known when the component is created — pass the instance to every ngx-stripe element. */
  dynamicKeyInjectStripe = `
    import { Component } from '@angular/core';

    import { StripeElementsOptions } from '@stripe/stripe-js';
    import { injectStripe, StripePaymentElementComponent } from 'ngx-stripe';

    @Component({
      selector: 'app-checkout',
      template: \`
        <ngx-stripe-payment [stripe]="stripe" [elementsOptions]="elementsOptions" />
      \`,
      standalone: true,
      imports: [StripePaymentElementComponent]
    })
    export class CheckoutComponent {
      stripe = injectStripe(environment.stripePublishableKey);
      elementsOptions: StripeElementsOptions = {
        clientSecret: '*** from your server ***'
      };
    }
  `;

  /** Key fetched asynchronously — set it on the root StripeService and render Elements after. */
  dynamicKeyChangeKey = `
    import { Component, inject, OnInit, signal } from '@angular/core';

    import { StripeElementsOptions } from '@stripe/stripe-js';
    import { StripePaymentElementComponent, StripeService } from 'ngx-stripe';

    @Component({
      selector: 'app-checkout',
      template: \`
        @if (ready()) {
          <ngx-stripe-payment [elementsOptions]="elementsOptions" />
        }
      \`,
      standalone: true,
      imports: [StripePaymentElementComponent]
    })
    export class CheckoutComponent implements OnInit {
      private stripeService = inject(StripeService);

      ready = signal(false);
      elementsOptions: StripeElementsOptions = {
        clientSecret: '*** from your server ***'
      };

      ngOnInit() {
        this.keyService.fetchPublishableKey().then((key) => {
          this.stripeService.changeKey(key);
          this.ready.set(true);
        });
      }

      constructor(private keyService: YourKeyService) {}
    }
  `;
}
