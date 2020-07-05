import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgxStripeModule } from 'ngx-stripe';

import { SharedModule } from '../shared/shared.module';
import { Test02Component } from './stripe-test-02.component';

const routes: Routes = [
  {
    path: '',
    component: Test02Component
  }
];

@NgModule({
  declarations: [Test02Component],
  imports: [
    CommonModule,
    NgxStripeModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class StripeTest02Module {}
