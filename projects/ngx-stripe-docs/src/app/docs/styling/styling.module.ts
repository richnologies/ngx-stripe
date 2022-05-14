import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrStylingComponent } from './styling.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrStylingComponent
  }
];

@NgModule({
  declarations: [NgStrStylingComponent],
  imports: [CommonModule, RouterModule.forChild(routes), DocsElementsModule]
})
export class NgStrStylingModule {}
