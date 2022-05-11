import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ngstr-styling',
  templateUrl: './styling.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NgStrStylingComponent {
  stylingOne = `
    import { Component, OnInit, ViewChild } from '@angular/core';

    import { StripeCardComponent } from 'ngx-stripe';
    import {
      StripeCardElementOptions,
      StripeElementsOptions
    } from '@stripe/stripe-js';

    @Component({
      selector: 'ngstr-styling-example',
      template: \`
        <ngx-stripe-card [options]="cardOptions"></ngx-stripe-card>
      \`,
    })
    export class StylingExampleComponent {
      @ViewChild(StripeCardComponent) card: StripeCardComponent;

      cardOptions: StripeCardElementOptions = {
        iconStyle: 'solid',
        style: {
          base: {
            iconColor: '#c4f0ff',
            color: '#fff',
            fontWeight: 500,
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': {color: '#fce883'},
            '::placeholder': {color: '#87bbfd'}
          },
          invalid: {
            iconColor: '#ffc7ee',
            color: '#ffc7ee'
          }
        }
      };
    }
  `;
  stylingTwo = `
    import { Component, OnInit, ViewChild } from '@angular/core';

    import { StripeCardComponent } from 'ngx-stripe';
    import {
      StripeCardElementOptions,
      StripeElementsOptions
    } from '@stripe/stripe-js';

    @Component({
      selector: 'ngstr-styling-example',
      template: \`
        <ngx-stripe-card containerClass="example"></ngx-stripe-card>
      \`,
    })
    export class StylingExampleComponent {
      @ViewChild(StripeCardComponent) card: StripeCardComponent;
    }
  `;
}
