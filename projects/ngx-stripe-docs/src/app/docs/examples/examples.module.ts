import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrExamplesComponent } from './examples.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrExamplesComponent
  }
];

@NgModule({
  declarations: [NgStrExamplesComponent],
  imports: [CommonModule, RouterModule.forChild(routes), DocsElementsModule]
})
export class NgStrExamplesModule {}
