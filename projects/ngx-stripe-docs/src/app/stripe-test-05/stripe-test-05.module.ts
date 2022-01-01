import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxStripeModule } from 'ngx-stripe';

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
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxStripeModule
  ]
})
export class StripeTest05Module {}
