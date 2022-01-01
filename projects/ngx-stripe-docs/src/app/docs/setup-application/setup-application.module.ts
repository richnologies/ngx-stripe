import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { SetupApplicationComponent } from './setup-application.component';

const routes: Routes = [
  {
    path: '',
    component: SetupApplicationComponent
  }
];

@NgModule({
  declarations: [SetupApplicationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DocsElementsModule
  ]
})
export class SetupApplicationModule {}
