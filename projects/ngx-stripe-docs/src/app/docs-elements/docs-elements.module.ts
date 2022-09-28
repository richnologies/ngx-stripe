import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HighlightModule } from 'ngx-highlightjs';

import { NgStrCodeComponent } from './code/code.component';
import { NgStrCodeGroup } from './code-group/code-group.component';
import { NgStrContentsComponent } from './contents/contents.component';
import { NgStrCopyLinkComponent } from './copy-link/copy-link.component';
import { NgStrDocsShellComponent } from './docs-shell/docs-shell.component';
import { NgStrFlipContainerComponent } from './flip-container/flip-container.component';
import { NgStrHighlightComponent } from './highlight/highlight.component';
import { NgStrLinkComponent } from './link/link.component';
import { NgStrDocsHeaderComponent } from './header/header.component';
import { NgStrPanelComponent } from './panel/panel.component';
import { NgStrSectionComponent } from './section/section.component';
import { NgStrSectionNavigatorComponent } from './section-navigator/section-navigator.component';
import { NgStrSubheaderComponent } from './subheader/subheader.component';

import { NgStrSectionMainDirective } from './section/section-main.directive';
import { NgStrSectionAsideDirective } from './section/section-aside.directive';

import { NgStrCodeFormatPipe } from './code/code-format.pipe';
import { NgStrGroupNamePipe } from './section/group-name.pipe';

const components = [
  NgStrCodeComponent,
  NgStrCodeGroup,
  NgStrContentsComponent,
  NgStrCopyLinkComponent,
  NgStrDocsShellComponent,
  NgStrFlipContainerComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrLinkComponent,
  NgStrPanelComponent,
  NgStrSectionComponent,
  NgStrSectionNavigatorComponent,
  NgStrSubheaderComponent
];

const directives = [NgStrSectionMainDirective, NgStrSectionAsideDirective];

const pipes = [NgStrCodeFormatPipe, NgStrGroupNamePipe];

@NgModule({
  declarations: [...components, ...directives, ...pipes],
  exports: [CommonModule, ...components, ...directives, ...pipes, HighlightModule],
  imports: [CommonModule, RouterModule, HighlightModule]
})
export class DocsElementsModule {}
