import { Component, Input } from '@angular/core';

export type NgStrLinkColor =
  | 'gray'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink';

@Component({
  selector: 'ngstr-link',
  template: `
    <a
      [class]="colorClass"
      [href]="url"
      [target]="target"
      [rel]="rel"
    >
      <ng-content></ng-content>
    </a>
  `,
  standalone: true
})
export class NgStrLinkComponent {
  @Input() url: string;
  @Input() target = '_blank';
  @Input() rel = 'noopener noreferrer';
  @Input() color = 'indigo';

  get colorClass() {
    const baseClasses =
      'font-normal px-1 rounded cursor-pointer no-underline';

    switch (this.color) {
      case 'red':
        return `${baseClasses} bg-red-50 hover:text-red-500 text-red-700 ring-red-600/10`;
      case 'yellow':
        return `${baseClasses} bg-yellow-50 hover:text-yellow-600 text-yellow-800 ring-yellow-600/10`;
      case 'green':
        return `${baseClasses} bg-green-50 hover:text-green-500 text-green-700 ring-green-600/10`;
      case 'blue':
        return `${baseClasses} bg-blue-50 hover:text-blue-500 text-blue-700 ring-blue-700/10`;
      case 'indigo':
        return `${baseClasses} bg-indigo-50 hover:text-indigo-500 text-indigo-700 ring-indigo-700/10`;
      case 'purple':
        return `${baseClasses} bg-purple-50 hover:text-purple-500 text-purple-700 ring-purple-700/10`;
      case 'pink':
        return `${baseClasses} bg-pink-50 hover:text-pink-500 text-pink-700 ring-pink-700/10`;
      case 'gray':
      default:
        return `${baseClasses} bg-gray-50 hover:text-gray-400 text-gray-600 ring-gray-500/10`;
    }
  }
}
