import {
  Directive,
  HostListener,
  Inject,
  PLATFORM_ID,
  AfterContentInit,
  Output,
  EventEmitter
} from '@angular/core';
import { MatSidenav } from '@angular/material';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appSidenavResize]'
})
export class SidenavResizeDirective implements AfterContentInit {
  @Output()
  ready = new EventEmitter<void>();

  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private sidenav: MatSidenav
  ) {}

  ngAfterContentInit() {
    this.resize();
  }

  resize() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth < 960) {
        this.sidenav.close();
        this.sidenav.mode = 'over';
      } else {
        this.sidenav.open();
        this.sidenav.mode = 'side';
      }
    }

    this.ready.emit();
  }
}
