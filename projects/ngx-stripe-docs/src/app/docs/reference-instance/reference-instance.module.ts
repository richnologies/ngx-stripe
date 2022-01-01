import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrReferenceInstanceComponent } from './reference-instance.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrReferenceInstanceComponent
  }
];

@NgModule({
  declarations: [NgStrReferenceInstanceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DocsElementsModule
  ]
})
export class NgStrReferenceInstanceModule {}
