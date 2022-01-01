import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrMigrationComponent } from './migration.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrMigrationComponent
  }
];

@NgModule({
  declarations: [NgStrMigrationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DocsElementsModule
  ]
})
export class NgStrMigrationModule {}
