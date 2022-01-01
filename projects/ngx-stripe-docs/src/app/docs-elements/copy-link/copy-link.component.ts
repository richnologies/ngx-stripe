import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngstr-copy-link',
  template: `
    <div class="cursor-pointer font-medium px-3 py-2 text-sm border-l-4" (click)="copyLink()">
      <span class="material-icons mr-3">content_copy</span>
      Copy Link
    </div>
  `
})
export class NgStrCopyLinkComponent {
  constructor(private router: Router) {}

  copyLink() {
    this.router
  }
}
