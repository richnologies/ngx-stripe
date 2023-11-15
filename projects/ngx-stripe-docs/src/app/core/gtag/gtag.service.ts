import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';

import { ENV } from '../../interfaces';

@Injectable({ providedIn: 'root' })
export class NgStrGoogleTagManagerService {
  private readonly document = inject(DOCUMENT);
  private readonly env = inject(ENV);
  private readonly titleService = inject(Title);

  private loaded = new BehaviorSubject<boolean>(false);
  private loading = false;
  private enable = true;
  private trackingCode = this.env.measuramentid;

  private get window() {
    return this.document ? this.document.defaultView || (this.document as any).parentWindow : null;
  }

  async setup() {
    if (this.window && this.trackingCode) this.window[`ga-disable-${this.trackingCode}`] = false;
    this.enable = true;

    if (!this.loading && this.loaded.getValue() === false) {
      await lastValueFrom(
        this.loaded.pipe(
          tap((loaded) => {
            if (!loaded && !this.loading) {
              this.load(this.trackingCode);
            }
          }),
          filter((loaded) => loaded === true),
          tap(() => {
            this.gtag('js', new Date());
          }),
          first()
        )
      );
    }
  }

  pageView(path: string) {
    if (this.trackingCode && this.enable && this.window) {
      this.gtag('config', this.trackingCode, {
        page_title: this.titleService.getTitle(),
        page_location: `${this.window.location.origin}${path}`,
        page_path: path
      });
    }
  }

  gtag(...args) {
    const a = arguments;
    lastValueFrom(
      this.loaded.pipe(
        filter((loaded) => loaded === true),
        tap(() => {
          if (this.window && this.window.dataLayer) {
            this.window.dataLayer.push(a);
          }
        }),
        first()
      )
    );
  }

  private load(trackingCode: string) {
    if (!this.loaded.getValue() && !this.loading && this.document) {
      this.loading = true;
      const script = this.document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingCode}`;
      script.setAttribute('async', '');

      const head = this.document.getElementsByTagName('head')[0];
      if (head) {
        head.appendChild(script);
        if (this.window) {
          this.window.dataLayer = this.window.dataLayer || [];
        }

        this.loaded.next(true);
      }
    }
  }
}
