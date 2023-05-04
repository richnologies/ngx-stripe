import { Component } from '@angular/core';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

@Component({
  selector: 'ngstr-checkout',
  templateUrl: './checkout.component.html',
  standalone: true,
  imports: [DocsElementsModule]
})
export class NgStrCheckoutComponent {
  checkoutTS = `
    import { Component } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { switchMap } from 'rxjs/operators';

    import { StripeService } from 'ngx-stripe';

    @Component({
      selector: 'ngstr-checkout',
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

    app.listen(4242, () => console.log(\`Listening on port \${4242}!\`));
  `;
  checkoutSubscriptionTS = `
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

      checkout(priceId) {
        // Check the server.js tab to see an example implementation
        this.http.post('/create-checkout-session', { priceId })
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
  checkoutSubscriptionHTML = `
    <div>Sign Up for the awesome product</div>
    <button (click)="checkout('price_Z0FvDp6vZvdwRZ')">
        10$ / month
    </button>
    <button (click)="checkout('price_Z2FvDp6vZvdwRZ')">
        25$ / month
    </button>
  `;
  serverSubscriptionJS = `
    // This example sets up an endpoint using the Express framework.
    // Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
    const express = require('express');
    const app = express();
    const stripe = require('stripe')('***your_secret_key****')

    app.post('/create-checkout-session', async (req, res) => {
      const { priceId } = req.body;

      // See https://stripe.com/docs/api/checkout/sessions/create
      // for additional parameters to pass.
      try {
        const session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceId,
              // For metered billing, do not pass quantity
              quantity: 1,
            },
          ],
          // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
          // the actual Session ID is returned in the query parameter when your customer
          // is redirected to the success page.
          success_url: 'https://example.com/success',
          cancel_url: 'https://example.com/cancel',
        });

        res.send({
          sessionId: session.id,
        });
      } catch (e) {
        res.status(400);
        return res.send({
          error: {
            message: e.message,
          }
        });
      }
    });
  `;
  customSuccessScreen = `
    // This example sets up an endpoint using the Express framework.
    // Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

    const express = require('express');
    const app = express();

    // Set your secret key. Remember to switch to your live secret key in production.
    // See your keys here: https://dashboard.stripe.com/apikeys
    const stripe = require('stripe')('***your secret key****');

    app.post('/order/success', async (req, res) => {
      const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
      const customer = await stripe.customers.retrieve(session.customer);

      res.send(\`
        <html>
          <body>
            <h1>Thanks for your order, \${customer.name}!</h1>
          </body>
        </html>
      \`);
    });

    app.listen(4242, () => console.log(\`Listening on port \${4242}!\`));
  `;
}
