import { Component } from '@angular/core';

@Component({
  selector: 'app-default',
  template: `
    <div>404</div>
    <button [routerLink]="['test-01']">GO</button>
  `,
  styles: []
})
export class DefaultComponent {}
