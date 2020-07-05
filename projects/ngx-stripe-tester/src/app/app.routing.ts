import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: 'test-01',
    loadChildren: './stripe-test-01/stripe-test-01.module#StripeTest01Module'
  },
  {
    path: 'test-02',
    loadChildren: './stripe-test-02/stripe-test-02.module#StripeTest02Module'
  },
  {
    path: 'test-03',
    loadChildren: './stripe-test-03/stripe-test-03.module#StripeTest03Module'
  },
  {
    path: 'test-04',
    loadChildren: './stripe-test-04/stripe-test-04.module#StripeTest04Module'
  },
  {
    path: 'welcome',
    loadChildren: './welcome/welcome.module#WelcomeModule'
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];
