import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgxStripeModule } from 'ngx-stripe';

import { SharedModule } from '../shared/shared.module';
import { Test05Component } from './stripe-test-05.component';

const routes: Routes = [
  {
    path: '',
    component: Test05Component
  }
];

@NgModule({
  declarations: [Test05Component],
  imports: [
    CommonModule,
    NgxStripeModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class StripeTest05Module {}
