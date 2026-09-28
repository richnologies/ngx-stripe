import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgStrPanelComponent } from '../panel/panel.component';

@Component({
  selector: 'ngstr-ownership-callout',
  standalone: true,
  imports: [NgStrPanelComponent, RouterLink],
  template: `
    <ngstr-panel type="info" class="block mb-6" data-testid="ownership-callout">
      <p class="font-semibold mb-1">Stripe vs ngx-stripe</p>
      <p class="text-sm">
        <strong>ngx-stripe</strong> owns Angular DI, Observables, CDN loader choice, and Element host lifecycle.
        <strong>Stripe.js</strong> owns Element appearance, payment methods, validation messaging, and PCI. Styling,
        placeholders, installments, and most “why doesn’t this option work?” questions belong in
        <a class="underline" href="https://docs.stripe.com/js" target="_blank" rel="noopener noreferrer"
          >Stripe’s docs</a
        >, not a library bug. See also <a class="underline" routerLink="/docs/faqs">FAQs</a> and
        <a class="underline" routerLink="/docs/csp">CSP</a>.
      </p>
    </ngstr-panel>
  `
})
export class NgStrOwnershipCalloutComponent {}
