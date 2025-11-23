import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NgStrClipboardService } from '../../core';

@Component({
  selector: 'ngstr-copy-link',
  template: `
    <div
      class="cursor-pointer font-normal px-3 py-1 text-sm border-l-2 text-gray-500 hover:text-indigo-600"
      (click)="copyLink()"
    >
      <span class="material-icons text-sm mr-3">content_copy</span>
      <span>Copy Link</span>
    </div>
  `,
  standalone: true
})
export class NgStrCopyLinkComponent {
  private readonly document = inject(DOCUMENT);
  private readonly clipboard = inject(NgStrClipboardService);

  copyLink() {
    try {
      this.clipboard.copy(this.document.defaultView.location.href);
    } catch (err) {
      console.error(err);
    }
  }
}
