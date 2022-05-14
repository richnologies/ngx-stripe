import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngstr-panel',
  template: `
    <div [class]="'text-gray-900 panel panel-' + type">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .panel {
        padding: 1.5rem 2rem;
        border-radius: 0.375rem;
      }
      .panel-success {
        background-color: #e9fee1;
        border-left: 0.375rem solid #07ff26;
      }
      .panel-info {
        background-color: #e1e9fe;
        border-left: 0.375rem solid #0795ff;
      }
      .panel-warning {
        background-color: #fef8e1;
        border-left: 0.375rem solid #ffc407;
      }
      .panel-danger {
        background-color: #fee1e1;
        border-left: 0.375rem solid #ff0707;
      }
    `
  ]
})
export class NgStrPanelComponent {
  @Input() type: 'success' | 'info' | 'warning' | 'danger' = 'info';
}
