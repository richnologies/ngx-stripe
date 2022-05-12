import { AfterViewInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { NgStrSubheaderComponent } from '../subheader/subheader.component';

@Component({
  selector: 'ngstr-section',
  template: `
    <div class="flex-1 relative z-0 flex h-screen overflow-hidden">
      <main class="flex-1 m-auto py-10 max-w-screen-md h-full w-11/12 my-0 mx-1 overflow-y-auto">
        <div class="mt-6 prose prose-indigo text-gray-500 mx-auto">
          <ng-content select="[ngStrSectionMain]"></ng-content>
          <div class="!mt-8"></div>
          <ngstr-section-navigator></ngstr-section-navigator>
        </div>
      </main>
      <aside class="hidden xl:block xl:pl-8 w-1/3 overflow-y-auto" *ngIf="aside">
        <div class="space-y-5 mr-8 mt-16">
          <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <ngstr-copy-link></ngstr-copy-link>
            <ng-container *ngIf="contents.length > 0">
              <div class="mb-4"></div>
              <div class="border-l-2">
                <h3
                  class="block mt-6 !mb-1.5 px-4 font-semibold text-gray-400 uppercase tracking-wider"
                >
                  <span class="material-icons text-xs mr-3">subject</span>
                  <span class="text-xs">Contents</span>
                </h3>
                <a class="block cursor-pointer font-normal px-5 py-1 text-sm text-gray-500 hover:text-indigo-600"
                  [href]="content.href"
                  *ngFor="let content of contents"
                >
                  <span>{{ content.name }}</span>
                </a>
              </div>
            </ng-container>
            <div class="mb-12"></div>
            <ng-content select="[ngStrSectionAside]"></ng-content>
          </div>
        </div>
      </aside>
    </div>
  `
})
export class NgStrSectionComponent implements AfterViewInit {
  @ContentChildren(NgStrSubheaderComponent) subheaders = new QueryList<NgStrSubheaderComponent>();

  @Input() aside = true;

  contents: Array<{ name: string, href: string }> = [];

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.contents = this.subheaders
      .filter(row => row.link
          && typeof row.link === 'string'
          && row.link.trim().length > 0
          && row.subheader
          && typeof row.subheader === 'string'
          && row.subheader.trim().length > 0
      )
      .map(subheader => ({ name: subheader.subheader, href: `${this.router.url.split('#')[0]}#${subheader.link}` }));
  }
}
