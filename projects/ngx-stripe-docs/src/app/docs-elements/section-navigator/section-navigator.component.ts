import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { NgStrContentService, NgStrMenuItem } from '../../core';

import { NgStrGroupNamePipe } from '../section/group-name.pipe';

@Component({
  selector: 'ngstr-section-navigator',
  template: `
    @if (next || previous) {
    <div class="flex flex-col md:flex-row gap-4 mt-2 px-2 sm:px-0">
      @if (previous) {
      <a class="inline-block w-full cursor-pointer no-underline" [routerLink]="['/docs', previous.path]">
        <div
          class="flex flex-row grow rounded justify-between px-4 py-2 border border-gray-300 hover:border-indigo-500 bg-white"
        >
          <div class="pt-4">
            <span class="material-icons text-gray-700">arrow_back</span>
          </div>
          <div>
            <span class="text-xs text-gray-400">{{ previous.group | ngStrGroupName: 'previous' }}</span>
            <br />
            <span class="text-gray-700 float-right">{{ previous.name }}</span>
          </div>
        </div>
      </a>
      } @if (next) {
      <a class="inline-block w-full cursor-pointer no-underline" [routerLink]="['/docs', next.path]">
        <div
          class="flex flex-row grow rounded justify-between px-4 py-2 border border-gray-300 hover:border-indigo-500 bg-white"
        >
          <div>
            <span class="text-xs text-gray-400">{{ next.group | ngStrGroupName: 'next' }}</span>
            <br />
            <span class="text-gray-700">{{ next.name }}</span>
          </div>
          <div class="pt-4">
            <span class="material-icons text-gray-700">arrow_forward</span>
          </div>
        </div>
      </a>
      }
    </div>
    }
  `,
  imports: [RouterModule, NgStrGroupNamePipe],
  standalone: true
})
export class NgStrSectionNavigatorComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly contentService = inject(NgStrContentService);

  next: NgStrMenuItem;
  previous: NgStrMenuItem;

  ngOnInit() {
    if (this.router.url) {
      const fragments = this.router.url.split('/');
      const docsPath = fragments.slice(fragments.indexOf('docs') + 1).join('/');
      const { next, previous } = this.contentService.getNavigationElements(docsPath);

      this.next = next;
      this.previous = previous;
    }
  }
}
