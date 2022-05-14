import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgxStripeModule } from 'ngx-stripe';

import { Test02Component } from './stripe-test-02.component';

const routes: Routes = [
  {
    path: '',
    component: Test02Component
  }
];

@NgModule({
  declarations: [Test02Component],
  imports: [CommonModule, NgxStripeModule, RouterModule.forChild(routes)]
})
export class StripeTest02Module {}
