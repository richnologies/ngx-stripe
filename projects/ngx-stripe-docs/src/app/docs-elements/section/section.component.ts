import { AfterViewInit, Component, ContentChildren, ElementRef, Input, OnDestroy, QueryList, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { NgStrSubheaderComponent } from '../subheader/subheader.component';

@Component({
  selector: 'ngstr-section',
  template: `
    <div class="flex-1 justify-center relative z-0 flex h-screen overflow-hidden">
      <main #mainContentContainer class="flex-1 m-auto py-10 max-w-screen-md h-full w-11/12 my-0 mx-1 overflow-y-auto max-w-2xl">
        <div class="mt-6 prose prose-indigo text-gray-500 mx-auto">
          <ng-content select="[ngStrSectionMain]"></ng-content>
          <div class="!mt-8"></div>
          <ngstr-section-navigator></ngstr-section-navigator>
        </div>
      </main>
      <aside class="hidden xl:block xl:pl-8 w-1/3 overflow-y-auto max-w-sm" *ngIf="aside">
        <div class="space-y-5 mr-8 mt-16">
          <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <ngstr-copy-link></ngstr-copy-link>
            <ng-container *ngIf="contents.length > 0">
              <div class="mb-4"></div>
              <ngstr-contents [contents]="contents" [active]="activeSection ? activeSection.id : null"></ngstr-contents>
            </ng-container>
            <div class="mb-12"></div>
            <ng-content select="[ngStrSectionAside]"></ng-content>
          </div>
        </div>
      </aside>
    </div>
  `
})
export class NgStrSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mainContentContainer') main: ElementRef;
  @ContentChildren(NgStrSubheaderComponent) subheaders = new QueryList<NgStrSubheaderComponent>();

  @Input() aside = true;

  contents: Array<{ name: string, href: string; id: string }> = [];
  activeSection: { name: string, href: string; id: string };

  private onDestroy = new Subject<void>();

  constructor(private router: Router) {}

  ngAfterViewInit() {
    merge(
      fromEvent(this.main.nativeElement, 'scroll').pipe(debounceTime(250)),
      fromEvent(window, 'resize')
    )
    .pipe(takeUntil(this.onDestroy))
    .subscribe(() => {
      const mainClientReact = this.main.nativeElement.getBoundingClientRect();
      const trigger = mainClientReact && mainClientReact.height ? Math.floor(mainClientReact.height / 6) : 150;

      this.activeSection = this.contents.filter(content => {
        const el = document.getElementById(content.id);
        if (!el) return false;

        const { y } = el.getBoundingClientRect();

        return y < trigger;
      }).reverse()[0];
    });

    this.contents = this.subheaders
      .filter(row => row.link
          && typeof row.link === 'string'
          && row.link.trim().length > 0
          && row.subheader
          && typeof row.subheader === 'string'
          && row.subheader.trim().length > 0
      )
      .map(subheader => ({
        id: subheader.link,
        name: subheader.subheader,
        href: `${this.router.url.split('#')[0]}#${subheader.link}`
      }));
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
