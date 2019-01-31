import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: 'test-01',
    loadChildren: './stripe-test-01/stripe-test-01.module#StripeTest01Module'
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
