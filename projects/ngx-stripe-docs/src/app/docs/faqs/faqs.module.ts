import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrFAQSComponent } from './faqs.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrFAQSComponent
  }
];

@NgModule({
  declarations: [NgStrFAQSComponent],
  imports: [CommonModule, RouterModule.forChild(routes), DocsElementsModule]
})
export class NgStrFAQSModule {}
