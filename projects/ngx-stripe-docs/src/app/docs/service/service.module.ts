import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrServiceComponent } from './service.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrServiceComponent
  }
];

@NgModule({
  declarations: [NgStrServiceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DocsElementsModule
  ]
})
export class NgStrServiceModule {}
