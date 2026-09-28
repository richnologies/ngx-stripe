import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type NgStrLayoutSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'ngstr-container',
  template: `
    <div class="mx-auto my-2 w-full min-w-0 px-4 sm:px-6 lg:px-8" [ngStyle]="{ 'max-width': maxWidth }">
      <ng-content></ng-content>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class NgStrContainerComponent {
  @Input() size: NgStrLayoutSize = 'lg';

  get maxWidth(): string {
    switch (this.size) {
      case 'xs':
        return '400px';
      case 'sm':
        return '600px';
      case 'md':
        return '984px';
      case 'xl':
        return '1920px';
      case 'full':
        return '100%';
      default:
      case 'lg':
        return '1440px';
    }
  }
}
