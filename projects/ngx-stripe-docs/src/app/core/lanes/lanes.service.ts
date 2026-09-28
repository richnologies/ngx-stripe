import { Injectable, computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { NGSTR_LANES } from './lanes.data';
import { NgStrLane, NgStrStripeTrain, laneId } from './lanes.model';

const STORAGE_KEY = 'ngstr-docs-lane';

@Injectable({ providedIn: 'root' })
export class NgStrLanesService {
  readonly data = NGSTR_LANES;
  readonly latestId = this.data.latest;

  private readonly selectedId = signal(this.readInitialLane());

  readonly selected = computed(() => this.findLane(this.selectedId()) ?? this.findLane(this.latestId)!);
  readonly isLatest = computed(() => laneId(this.selected()) === this.latestId);
  readonly train = computed(() => this.trainFor(this.selected()));
  readonly installCommand = computed(() => this.buildInstallCommand(this.selected()));
  readonly stackblitzUrl = computed(() => this.buildStackblitzUrl(this.selected()));
  readonly selectedLabel = computed(() => {
    const lane = this.selected();
    const train = this.train();
    const latest = this.isLatest() ? ' (latest)' : '';
    return `Angular ${lane.angular} · ${train.label}${latest}`;
  });

  readonly selected$ = toObservable(this.selected);

  activeOptions(): { id: string; label: string; lane: NgStrLane }[] {
    return this.data.activeLanes.map((lane) => {
      const id = laneId(lane);
      const train = this.trainFor(lane);
      const latest = id === this.latestId ? ' (latest)' : '';
      return {
        id,
        label: `Angular ${lane.angular} · ${train.label}${latest}`,
        lane
      };
    });
  }

  setLane(id: string): void {
    if (!this.findLane(id)) return;
    this.selectedId.set(id);
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href);
    if (id === this.latestId) {
      url.searchParams.delete('lane');
    } else {
      url.searchParams.set('lane', id);
    }
    window.history.replaceState({}, '', url.toString());
  }

  findLane(id: string): NgStrLane | undefined {
    return this.data.lanes.find((l) => laneId(l) === id);
  }

  trainFor(lane: NgStrLane): NgStrStripeTrain {
    return this.data.stripeTrains[String(lane.stripeJs)];
  }

  private buildInstallCommand(lane: NgStrLane): string {
    const train = this.trainFor(lane);
    const pkg = lane.npmTag ? `ngx-stripe@${lane.npmTag}` : `ngx-stripe@${lane.range.replace(/\+$/, '')}`;
    return `npm install ${pkg} @stripe/stripe-js@^${train.packageMajor}`;
  }

  private buildStackblitzUrl(lane: NgStrLane): string {
    const id = laneId(lane);
    return `https://stackblitz.com/github/richnologies/ngx-stripe/tree/main/playground/lanes/${id}?file=src%2Fmain.ts`;
  }

  private readInitialLane(): string {
    if (typeof window === 'undefined') {
      return this.latestId;
    }
    try {
      const params = new URLSearchParams(window.location.search);
      const fromQuery = params.get('lane');
      if (fromQuery && this.findLane(fromQuery)) return fromQuery;
      const fromStorage = localStorage.getItem(STORAGE_KEY);
      if (fromStorage && this.findLane(fromStorage)) return fromStorage;
    } catch {
      /* ignore */
    }
    return this.latestId;
  }
}
