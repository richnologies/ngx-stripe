import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';

import { NgStrLanesService } from '../../core/lanes/lanes.service';
import { NgStrLane, laneId } from '../../core/lanes/lanes.model';

@Component({
  selector: 'ngstr-version-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative" data-testid="version-picker">
      <svg width="0" height="0" class="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="ngstr-angular-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F20749" />
            <stop offset="50%" stop-color="#E33E2F" />
            <stop offset="100%" stop-color="#C3002F" />
          </linearGradient>
        </defs>
      </svg>
      <button
        type="button"
        class="inline-flex max-w-full items-center gap-1.5 rounded-xl border border-ngst-line bg-white py-1.5 pl-2 pr-2 text-ngst-ink shadow-sm transition hover:border-ngst-accent/40 hover:bg-ngst-soft focus:outline-none focus:ring-2 focus:ring-ngst-accent/30 sm:pl-2.5 sm:pr-2.5"
        [attr.aria-expanded]="open"
        aria-haspopup="listbox"
        aria-label="Select Angular and Stripe.js docs lane"
        (click)="toggle()"
      >
        <span class="inline-flex min-w-0 items-center gap-1">
          <span class="inline-flex items-center gap-1">
            <ng-container *ngTemplateOutlet="angularLogo"></ng-container>
            <span class="text-xs font-semibold tabular-nums sm:text-sm">{{ lanes.selected().angular }}</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <ng-container *ngTemplateOutlet="stripeLogo"></ng-container>
            <span class="text-xs font-semibold tabular-nums sm:text-sm">{{ lanes.train().packageMajor }}</span>
          </span>
          @if (lanes.isLatest()) {
          <span
            class="hidden rounded-md bg-ngst-accent-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ngst-accent-dark sm:inline"
            >latest</span
          >
          }
        </span>
        <svg class="h-3.5 w-3.5 shrink-0 text-ngst-muted" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      @if (open) {
      <ul
        role="listbox"
        class="absolute right-0 z-50 mt-1.5 max-h-80 min-w-[13.5rem] overflow-auto rounded-xl border border-ngst-line bg-white py-1 shadow-lift"
      >
        @for (opt of lanes.activeOptions(); track opt.id) {
        <li role="option" [attr.aria-selected]="opt.id === laneId(lanes.selected())">
          <button
            type="button"
            class="flex w-full items-center gap-1 px-3 py-2 text-left text-sm transition"
            [ngClass]="{
              'bg-ngst-accent-soft text-ngst-accent-dark': opt.id === laneId(lanes.selected()),
              'text-ngst-ink hover:bg-ngst-soft': opt.id !== laneId(lanes.selected())
            }"
            (click)="choose(opt.id)"
          >
            <span class="inline-flex items-center gap-1">
              <ng-container *ngTemplateOutlet="angularLogo"></ng-container>
              <span class="font-semibold tabular-nums">{{ opt.lane.angular }}</span>
            </span>
            <span class="inline-flex items-center gap-1">
              <ng-container *ngTemplateOutlet="stripeLogo"></ng-container>
              <span class="font-semibold tabular-nums">{{ trainMajor(opt.lane) }}</span>
            </span>
            <span class="ml-auto truncate text-xs text-ngst-muted">{{ trainName(opt.lane) }}</span>
          </button>
        </li>
        }
      </ul>
      }
    </div>

    <ng-template #angularLogo>
      <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="url(#ngstr-angular-logo-grad)"
          d="M16.712 17.711H7.288l-1.204 2.916L12 24l5.916-3.373-1.204-2.916ZM14.692 0l7.832 16.855.814-12.856L14.692 0ZM9.308 0 .662 3.999l.814 12.856L9.308 0Zm-.405 13.93h6.198L12 6.396 8.903 13.93Z"
        />
      </svg>
    </ng-template>

    <ng-template #stripeLogo>
      <svg class="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#635BFF"
          d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.434 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.876 4.515 3.206 3.718 4.902 3.718 7.045c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"
        />
      </svg>
    </ng-template>
  `
})
export class NgStrVersionPickerComponent {
  readonly lanes = inject(NgStrLanesService);
  readonly laneId = laneId;
  open = false;

  private readonly host = inject(ElementRef<HTMLElement>);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.open) return;
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.open = false;
  }

  toggle() {
    this.open = !this.open;
  }

  choose(id: string) {
    this.lanes.setLane(id);
    this.open = false;
  }

  trainMajor(lane: NgStrLane): number {
    return this.lanes.trainFor(lane).packageMajor;
  }

  trainName(lane: NgStrLane): string {
    const train = this.lanes.trainFor(lane);
    const name = train.cdn === 'v3' ? train.label : train.cdn;
    return laneId(lane) === this.lanes.latestId ? `${name} · latest` : name;
  }
}
