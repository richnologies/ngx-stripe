import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type NgStrLayoutSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'ngstr-container',
  template: `
    <div class="m-auto my-2 px-8" [ngStyle]="{ 'max-width': maxWidth }">
      <ng-content></ng-content>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
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
        return '960px';
      case 'xl':
        return '1920px';
      case 'full':
        return '100%';
      default:
      case 'lg':
        return '1280px';
    }
  }
}
