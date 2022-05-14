import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrIdentityComponent } from './identity.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrIdentityComponent
  }
];

@NgModule({
  declarations: [NgStrIdentityComponent],
  imports: [CommonModule, RouterModule.forChild(routes), DocsElementsModule]
})
export class NgStrIdentityModule {}
