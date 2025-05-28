import { Inject, Injectable, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { Observable, BehaviorSubject } from 'rxjs';

import { WindowRef } from './window-ref.service';
import { DocumentRef } from './document-ref.service';

export interface LazyStripeAPILoaderStatus {
  loaded: boolean;
  loading: boolean;
  error: boolean;
}

@Injectable()
export class LazyStripeAPILoader {
  public status = new BehaviorSubject<LazyStripeAPILoaderStatus>({
    error: false,
    loaded: false,
    loading: false
  });

  constructor(
    @Inject(PLATFORM_ID) public platformId: any,
    public window: WindowRef, 
    public document: DocumentRef,
    private zone: NgZone
  ) {}

  public asStream(): Observable<LazyStripeAPILoaderStatus> {
    this.load();
    return this.status.asObservable();
  }

  public isReady(): boolean {
    return this.status.getValue().loaded;
  }

  public load() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const win = this.window.getNativeWindow() as any;
    const { loaded, loading, error } = this.status.getValue();

    if (win.hasOwnProperty('Stripe')) {
      this.status.next({ loaded: true, loading: false, error: false });
      return;
    }
    
    if (!loaded && !loading) {
      this.status.next({ loaded: false, loading: true, error });

      this.zone.runOutsideAngular(() => this.injectScript());
    }
  }

  private injectScript() {
    const script = this.document.getNativeDocument().createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = 'https://js.stripe.com/basil/stripe.js';

    script.onload = () => {
      this.zone.run(() => {
        this.status.next({ loaded: true, loading: false, error: false });
      });
    };

    script.onerror = () => {
      this.zone.run(() => {
        this.status.next({ loaded: false, loading: false, error: true });
      });
    };

    this.document.getNativeDocument().body.appendChild(script);
  }
}
