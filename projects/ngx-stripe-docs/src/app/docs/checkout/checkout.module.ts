import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrCheckoutComponent } from './checkout.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrCheckoutComponent
  }
];

@NgModule({
  declarations: [NgStrCheckoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DocsElementsModule
  ]
})
export class NgStrCheckoutModule {}
