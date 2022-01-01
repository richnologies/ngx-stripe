import { Component } from '@angular/core';

@Component({
  selector: 'ngstr-section',
  template: `
    <div class="flex-1 relative z-0 flex overflow-hidden">
      <main class="flex-1 m-auto py-10 max-w-screen-md h-full" style="margin: 0px 5%; width: 90%">
        <div class="mt-6 prose prose-indigo text-gray-500 mx-auto">
          <ng-content select="[ngStrSectionMain]"></ng-content>
          <ngstr-section-navigator></ngstr-section-navigator>
        </div>
      </main>
      <aside class="hidden xl:block xl:pl-8" style="width: 33%">
        <div class="space-y-5 mr-8 mt-16">
          <ng-content select="[ngStrSectionAside]"></ng-content>
        </div>
      </aside>
    </div>
  `
})
export class NgStrSectionComponent {}
