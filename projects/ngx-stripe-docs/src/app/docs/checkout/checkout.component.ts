import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CheckoutComponent {
  checkoutTS = `
    import { Component } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { switchMap } from 'rxjs/operators';

    import { StripeService } from 'ngx-stripe';

    @Component({
      selector: 'app-checkout',
      templateUrl: './checkout.component.html'
    })
    export class CheckoutComponent {
      constructor(
        private http: HttpClient,
        private stripeService: StripeService
      ) {}

      checkout() {
        // Check the server.js tab to see an example implementation
        this.http.post('/create-checkout-session', {})
          .pipe(
            switchMap(session => {
              return this.stripeService.redirectToCheckout({ sessionId: session.id })
            })
          )
          .subscribe(result => {
            // If \`redirectToCheckout\` fails due to a browser or network
            // error, you should display the localized error message to your
            // customer using \`error.message\`.
            if (result.error) {
              alert(result.error.message);
            }
          });
      }
    }
  `;
  checkoutHTML = `
    <button (click)="checkout()">
      GO TO CHECKOUT
    </button>
  `;
  serverJS = `
    // This example sets up an endpoint using the Express framework.
    // Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

    const express = require('express');
    const app = express();
    const stripe = require('stripe')('***your secret key***');

    app.post('/create-checkout-session', async (req, res) => {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'T-shirt',
              },
              unit_amount: 2000,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });

      res.json({ id: session.id });
    });

    app.listen(4242, () => console.log(\`Listening on port ${4242}!\`));
  `;
}
