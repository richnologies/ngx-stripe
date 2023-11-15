import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NgStrClipboardService {
  private readonly document: Document = inject(DOCUMENT);

  copy(content) {
    try {
      this.document.defaultView.navigator.clipboard.writeText(content);
    } catch (err) {}
  }
}
