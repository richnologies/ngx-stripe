import { Routes } from '@angular/router';

import { NgStrDocsShellComponent } from './docs-elements/docs-shell/docs-shell.component';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./welcome/welcome.component').then(m => m.NgStrWelcomeComponent)
  },
  {
    path: 'docs',
    component: NgStrDocsShellComponent,
    children: [
      {
        path: 'introduction',
        loadComponent: () => import('./docs/introduction/introduction.component').then((m) => m.NgStrIntroductionComponent),
        data: { title: 'Introduction' }
      },
      {
        path: 'installation',
        loadComponent: () => import('./docs/installation/installation.component').then((m) => m.NgStrInstallationComponent),
        data: { title: 'Installation' }
      },
      {
        path: 'setup-application',
        loadComponent: () =>
          import('./docs/setup-application/setup-application.component').then((m) => m.NgStrSetupApplicationComponent),
        data: { title: 'Installation' }
      },
      {
        path: 'checkout',
        loadComponent: () => import('./docs/checkout/checkout.component').then(m => m.NgStrCheckoutComponent),
        data: { title: 'Checkout' }
      },
      {
        path: 'payment-element',
        loadComponent: () =>
          import('./docs/payment-element/payment-element.component').then((m) => m.NgStrPaymentElementComponent),
        data: { title: 'Payment Element' }
      },
      {
        path: 'element-components',
        loadComponent: () =>
          import('./docs/element-components/element-components.component').then((m) => m.NgStrElementComponentsComponent),
        data: { title: 'Elements' }
      },
      {
        path: 'identity',
        loadComponent: () => import('./docs/identity/identity.component').then((m) => m.NgStrIdentityComponent),
        data: { title: 'Identity' }
      },
      {
        path: 'payment-request-button',
        loadComponent: () =>
          import('./docs/payment-request-button/payment-request-button.component').then(
            (m) => m.NgStrPaymentRequestButtonComponent
          ),
        data: { title: 'Payment Request Button' }
      },
      {
        path: 'service',
        loadComponent: () => import('./docs/service/service.component').then((m) => m.NgStrServiceComponent),
        data: { title: 'Stripe Service' }
      },
      {
        path: 'styling',
        loadComponent: () => import('./docs/styling/styling.component').then((m) => m.NgStrStylingComponent),
        data: { title: 'Styling' }
      },
      {
        path: 'service-factory',
        loadComponent: () =>
          import('./docs/service-factory/service-factory.component').then((m) => m.NgStrServiceFactoryComponent),
        data: { title: 'Stripe Factory' }
      },
      {
        path: 'reference-instance',
        loadComponent: () =>
          import('./docs/reference-instance/reference-instance.component').then((m) => m.NgStrReferenceInstanceComponent),
        data: { title: 'Reference Instance' }
      },
      {
        path: 'manually-mount-your-element',
        loadComponent: () =>
          import('./docs/manually-mount/manually-mount.component').then((m) => m.NgStrManuallyMountComponent),
        data: { title: 'Manually Mount your Element' }
      },
      {
        path: 'faqs',
        loadComponent: () => import('./docs/faqs/faqs.component').then((m) => m.NgStrFAQSComponent),
        data: { title: 'FAQS' }
      },
      {
        path: 'examples',
        loadComponent: () => import('./docs/examples/examples.component').then((m) => m.NgStrExamplesComponent),
        data: { title: 'Examples' }
      },
      {
        path: 'migration',
        loadComponent: () => import('./docs/migration/migration.component').then((m) => m.NgStrMigrationComponent),
        data: { title: 'Migration' }
      },
      {
        path: 'examples/address-element',
        loadComponent: () => import('./examples/address-element.component').then(m => m.AddressElementExampleComponent),
        data: { title: 'Address Element Example' }
      },
      {
        path: 'examples/affirm-message',
        loadComponent: () => import('./examples/affirm-message-element.component').then(m => m.AffirmMessageExampleComponent),
        data: { title: 'Affirm Message Example' }
      },
      {
        path: 'examples/afterpay-clearpay-message',
        loadComponent: () => import('./examples/afterpay-clearpay-message-element.component').then(m => m.AfterpayClearpayMessageExampleComponent),
        data: { title: 'Clearpay Afterpay Message Example' }
      },
      {
        path: 'examples/card-one-element',
        loadComponent: () => import('./examples/card-one-element.component').then(m => m.CardOneElementExampleComponent),
        data: { title: 'Basic Card Example' }
      },
      {
        path: 'examples/card-payment-intent',
        loadComponent: () => import('./examples/card-payment-intent.component').then(m => m.CardPaymentIntentExampleComponent),
        data: { title: 'Card Example - Payment Intent' }
      },
      {
        path: 'examples/eps-bank-element',
        loadComponent: () => import('./examples/eps-bank-element.component').then(m => m.EpsBankExampleComponent),
        data: { title: 'EPS Bank Example' }
      },
      {
        path: 'examples/fpx-element',
        loadComponent: () => import('./examples/fpx-element.component').then(m => m.FpxExampleComponent),
        data: { title: 'FPX Example' }
      },
      {
        path: 'examples/iban-element',
        loadComponent: () => import('./examples/iban-element.component').then(m => m.IbanElementExampleComponent),
        data: { title: 'IBAN Example' }
      },
      {
        path: 'examples/link-authentication-element',
        loadComponent: () => import('./examples/link-authentication-element.component').then(m => m.LinkAuthenticationElementExampleComponent),
        data: { title: 'Link Authentication Example' }
      },
      {
        path: 'examples/p24-bank-element',
        loadComponent: () => import('./examples/p24-bank-element.component').then(m => m.P24BankExampleComponent),
        data: { title: 'P24 Bank Example' }
      },
      {
        path: 'examples/payment-element',
        loadComponent: () => import('./examples/payment-element.component').then(m => m.PaymentElementExampleComponent),
        data: { title: 'Payment Element' }
      },
      {
        path: 'examples/payment-method-messaging',
        loadComponent: () =>
          import('./examples/payment-method-messaging.component').then((m) => m.PaymentMethodMessagingExampleComponent),
        data: { title: 'Payment Method Messaging' }
      },
      {
        path: 'examples/payment-request-button',
        loadComponent: () => import('./examples/payment-request-button.component').then(m => m.PaymentRequestButtonExampleComponent),
        data: { title: 'Payment Request Button' }
      },
      {
        path: 'examples/verify-microdeposits',
        loadComponent: () => import('./examples/verify-microdeposits.component').then(m => m.VerifyMicrodepositsExampleComponent),
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
