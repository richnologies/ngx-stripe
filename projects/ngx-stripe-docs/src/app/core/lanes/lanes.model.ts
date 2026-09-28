export interface NgStrStripeTrain {
  cdn: string;
  label: string;
  packageMajor: number;
}

export interface NgStrLane {
  angular: number;
  stripeJs: number;
  range: string;
  branch?: string;
  support: 'active' | 'maintenance' | 'best-effort' | 'lts' | 'legacy';
  npmTag: string | null;
}

export interface NgStrLegacyLane {
  angular: number;
  range: string;
  support: string;
  npmTag: string | null;
}

export interface NgStrLanesData {
  latest: string;
  stripeTrains: Record<string, NgStrStripeTrain>;
  lanes: NgStrLane[];
  activeLanes: NgStrLane[];
  legacy: NgStrLegacyLane[];
  ci: { pr: string[]; nightly: string[] };
}

export function laneId(lane: Pick<NgStrLane, 'angular' | 'stripeJs'>): string {
  return `${lane.angular}.${lane.stripeJs}`;
}
