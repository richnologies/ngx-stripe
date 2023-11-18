import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

import { NgStrCopyLinkComponent } from '../copy-link/copy-link.component';
import { NgStrContentsComponent } from '../contents/contents.component';
import { NgStrSectionNavigatorComponent } from '../section-navigator/section-navigator.component';
import { NgStrSubheaderComponent } from '../subheader/subheader.component';

import { NgStrSectionAsideDirective } from './section-aside.directive';
import { NgStrSectionMainDirective } from './section-main.directive';
import { NgStrContainerComponent } from '../container/container.component';

@Component({
  selector: 'ngstr-section',
  templateUrl: './section.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NgStrCopyLinkComponent,
    NgStrContentsComponent,
    NgStrSectionNavigatorComponent,
    NgStrSubheaderComponent,
    NgStrSectionAsideDirective,
    NgStrSectionMainDirective
  ]
})
export class NgStrSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sectionContainer') section: ElementRef;
  @ContentChildren(NgStrSubheaderComponent) subheaders = new QueryList<NgStrSubheaderComponent>();

  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly container = inject(NgStrContainerComponent, { optional: true });

  @Input() aside = true;

  contents: Array<{ name: string; href: string; id: string }> = [];
  activeSection: { name: string; href: string; id: string };

  private onDestroy = new Subject<void>();

  private get window() {
    return this.document ? this.document.defaultView || (this.document as any).parentWindow : null;
  }

  get hasContainer() {
    return Boolean(this.container);
  }

  ngAfterViewInit() {
    if (this.window) {
      merge(fromEvent(this.section.nativeElement, 'scroll').pipe(throttleTime(250)), fromEvent(this.window, 'resize'))
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => {
          const sectionClientReact = this.section.nativeElement.getBoundingClientRect();
          const trigger =
            sectionClientReact && sectionClientReact.height ? Math.floor(sectionClientReact.height / 6) : 150;

          this.activeSection = this.contents
            .filter((content) => {
              const el = document.getElementById(content.id);
              if (!el) return false;

              const { y } = el.getBoundingClientRect();

              return y < trigger;
            })
            .reverse()[0];
        });
    }

    this.contents = this.subheaders
      .filter(
        (row) =>
          row.link &&
          typeof row.link === 'string' &&
          row.link.trim().length > 0 &&
          row.subheader &&
          typeof row.subheader === 'string' &&
          row.subheader.trim().length > 0
      )
      .map((subheader) => ({
        id: subheader.link,
        name: subheader.subheader,
        href: `${this.router.url.split('#')[0]}#${subheader.link}`
      }));
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
