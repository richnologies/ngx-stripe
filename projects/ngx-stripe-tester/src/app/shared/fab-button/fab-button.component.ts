import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fab-button',
  template: `
    <a class="action-button" mat-fab color="accent" [routerLink]="routerLink">
      <ng-content></ng-content>
    </a>
  `,
  styles: [
    `
      .action-button {
        position: absolute;
        top: 30px;
        right: 20px;
      }
    `
  ]
})
export class FabButtonComponent {
  @Input()
  routerLink;
}
