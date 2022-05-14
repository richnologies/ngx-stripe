import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxStripeModule } from 'ngx-stripe';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrElementComponentsComponent } from './element-components.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrElementComponentsComponent
  }
];

@NgModule({
  declarations: [NgStrElementComponentsComponent],
  imports: [CommonModule, ReactiveFormsModule, NgxStripeModule, RouterModule.forChild(routes), DocsElementsModule]
})
export class NgStrElementComponentsModule {}
