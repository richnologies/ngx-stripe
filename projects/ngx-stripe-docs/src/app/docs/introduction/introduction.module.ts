import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

import { IntroductionComponent } from './introduction.component';

const routes: Routes = [
  {
    path: '',
    component: IntroductionComponent
  }
];

@NgModule({
  declarations: [IntroductionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DocsElementsModule
  ]
})
export class IntroductionModule {}
