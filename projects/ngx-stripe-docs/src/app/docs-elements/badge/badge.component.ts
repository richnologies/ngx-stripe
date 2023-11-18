import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type NgStrBadgeColor =
  | 'gray'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink';

@Component({
  selector: 'ngstr-badge',
  template: `
    <span [class]="colorClass">
      <ng-content></ng-content>
    </span>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgStrBadgeComponent {
  @Input() color: NgStrBadgeColor = 'gray';

  get colorClass() {
    const baseClasses =
      'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset';

    switch (this.color) {
      case 'red':
        return `${baseClasses} bg-red-50 text-red-700 ring-red-600/10`;
      case 'yellow':
        return `${baseClasses} bg-yellow-50 text-yellow-800 ring-yellow-600/10`;
      case 'green':
        return `${baseClasses} bg-green-50 text-green-700 ring-green-600/10`;
      case 'blue':
        return `${baseClasses} bg-blue-50 text-blue-700 ring-blue-700/10`;
      case 'indigo':
        return `${baseClasses} bg-indigo-50 text-indigo-700 ring-indigo-700/10`;
      case 'purple':
        return `${baseClasses} bg-purple-50 text-purple-700 ring-purple-700/10`;
      case 'pink':
        return `${baseClasses} bg-pink-50 text-pink-700 ring-pink-700/10`;
      case 'gray':
      default:
        return `${baseClasses} bg-gray-50 text-gray-600 ring-gray-500/10`;
    }
  }
}
