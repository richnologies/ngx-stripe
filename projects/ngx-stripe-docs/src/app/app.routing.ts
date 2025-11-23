import { Routes } from '@angular/router';

import { NgStrDocsShellComponent } from './docs-elements/docs-shell/docs-shell.component';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./welcome/welcome.component')
  },
  {
    path: 'docs',
    component: NgStrDocsShellComponent,
    children: [
      {
        path: 'introduction',
        loadComponent: () => import('./docs/introduction/introduction.component'),
        data: { title: 'Introduction' }
      },
      {
        path: 'installation',
        loadComponent: () => import('./docs/installation/installation.component'),
        data: { title: 'Installation' }
      },
      {
        path: 'setup-application',
        loadComponent: () => import('./docs/setup-application/setup-application.component'),
        data: { title: 'Installation' }
      },
      {
        path: 'elements',
        loadComponent: () => import('./docs/elements/elements.component'),
        data: { title: 'Elements' }
      },
      {
        path: 'payment-element',
        loadComponent: () => import('./docs/payment-element/payment-element.component'),
        data: { title: 'Payment Element' }
      },
      {
        path: 'express-checkout-element',
        loadComponent: () => import('./docs/express-checkout/express-checkout.component'),
        data: { title: 'Express Checkout Element' }
      },
      {
        path: 'link-authentication-element',
        loadComponent: () => import('./docs/link-authentication/link-authentication.component'),
        data: { title: 'Link Authentication Element' }
      },
      {
        path: 'address-element',
        loadComponent: () => import('./docs/address/address.component'),
        data: { title: 'Address Element' }
      },
      {
        path: 'issuing-elements',
        loadComponent: () => import('./docs/issuing/issuing.component'),
        data: { title: 'Issuing Elements' }
      },
      {
        path: 'card-elements',
        loadComponent: () => import('./docs/card-elements/card-elements.component'),
        data: { title: 'Card Elements' }
      },
      {
        path: 'payment-request-button',
        loadComponent: () => import('./docs/payment-request-button/payment-request-button.component'),
        data: { title: 'Payment Request Button' }
      },
      {
        path: 'checkout',
        loadComponent: () => import('./docs/checkout/checkout.component'),
        data: { title: 'Checkout' }
      },
      {
        path: 'identity',
        loadComponent: () => import('./docs/identity/identity.component'),
        data: { title: 'Identity' }
      },
      {
        path: 'service',
        loadComponent: () => import('./docs/service/service.component'),
        data: { title: 'Stripe Service' }
      },
      {
        path: 'styling',
        loadComponent: () => import('./docs/styling/styling.component'),
        data: { title: 'Styling' }
      },
      {
        path: 'reference-instance',
        loadComponent: () => import('./docs/reference-instance/reference-instance.component'),
        data: { title: 'Reference Instance' }
      },
      {
        path: 'manually-mount-your-element',
        loadComponent: () => import('./docs/manually-mount/manually-mount.component'),
        data: { title: 'Manually Mount your Element' }
      },
      {
        path: 'faqs',
        loadComponent: () => import('./docs/faqs/faqs.component'),
        data: { title: 'FAQS' }
      },
      {
        path: 'examples',
        loadComponent: () => import('./docs/examples/examples.component'),
        data: { title: 'Examples' }
      },
      {
        path: 'migration',
        loadComponent: () => import('./docs/migration/migration.component'),
        data: { title: 'Migration' }
      },
      {
        path: 'examples/address-element',
        loadComponent: () => import('./examples/address-element.component'),
        data: { title: 'Address Element Example' }
      },
      {
        path: 'examples/card-events',
        loadComponent: () => import('./examples/card-events.component'),
        data: { title: 'Card Events Example' }
      },
      {
        path: 'examples/card-one-element',
        loadComponent: () => import('./examples/card-one-element.component'),
        data: { title: 'Basic Card Example' }
      },
      {
        path: 'examples/card-payment-intent',
        loadComponent: () => import('./examples/card-payment-intent.component'),
        data: { title: 'Card Example - Payment Intent' }
      },
      {
        path: 'examples/express-checkout-element',
        loadComponent: () => import('./examples/express-checkout-element.component'),
        data: { title: 'Express Checkout Example' }
      },
      {
        path: 'examples/iban-element',
        loadComponent: () => import('./examples/iban-element.component'),
        data: { title: 'IBAN Example' }
      },
      {
        path: 'examples/issuing-elements',
        loadComponent: () => import('./examples/issuing-elements.component'),
        data: { title: 'Issuing Elements Example' }
      },
      {
        path: 'examples/link-authentication-element',
        loadComponent: () => import('./examples/link-authentication-element.component'),
        data: { title: 'Link Authentication Example' }
      },
      {
        path: 'examples/payment-element-inject',
        loadComponent: () => import('./examples/payment-element-inject.component'),
        data: { title: 'Payment Element with Inject' }
      },
      {
        path: 'examples/payment-element',
        loadComponent: () => import('./examples/payment-element.component'),
        data: { title: 'Payment Element' }
      },
      {
        path: 'examples/payment-method-messaging',
        loadComponent: () => import('./examples/payment-method-messaging.component'),
        data: { title: 'Payment Method Messaging' }
      },
      {
        path: 'examples/payment-request-button',
        loadComponent: () => import('./examples/payment-request-button.component'),
        data: { title: 'Payment Request Button' }
      },
      {
        path: 'examples/verify-microdeposits',
        loadComponent: () => import('./examples/verify-microdeposits.component'),
        data: { title: 'Verify Microdeposits Example' }
      },
      {
        path: '**',
        redirectTo: 'introduction'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
