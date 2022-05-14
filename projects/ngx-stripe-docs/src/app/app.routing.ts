import { Routes } from '@angular/router';

import { NgStrDocsShellComponent } from './docs-elements/docs-shell/docs-shell.component';

export const ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./welcome/welcome.module').then((m) => m.NgStrWelcomeModule)
  },
  {
    path: 'docs',
    component: NgStrDocsShellComponent,
    children: [
      {
        path: 'introduction',
        loadChildren: () => import('./docs/introduction/introduction.module').then((m) => m.NgStrIntroductionModule),
        data: { title: 'Introduction' }
      },
      {
        path: 'installation',
        loadChildren: () => import('./docs/installation/installation.module').then((m) => m.NgStrInstallationModule),
        data: { title: 'Installation' }
      },
      {
        path: 'setup-application',
        loadChildren: () =>
          import('./docs/setup-application/setup-application.module').then((m) => m.NgStrSetupApplicationModule),
        data: { title: 'Installation' }
      },
      {
        path: 'checkout',
        loadChildren: () => import('./docs/checkout/checkout.module').then((m) => m.NgStrCheckoutModule),
        data: { title: 'Checkout' }
      },
      {
        path: 'payment-element',
        loadChildren: () =>
          import('./docs/payment-element/payment-element.module').then((m) => m.NgStrPaymentElementModule),
        data: { title: 'Payment Element' }
      },
      {
        path: 'element-components',
        loadChildren: () =>
          import('./docs/element-components/element-components.module').then((m) => m.NgStrElementComponentsModule),
        data: { title: 'Elements' }
      },
      {
        path: 'identity',
        loadChildren: () => import('./docs/identity/identity.module').then((m) => m.NgStrIdentityModule),
        data: { title: 'Identity' }
      },
      {
        path: 'payment-request-button',
        loadChildren: () =>
          import('./docs/payment-request-button/payment-request-button.module').then(
            (m) => m.NgStrPaymentRequestButtonModule
          ),
        data: { title: 'Payment Request Button' }
      },
      {
        path: 'service',
        loadChildren: () => import('./docs/service/service.module').then((m) => m.NgStrServiceModule),
        data: { title: 'Stripe Service' }
      },
      {
        path: 'styling',
        loadChildren: () => import('./docs/styling/styling.module').then((m) => m.NgStrStylingModule),
        data: { title: 'Styling' }
      },
      {
        path: 'service-factory',
        loadChildren: () =>
          import('./docs/service-factory/service-factory.module').then((m) => m.NgStrServiceFactoryModule),
        data: { title: 'Stripe Factory' }
      },
      {
        path: 'reference-instance',
        loadChildren: () =>
          import('./docs/reference-instance/reference-instance.module').then((m) => m.NgStrReferenceInstanceModule),
        data: { title: 'Reference Instance' }
      },
      {
        path: 'manually-mount-your-element',
        loadChildren: () =>
          import('./docs/manually-mount/manually-mount.module').then((m) => m.NgStrManuallyMountModule),
        data: { title: 'Manually Mount your Element' }
      },
      {
        path: 'faqs',
        loadChildren: () => import('./docs/faqs/faqs.module').then((m) => m.NgStrFAQSModule),
        data: { title: 'FAQS' }
      },
      {
        path: 'examples',
        loadChildren: () => import('./docs/examples/examples.module').then((m) => m.NgStrExamplesModule),
        data: { title: 'Examples' }
      },
      {
        path: 'migration',
        loadChildren: () => import('./docs/migration/migration.module').then((m) => m.NgStrMigrationModule),
        data: { title: 'Migration' }
      },
      {
        path: 'test-01',
        loadChildren: () => import('./examples/stripe-test-01/stripe-test-01.module').then((m) => m.StripeTest01Module),
        data: { title: 'Test 01' }
      },
      {
        path: 'test-02',
        loadChildren: () => import('./examples/stripe-test-02/stripe-test-02.module').then((m) => m.StripeTest02Module),
        data: { title: 'Test 02' }
      },
      {
        path: 'test-03',
        loadChildren: () => import('./examples/stripe-test-03/stripe-test-03.module').then((m) => m.StripeTest03Module),
        data: { title: 'Test 03' }
      },
      {
        path: 'test-04',
        loadChildren: () => import('./examples/stripe-test-04/stripe-test-04.module').then((m) => m.StripeTest04Module),
        data: { title: 'Test 04' }
      },
      {
        path: 'test-05',
        loadChildren: () => import('./examples/stripe-test-05/stripe-test-05.module').then((m) => m.StripeTest05Module),
        data: { title: 'Test 05' }
      },
      {
        path: 'test-06',
        loadChildren: () => import('./examples/stripe-test-06/stripe-test-06.module').then((m) => m.StripeTest06Module),
        data: { title: 'Test 06' }
      },
      {
        path: 'test-07',
        loadChildren: () => import('./examples/stripe-test-07/stripe-test-07.module').then((m) => m.StripeTest07Module),
        data: { title: 'Test 07' }
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
