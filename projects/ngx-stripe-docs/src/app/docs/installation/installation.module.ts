import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { InstallationComponent } from './installation.component';

const routes: Routes = [
  {
    path: '',
    component: InstallationComponent
  }
];

@NgModule({
  declarations: [InstallationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DocsElementsModule
  ]
})
export class InstallationModule {}
