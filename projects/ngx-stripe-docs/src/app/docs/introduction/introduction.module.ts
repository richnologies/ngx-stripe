import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { NgStrIntroductionComponent } from './introduction.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrIntroductionComponent
  }
];

@NgModule({
  declarations: [NgStrIntroductionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DocsElementsModule
  ]
})
export class NgStrIntroductionModule {}
