import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { WindowRef } from './window-ref.service';
import { LazyStripeAPILoader, Status } from './api-loader.service';

import { Options, StripeJS } from '../interfaces/stripe';
import { Element } from '../interfaces/element';
import { Elements, ElementsOptions } from '../interfaces/elements';
import { isSourceData, SourceData, SourceParams, SourceResult } from '../interfaces/sources';
import {
  BankAccount,
  BankAccountData,
  CardDataOptions,
  isBankAccount,
  isBankAccountData,
  isPii,
  isPiiData,
  Pii,
  PiiData,
  TokenResult
} from '../interfaces/token';
import { StripeServiceInterface } from './stripe-instance.interface';
import { PaymentRequestOptions } from '../interfaces/payment-request';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

export class StripeInstance implements StripeServiceInterface {
  private stripe$: BehaviorSubject<StripeJS | undefined> = new BehaviorSubject<StripeJS | undefined>(undefined);

  constructor(
    private loader: LazyStripeAPILoader,
    private window: WindowRef,
    private key: string,
    private options?: Options
  ) {
    this.loader
      .asStream()
      .pipe(
        filter((status: Status) => status.loaded === true),
        first(),
        map(() => (this.window.getNativeWindow() as any).Stripe)
      )
      .subscribe((Stripe: any) => {
        const stripe = this.options
          ? (Stripe(this.key, this.options) as StripeJS)
          : (Stripe(this.key) as StripeJS);

        this.stripe$.next(stripe);
      });
  }

  public getInstance(): StripeJS | null | undefined {
    return this.stripe$.getValue() as StripeJS;
  }

  public elements(options?: ElementsOptions): Observable<Elements> {
    return this.stripe$
      .asObservable()
      .pipe(
        filter(stripe => Boolean(stripe)),
        map(stripe => (stripe as StripeJS).elements(options)),
        first()
      );
  }

  public createToken(
    a: Element | BankAccount | Pii,
    b: CardDataOptions | BankAccountData | PiiData | undefined
  ): Observable<TokenResult> {
    return this.stripe$
      .asObservable()
      .pipe(filter(stripe => Boolean(stripe)),
        switchMap(s => {
          const stripe = s as StripeJS;

          if (isBankAccount(a) && isBankAccountData(b)) {
            return fromPromise(stripe.createToken(a, b));
          } else if (isPii(a) && isPiiData(b)) {
            return fromPromise(stripe.createToken(a, b));
          } else {
            return fromPromise(
              stripe.createToken(a as Element, b as CardDataOptions | undefined)
            );
          }
        }),
        first()
      );
  }

  public createSource(
    a: Element | SourceData,
    b?: SourceData | undefined
  ): Observable<SourceResult> {
    return this.stripe$
      .asObservable()
      .pipe(
        filter(stripe => Boolean(stripe)),
        switchMap(s => {
          const stripe = s as StripeJS;

          if (isSourceData(a)) {
            return fromPromise(stripe.createSource(a as SourceData));
          }
          return fromPromise(stripe.createSource(a as Element, b));
        }),
        first()
      );
  }

  public retrieveSource(source: SourceParams): Observable<SourceResult> {
    return this.stripe$
      .asObservable()
      .pipe(
        filter(stripe => Boolean(stripe)),
        switchMap(s => {
          const stripe = s as StripeJS;

          return fromPromise(stripe.retrieveSource(source));
        }),
        first()
      );
  }

  public paymentRequest(options: PaymentRequestOptions) {
    const stripe = this.getInstance();
    if (stripe) {
      return stripe.paymentRequest(options);
    }
    return undefined;
  }
}
