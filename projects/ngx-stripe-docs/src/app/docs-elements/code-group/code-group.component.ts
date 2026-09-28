import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  QueryList,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { NgStrCodeComponent } from '../code/code.component';

@Component({
  selector: 'ngstr-code-group',
  template: `
    @if (buttons.length > 0) {
    <div
      class="flex max-w-full gap-1 overflow-x-auto rounded-t-2xl border border-b-0 border-[#2c3344] bg-[#252b3a] px-2 pt-1.5"
      role="tablist"
    >
      @for (button of buttons; track button; let i = $index) {
      <button
        type="button"
        role="tab"
        [attr.aria-selected]="i === selected"
        class="relative whitespace-nowrap rounded-t-lg px-3.5 py-2 text-xs font-semibold transition"
        [ngClass]="{
          'bg-[#1e2330] text-white': i === selected,
          'text-[#8b95a8] hover:bg-[#2a3142] hover:text-[#d5dae3]': i !== selected
        }"
        (click)="onBlockSelected(i)"
      >
        {{ button }}
        @if (i === selected) {
        <span
          class="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-ngst-accent"
          aria-hidden="true"
        ></span>
        }
      </button>
      }
    </div>
    }
    <ng-content></ng-content>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class NgStrCodeGroupComponent implements AfterContentInit {
  @ContentChildren(NgStrCodeComponent) blocks!: QueryList<NgStrCodeComponent>;

  buttons: string[] = [];
  selected = 0;

  private readonly cdr = inject(ChangeDetectorRef);

  ngAfterContentInit() {
    this.syncButtons();
    this.blocks.changes.subscribe(() => this.syncButtons());
  }

  onBlockSelected(i: number) {
    this.selected = i;
    this.blocks.forEach((block, index) => {
      block.hidden = index !== i;
    });
  }

  private syncButtons() {
    this.buttons = this.blocks.map((block, i) => block.name || `Snippet ${i + 1}`);
    this.onBlockSelected(Math.min(this.selected, Math.max(this.buttons.length - 1, 0)));
    this.cdr.detectChanges();
  }
}
