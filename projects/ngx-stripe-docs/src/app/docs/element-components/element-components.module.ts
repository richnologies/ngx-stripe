import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DocsElementsModule
  ]
})
export class NgStrElementComponentsModule {}
