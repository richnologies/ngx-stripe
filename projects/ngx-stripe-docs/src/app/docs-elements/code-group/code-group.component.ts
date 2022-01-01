import { AfterViewInit, Component, ContentChildren, QueryList } from '@angular/core';

import { NgStrCodeComponent } from '../code/code.component';

@Component({
  selector: 'ngstr-code-group',
  template: `
    <span class="relative z-0 inline-flex shadow-sm rounded-md" *ngIf="buttons && buttons.length > 0">
      <button type="button"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        [ngClass]="{ 'rounded-l-md': i === 0, 'rounded-r-md': i === (buttons.length - 1), 'border-indigo-500': i === selected, 'ring-1': i === selected }"
        (click)="onBlockSelected(i)"
        *ngFor="let button of buttons; let i = index"
      >{{ button }}
      </button>
    </span>
    <ng-content></ng-content>
  `
})
export class NgStrCodeGroup implements AfterViewInit {
  @ContentChildren(NgStrCodeComponent) blocks = new QueryList<NgStrCodeComponent>();
  buttons = [];
  selected = 0;

  ngAfterViewInit() {
    this.buttons = this.blocks.map(block => block.name);
    this.onBlockSelected(0);
  }

  onBlockSelected(i) {
    this.selected = i;
    this.blocks.forEach((block, index) => {
      block.hidden = index !== i;
    });
  }
}
