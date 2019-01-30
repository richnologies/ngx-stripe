import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class WindowRef {
  constructor(@Inject(PLATFORM_ID) public platformId: any) {}

  public getNativeWindow(): Window {
    if (isPlatformBrowser(this.platformId)) {
      return window;
    }
    return {} as Window;
  }
}
