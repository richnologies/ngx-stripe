import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 * An EventEmitter that tells its owner each time something subscribes to it: a template binding
 * such as `(fieldchange)="..."`, or code that calls `subscribe()` later.
 *
 * Used for outputs backed by a Stripe.js listener that should only be registered when an app asks
 * for the event. It does not rely on `Subject.observed`, which RxJS 6 does not have.
 */
export class SubscriberAwareEmitter<T> extends EventEmitter<T> {
  /** True once anything has subscribed. */
  hasHadSubscriber = false;

  constructor(private readonly onSubscribe: () => void) {
    super();
  }

  override subscribe(observerOrNext?: any, error?: any, complete?: any): Subscription {
    const subscription = super.subscribe(observerOrNext, error, complete);
    this.hasHadSubscriber = true;
    this.onSubscribe();
    return subscription;
  }
}
