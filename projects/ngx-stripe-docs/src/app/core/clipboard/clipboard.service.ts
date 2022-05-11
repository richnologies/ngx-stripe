import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NgStrClipboardService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  copy(content) {
    try {
      this.document.defaultView.navigator.clipboard.writeText(content);
    } catch (err) {}
  }
}
