import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngstr-flip-container',
  template: `
    <div class="flip-container" [class.show-back]="showBack">
      <div class="flip-container-front">
        <ng-content select=".ngstr-flip-front"></ng-content>
      </div>
      <div class="flip-container-back">
        <ng-content select=".ngstr-flip-back"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .flip-container.show-back {
        transition: transform 0.6s;
        transform-style: preserve-3d;
        transform: rotateY(180deg);
      }
      .flip-container:not(.show-back) {
        transition: transform 0.6s;
        transform-style: preserve-3d;
        transform: rotateY(0deg);
      }
      .flip-container-back {
        display: none;
        transform: rotateY(180deg);
      }
      .flip-container.show-back .flip-container-front {
        display: none;
      }
      .flip-container.show-back .flip-container-back {
        display: block;
      }
    `
  ],
  standalone: true
})
export class NgStrFlipContainerComponent {
  @Input() showBack = false;
}
