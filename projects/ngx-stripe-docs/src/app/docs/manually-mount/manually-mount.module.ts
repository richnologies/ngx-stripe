import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrManuallyMountComponent } from './manually-mount.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrManuallyMountComponent
  }
];

@NgModule({
  declarations: [NgStrManuallyMountComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DocsElementsModule
  ]
})
export class NgStrManuallyMountModule {}
