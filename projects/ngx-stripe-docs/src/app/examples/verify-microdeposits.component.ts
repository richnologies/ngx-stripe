import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { injectStripe } from 'ngx-stripe';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-verify-microdeposits-example',
  template: `
    <div maxWidth="900">
      <div color="secondary" section-content-header>
        <span>Verify Microdeposits</span>
      </div>
      <div section-content>
        <button (click)="pay()">PAY</button>
        <button (click)="verifyMicrodeposits()">VERIFY</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ReactiveFormsModule]
})
export default class VerifyMicrodepositsExampleComponent {
  private readonly plutoService = inject(NgStrPlutoService);

  stripe = injectStripe(this.plutoService.KEYS.usa);
  elementOptions = {
    style: {
      base: {
        padding: '10px 12px',
        color: '#32325d',
        fontSize: '16px'
      }
    },
    accountHolderType: 'individual'
  };

  paying = false;
  clientSecret = 'seti_1MHzwWCFzZvO65bF1voT4xPv_secret_N2443bqf1USOXVX7lc2N3rmDhH2n9yM';

  pay() {
    this.stripe
      .confirmAcssDebitSetup(this.clientSecret, {
        payment_method: {
          billing_details: {
            name: 'Ricardo Sanchez',
            email: 'ric.sanchez@me.com'
          }
        }
      })
      .subscribe(({ setupIntent, error }) => {
        console.log({ setupIntent, error });
      });
  }

  verifyMicrodeposits() {
    this.stripe
      .verifyMicrodepositsForSetup(this.clientSecret, {
        amounts: [32, 45]
      })
      .subscribe((result) => {
        console.log('result', result);
      });
  }
}
