import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrSetupApplicationComponent } from './setup-application.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrSetupApplicationComponent
  }
];

@NgModule({
  declarations: [NgStrSetupApplicationComponent],
  imports: [CommonModule, RouterModule.forChild(routes), DocsElementsModule]
})
export class NgStrSetupApplicationModule {}
