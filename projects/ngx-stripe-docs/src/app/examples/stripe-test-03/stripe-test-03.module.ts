import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgxStripeModule } from 'ngx-stripe';

import { Test03Component } from './stripe-test-03.component';

const routes: Routes = [
  {
    path: '',
    component: Test03Component
  }
];

@NgModule({
  declarations: [Test03Component],
  imports: [
    CommonModule,
    NgxStripeModule,
    RouterModule.forChild(routes)
  ]
})
export class StripeTest03Module {}
