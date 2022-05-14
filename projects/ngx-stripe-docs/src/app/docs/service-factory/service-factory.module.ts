import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrServiceFactoryComponent } from './service-factory.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrServiceFactoryComponent
  }
];

@NgModule({
  declarations: [NgStrServiceFactoryComponent],
  imports: [CommonModule, RouterModule.forChild(routes), DocsElementsModule]
})
export class NgStrServiceFactoryModule {}
