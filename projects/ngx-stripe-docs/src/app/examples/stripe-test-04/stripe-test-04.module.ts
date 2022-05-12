import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgxStripeModule } from 'ngx-stripe';

import { Test04Component } from './stripe-test-04.component';

const routes: Routes = [
  {
    path: '',
    component: Test04Component
  }
];

@NgModule({
  declarations: [Test04Component],
  imports: [
    CommonModule,
    NgxStripeModule,
    RouterModule.forChild(routes)
  ]
})
export class StripeTest04Module {}
