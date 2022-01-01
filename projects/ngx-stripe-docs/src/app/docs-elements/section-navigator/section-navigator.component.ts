import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgstContentService, NgstMenuItem } from '../../core';

@Component({
  selector: 'ngstr-section-navigator',
  template: `
    <div class="flex flex-row gap-4 mt-2" *ngIf="next || previous">
      <a class="inline-block w-full cursor-pointer no-underline" [routerLink]="['/docs', previous.path]" *ngIf="previous">
        <div class="flex flex-row grow rounded justify-between px-4 py-2 border border-gray-300 hover:border-indigo-500 bg-white">
          <div class="pt-4"><span class="material-icons text-gray-700">arrow_back</span></div>
          <div>
            <span class="text-xs text-gray-400">{{ previous.group | ngStrGroupName:'previous' }}</span>
            <br/>
            <span class="text-gray-700">{{ previous.name }}</span>
          </div>
        </div>
      </a>
      <a class="inline-block w-full cursor-pointer no-underline" [routerLink]="['/docs', next.path]" *ngIf="next">
        <div class="flex flex-row grow rounded justify-between px-4 py-2 border border-gray-300 hover:border-indigo-500 bg-white">
          <div>
            <span class="text-xs text-gray-400">{{ next.group | ngStrGroupName:'next' }}</span>
            <br/>
            <span class="text-gray-700">{{ next.name }}</span>
          </div>
          <div class="pt-4"><span class="material-icons text-gray-700">arrow_forward</span></div>
        </div>
      </a>
    </div>
  `
})
export class NgStrSectionNavigatorComponent implements OnInit {
  next: NgstMenuItem;
  previous: NgstMenuItem;

  constructor(
    private router: Router,
    private contentService: NgstContentService
  ) {}

  ngOnInit() {
    if (this.router.url && this.router.url) {
      const fragments = this.router.url.split('/');
      const docsPath = fragments.slice(fragments.indexOf('docs') + 1).join('/');
      const { next, previous } = this.contentService.getNavigationElements(docsPath);

      this.next = next;
      this.previous = previous;
    }
  }
}
