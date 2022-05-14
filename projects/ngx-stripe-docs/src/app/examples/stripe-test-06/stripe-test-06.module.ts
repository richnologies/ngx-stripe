import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxStripeModule } from 'ngx-stripe';

import { Test06Component } from './stripe-test-06.component';

const routes: Routes = [
  {
    path: '',
    component: Test06Component
  }
];

@NgModule({
  declarations: [Test06Component],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), NgxStripeModule]
})
export class StripeTest06Module {}
