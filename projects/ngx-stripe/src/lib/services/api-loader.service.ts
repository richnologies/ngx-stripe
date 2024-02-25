import { ApplicationRef, Inject, Injectable, isDevMode, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { Observable, BehaviorSubject, concatMap, timeout, catchError, EMPTY, shareReplay } from 'rxjs';

import { WindowRef } from './window-ref.service';
import { DocumentRef } from './document-ref.service';
import { filter, first } from 'rxjs/operators';

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

  private readonly isStable$ = this.applicationRef.isStable.pipe(
    filter((stable) => stable),
    timeout(10_000),
    catchError(() => {
      if (isDevMode()) {
        console.warn(`Application failed to become stable within 10000ms. Loading the Stripe script now.`)
      }

      return EMPTY;
    }),
    first(),
    shareReplay(1)
  )

  constructor(
    @Inject(PLATFORM_ID) public platformId: any,
    public window: WindowRef,
    public document: DocumentRef,
    public applicationRef: ApplicationRef
  ) {}

  public asStream(): Observable<LazyStripeAPILoaderStatus> {
    this.isStable$.subscribe(() => this.load())

    return this.status.asObservable();
  }

  public isReady(): boolean {
    return this.status.getValue().loaded;
  }

  public load() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    const status: LazyStripeAPILoaderStatus = this.status.getValue();
    if (this.window.getNativeWindow().hasOwnProperty('Stripe')) {
      this.status.next({
        error: false,
        loaded: true,
        loading: false
      });
    } else if (!status.loaded && !status.loading) {
      this.status.next({
        ...status,
        loading: true
      });

      const script = this.document.getNativeDocument().createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;
      script.src = 'https://js.stripe.com/v3/';

      script.onload = () => {
        this.status.next({
          error: false,
          loaded: true,
          loading: false
        });
      };

      script.onerror = () => {
        this.status.next({
          error: true,
          loaded: false,
          loading: false
        });
      };

      this.document.getNativeDocument().body.appendChild(script);
    }
  }
}
