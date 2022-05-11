import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgStrWelcomeComponent } from './welcome.component';

const routes: Routes = [
  {
    path: '',
    component: NgStrWelcomeComponent
  }
];

@NgModule({
  declarations: [NgStrWelcomeComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class NgStrWelcomeModule {}
