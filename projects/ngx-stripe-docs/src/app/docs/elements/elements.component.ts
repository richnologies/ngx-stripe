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
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-elements',
  templateUrl: './elements.component.html',
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
    NgStrSectionComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrElementsComponent {
  elementsWithInject = `
    import { Component } from '@angular/core';

    import { StripeElementsOptions } from '@stripe/stripe-js';
    import {
      injectStripe,
      StripeElementsDirective,
      StripePaymentElementComponent
    } from 'ngx-stripe';

    @Component({
      selector: 'app-root',
      template: \`
        <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-payment />
        </ngx-stripe-elements>
      \`,
      standalone: true,
      imports: [
        StripeElementsDirective,
        StripePaymentElementComponent
      ]
    })
    export class AppComponent {
      stripe = injectStripe({{your-stripe-publishable-key}});
      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        // passing the client secret obtained from the server
        clientSecret: '{{CLIENT_SECRET}}'
      };
    }
  `;

  elementsWithModules = `
    import { Component } from '@angular/core';

    import { StripeElementsOptions } from '@stripe/stripe-js';
    import {
      injectStripe,
      StripeFactoryService
    } from 'ngx-stripe';

    @Component({
      selector: 'app-root',
      template: \`
        <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-payment />
        </ngx-stripe-elements>
      \`
    })
    export class AppComponent {
      stripe = this.factoryService.create({{your-stripe-publishable-key}});
      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        // passing the client secret obtained from the server
        clientSecret: '{{CLIENT_SECRET}}'
      };

      constructor(private factoryService: StripeFactoryService) {}
    }
  `;

  fetchUpdates = `
    import { Component, ViewChild } from '@angular/core';

    import { StripeElementsOptions } from '@stripe/stripe-js';
    import {
      injectStripe,
      StripeElementsDirective,
      StripePaymentElementComponent
    } from 'ngx-stripe';

    @Component({
      selector: 'app-root',
      template: \`
        <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-payment />
        </ngx-stripe-elements>
      \`,
      standalone: true,
      imports: [
        StripeElementsDirective,
        StripePaymentElementComponent
      ]
    })
    export class AppComponent {
      @ViewChild(StripeElementsDirective) elements!: StripeElementsDirective;

      stripe = injectStripe({{your-stripe-publishable-key}});
      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        // passing the client secret obtained from the server
        clientSecret: '{{CLIENT_SECRET}}'
      };

      fetchUpdates() {
        this.elements.fetchUpdates();
      }
    }
  `;

  updateElements = `
    import { Component, OnInit, ViewChild } from '@angular/core';

    import { StripeElementsOptions, StripeElementsUpdateOptions } from '@stripe/stripe-js';
    import {
      injectStripe,
      StripeElementsDirective,
      StripePaymentElementComponent
    } from 'ngx-stripe';

    @Component({
      selector: 'app-root',
      template: \`
        <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-payment />
        </ngx-stripe-elements>
      \`,
      standalone: true,
      imports: [
        StripeElementsDirective,
        StripePaymentElementComponent
      ]
    })
    export class AppComponent implements OnInit {
      @ViewChild(StripeElementsDirective) elements!: StripeElementsDirective;

      stripe = injectStripe({{your-stripe-publishable-key}});
      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        // passing the client secret obtained from the server
        clientSecret: '{{CLIENT_SECRET}}'
      };

      ngOnInit() {
        // But can simply be done by updating the options
        setTimeout(() => {
          this.elementsOptions.locale = 'fr';
        }, 1000);
      }

      update(options: StripeElementsUpdateOptions) {
        // This is the imperative way to update the elements
        this.elements.update();
      }
    }
  `;

  getElement = `
    import { Component, ViewChild } from '@angular/core';

    import { StripeElementsOptions, StripePaymentElement } from '@stripe/stripe-js';
    import {
      injectStripe,
      StripeElementsDirective,
      StripePaymentElementComponent
    } from 'ngx-stripe';

    @Component({
      selector: 'app-root',
      template: \`
        <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-payment />
        </ngx-stripe-elements>
      \`,
      standalone: true,
      imports: [
        StripeElementsDirective,
        StripePaymentElementComponent
      ]
    })
    export class AppComponent {
      @ViewChild(StripeElementsDirective) elements!: StripeElementsDirective;

      stripe = injectStripe({{your-stripe-publishable-key}});
      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        // passing the client secret obtained from the server
        clientSecret: '{{CLIENT_SECRET}}'
      };

      getElement() {
        const paymentElement = this.elements.getElement('payment');

        console.log(paymentElement instanceof StripePaymentElement); // true
      }
    }
  `;

  submit = `
    import { Component, ViewChild } from '@angular/core';

    import { StripeElementsOptions } from '@stripe/stripe-js';
    import {
      injectStripe,
      StripeElementsDirective,
      StripePaymentElementComponent
    } from 'ngx-stripe';

    @Component({
      selector: 'app-root',
      template: \`
        <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-payment />
        </ngx-stripe-elements>
      \`,
      standalone: true,
      imports: [
        StripeElementsDirective,
        StripePaymentElementComponent
      ]
    })
    export class AppComponent {
      @ViewChild(StripeElementsDirective) elements!: StripeElementsDirective;

      stripe = injectStripe({{your-stripe-publishable-key}});
      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        // passing the client secret obtained from the server
        clientSecret: '{{CLIENT_SECRET}}'
      };

      submit() {
        this.elements.submit();
      }
    }
  `;

  defaultInstanceWithInject = `
    import { Component } from '@angular/core';

    import { StripeElementsOptions } from '@stripe/stripe-js';
    import {
      injectStripe,
      StripeElementsDirective,
      StripePaymentElementComponent
    } from 'ngx-stripe';

    @Component({
      selector: 'app-root',
      template: \`
        <ngx-stripe-elements [stripe]="stripe" [elementsOptions]="elementsOptions">
          <ngx-stripe-payment />
        </ngx-stripe-elements>
      \`,
      standalone: true,
      imports: [
        StripeElementsDirective,
        StripePaymentElementComponent
      ]
    })
    export class AppComponent {
      stripe = injectStripe();
      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        // passing the client secret obtained from the server
        clientSecret: '{{CLIENT_SECRET}}'
      };
    }
  `;

  implicitElements = `
    import { Component } from '@angular/core';

    import { StripeElementsOptions } from '@stripe/stripe-js';
    import { injectStripe, StripePaymentElementComponent } from 'ngx-stripe';

    @Component({
      selector: 'app-root',
      template: \`
        <ngx-stripe-payment [stripe]="stripe" [elementsOptions]="elementsOptions" />
      \`,
      standalone: true,
      imports: [
        StripePaymentElementComponent
      ]
    })
    export class AppComponent {
      stripe = injectStripe({{your-stripe-publishable-key}});
      elementsOptions: StripeElementsOptions = {
        locale: 'en',
        // passing the client secret obtained from the server
        clientSecret: '{{CLIENT_SECRET}}'
      };
    }
  `;
}
