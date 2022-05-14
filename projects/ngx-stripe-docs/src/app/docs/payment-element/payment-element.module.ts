import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxStripeModule } from 'ngx-stripe';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrPaymentElementComponent } from './payment-element.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrPaymentElementComponent
  }
];

@NgModule({
  declarations: [NgStrPaymentElementComponent],
  imports: [CommonModule, ReactiveFormsModule, NgxStripeModule, RouterModule.forChild(routes), DocsElementsModule]
})
export class NgStrPaymentElementModule {}
