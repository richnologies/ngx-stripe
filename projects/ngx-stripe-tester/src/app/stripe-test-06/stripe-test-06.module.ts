import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgxStripeModule } from 'ngx-stripe';

import { SharedModule } from '../shared/shared.module';
import { Test06Component } from './stripe-test-06.component';

const routes: Routes = [
  {
    path: '',
    component: Test06Component
  }
];

@NgModule({
  declarations: [Test06Component],
  imports: [
    CommonModule,
    NgxStripeModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class StripeTest06Module {}
