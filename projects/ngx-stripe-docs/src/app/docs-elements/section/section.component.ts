import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  booleanAttribute,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

import { NgStrCopyLinkComponent } from '../copy-link/copy-link.component';
import { NgStrContentsComponent } from '../contents/contents.component';
import { NgStrSectionNavigatorComponent } from '../section-navigator/section-navigator.component';
import { NgStrSubheaderComponent } from '../subheader/subheader.component';

import { NgStrContainerComponent } from '../container/container.component';

@Component({
  selector: 'ngstr-section',
  templateUrl: './section.component.html',
  standalone: true,
  imports: [CommonModule, NgStrCopyLinkComponent, NgStrContentsComponent, NgStrSectionNavigatorComponent]
})
export class NgStrSectionComponent implements AfterViewInit, OnDestroy {
  @ContentChildren(NgStrSubheaderComponent) subheaders = new QueryList<NgStrSubheaderComponent>();

  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly container = inject(NgStrContainerComponent, { optional: true });

  /** Show the right-rail demo column (wide layout). */
  @Input({ transform: booleanAttribute }) demo = false;
  @Input({ transform: booleanAttribute }) aside = true;

  contents: Array<{ name: string; href: string; id: string }> = [];
  activeSection: { name: string; href: string; id: string };

  private onDestroy = new Subject<void>();

  private get window() {
    return this.document ? this.document.defaultView || (this.document as any).parentWindow : null;
  }

  get hasContainer() {
    return Boolean(this.container);
  }

  get hasDemo() {
    return this.demo && this.aside;
  }

  ngAfterViewInit() {
    if (this.window) {
      merge(fromEvent(this.window, 'scroll').pipe(throttleTime(250)), fromEvent(this.window, 'resize'))
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => {
          const trigger = Math.max(140, Math.floor(this.window.innerHeight / 6));

          this.activeSection = this.contents
            .filter((content) => {
              const el = this.document.getElementById(content.id);
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
    this.onDestroy.complete();
  }
}
