import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgStrPanelComponent } from '../panel/panel.component';

@Component({
  selector: 'ngstr-ownership-callout',
  standalone: true,
  imports: [NgStrPanelComponent, RouterLink],
  template: `
    <ngstr-panel type="info" class="block mb-6" data-testid="ownership-callout">
      <p class="font-semibold mb-1">How ngx-stripe and Stripe.js fit together</p>
      <p class="text-sm leading-relaxed">
        Happy to help with either — this note just points you to the fastest answer.
        <strong>ngx-stripe</strong> wraps Stripe.js for Angular (DI, Observables, CDN loading, Element hosts).
        <strong>Stripe.js</strong> owns Element appearance, payment methods, validation copy, and PCI. For styling,
        placeholders, installments, and Element options, Stripe’s docs are usually the best first stop; for Angular
        setup and our components, you’re in the right place. See also
        <a class="underline" routerLink="/docs/faqs">FAQs</a>,
        <a class="underline" routerLink="/docs/csp">CSP</a>, and
        <a class="underline" href="https://docs.stripe.com/js" target="_blank" rel="noopener noreferrer"
          >Stripe.js</a
        >.
      </p>
    </ngstr-panel>
  `
})
export class NgStrOwnershipCalloutComponent {}
