import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from './material.module';
import { SidenavResizeDirective } from './sidenav/sidenav-resize.directive';
import { CloseOnNavDirective } from './sidenav/close-on-nav.directive';
import { RoutingLoaderDirective } from './routing-loader/routing-loader.directive';
import { SectionComponent } from './section/section.component';
import { FabButtonComponent } from './fab-button/fab-button.component';

@NgModule({
  exports: [
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CloseOnNavDirective,
    SidenavResizeDirective,
    RoutingLoaderDirective,
    SectionComponent,
    FabButtonComponent
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule],
  declarations: [
    CloseOnNavDirective,
    SidenavResizeDirective,
    RoutingLoaderDirective,
    SectionComponent,
    FabButtonComponent
  ]
})
export class SharedModule {}
