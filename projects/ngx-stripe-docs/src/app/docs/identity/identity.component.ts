import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ngstr-identity',
  templateUrl: './identity.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NgStrIdentityComponent {
  identityOneTS = `
    import { Component } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { switchMap } from 'rxjs/operators';

    import { StripeService } from 'ngx-stripe';

    @Component({
      selector: 'ngstr-identity',
      templateUrl: './identity.component.html'
    })
    export class IdentityComponent {
      constructor(
        private http: HttpClient,
        private stripeService: StripeService
      ) {}

      verify() {
        // Check the server.js tab to see an example implementation
        this.https.post('/create-verification-session', {})
          .pipe(
            switchMap(session => {
              // Show the verification modal.
              return this.stripeService.verifyIdentity(session.clientSecret)
            })
          )
          .subscribe(result => {
            // If \`verifyIdentity\` fails, you should display the localized
            // error message to your user using \`error.message\`.
            if (result.error) {
              alert(result.error.message);
            }
          });
      }
    }
  `;
  identityOneHTML = `
    <button (click)="verify()">
      VERIFY
    </button>
  `;
  identityOneServer = `
    // This example sets up an endpoint using the Express framework.
    // Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

    const express = require('express');
    const app = express();
    const stripe = require('stripe')('***your secret key***');

    app.post('/create-verification-session', async (req, res) => {
      const verificationSession = await stripe.identity.verificationSessions.create({
        type: 'document',
        metadata: {
          user_id: '{{USER_ID}}',
        }
      });

      // Return only the client secret to the frontend
      res.json({ clientSecret: verificationSession.clientSecret });
    });

    app.listen(4242, () => console.log(\`Listening on port ${4242}!\`));
  `;
  identityTwoTS = `
    import { Component, Inject } from '@angular/core';
    import { DOCUMENT } from '@angular/common';
    import { HttpClient } from '@angular/common/http';
    import { switchMap } from 'rxjs/operators';

    @Component({
      selector: 'ngstr-identity',
      templateUrl: './identity.component.html'
    })
    export class IdentityComponent {
      constructor(
        @Inject(DOCUMENT) private document: Document,
        private http: HttpClient
      ) {}

      verify() {
        // Check the server.js tab to see an example implementation
        this.https.post('/create-verification-session', {})
          .subscribe(session => {
            this.document.location.href = session.url;
          });
      }
    }
  `;
  identityTwoHTML = `
    <button (click)="verify()">
      VERIFY
    </button>
  `;
  identityTwoServer = `
    // This example sets up an endpoint using the Express framework.
    // Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

    const express = require('express');
    const app = express();
    const stripe = require('stripe')('***your secret key***');

    app.post('/create-verification-session', async (req, res) => {
      const verificationSession = await stripe.identity.verificationSessions.create({
        type: 'document',
        metadata: {
          user_id: '{{USER_ID}}',
        }
      });

      // Return only the session URL to the frontend
      res.json({ url: verificationSession.url });
    });

    app.listen(4242, () => console.log(\`Listening on port ${4242}!\`));
  `;
}
