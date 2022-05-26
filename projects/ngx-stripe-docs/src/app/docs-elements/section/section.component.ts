import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  QueryList,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

import { NgStrSubheaderComponent } from '../subheader/subheader.component';

@Component({
  selector: 'ngstr-section',
  templateUrl: './section.component.html'
})
export class NgStrSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sectionContainer') section: ElementRef;
  @ContentChildren(NgStrSubheaderComponent) subheaders = new QueryList<NgStrSubheaderComponent>();

  @Input() aside = true;

  contents: Array<{ name: string; href: string; id: string }> = [];
  activeSection: { name: string; href: string; id: string };

  private onDestroy = new Subject<void>();

  private get window() {
    return this.document ? this.document.defaultView || (this.document as any).parentWindow : null;
  }

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router) {}

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
