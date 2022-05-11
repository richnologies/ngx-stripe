import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrInstallationComponent } from './installation.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrInstallationComponent
  }
];

@NgModule({
  declarations: [NgStrInstallationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DocsElementsModule
  ]
})
export class NgStrInstallationModule {}
