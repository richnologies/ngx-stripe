import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: 'test-01',
    loadChildren: () => import('./stripe-test-01/stripe-test-01.module').then(m => m.StripeTest01Module)
  },
  {
    path: 'test-02',
    loadChildren: () => import('./stripe-test-02/stripe-test-02.module').then(m => m.StripeTest02Module)
  },
  {
    path: 'test-03',
    loadChildren: () => import('./stripe-test-03/stripe-test-03.module').then(m => m.StripeTest03Module)
  },
  {
    path: 'test-04',
    loadChildren: () => import('./stripe-test-04/stripe-test-04.module').then(m => m.StripeTest04Module)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomeModule)
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];
