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
        path: 'test-01',
        loadComponent: () => import('./examples/stripe-test-01.component').then(m => m.Test01Component),
        data: { title: 'Test 01' }
      },
      {
        path: 'test-02',
        loadComponent: () => import('./examples/stripe-test-02.component').then(m => m.Test02Component),
        data: { title: 'Test 02' }
      },
      {
        path: 'test-03',
        loadComponent: () => import('./examples/stripe-test-03.component').then(m => m.Test03Component),
        data: { title: 'Test 03' }
      },
      {
        path: 'test-04',
        loadComponent: () => import('./examples/stripe-test-04.component').then(m => m.Test04Component),
        data: { title: 'Test 04' }
      },
      {
        path: 'test-05',
        loadComponent: () => import('./examples/stripe-test-05.component').then(m => m.Test05Component),
        data: { title: 'Test 05' }
      },
      {
        path: 'test-06',
        loadComponent: () => import('./examples/stripe-test-06.component').then(m => m.Test06Component),
        data: { title: 'Test 06' }
      },
      {
        path: 'test-07',
        loadComponent: () => import('./examples/stripe-test-07.component').then(m => m.Test07Component),
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
