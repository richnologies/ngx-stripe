import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxStripeModule } from 'ngx-stripe';

import { Test07Component } from './stripe-test-07.component';

const routes: Routes = [
  {
    path: '',
    component: Test07Component
  }
];

@NgModule({
  declarations: [Test07Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgxStripeModule
  ]
})
export class StripeTest07Module {}
