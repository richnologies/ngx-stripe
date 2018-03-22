import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { WindowRef } from './window-ref';
import { LazyStripeAPILoader, Status } from './api-loader.service';

import {
  STRIPE_PUBLISHABLE_KEY,
  StripeJS,
  STRIPE_OPTIONS
} from '../interfaces/stripe';
import { Element } from '../interfaces/element';
import { Elements, ElementsOptions } from '../interfaces/elements';
import {
  SourceData,
  SourceResult,
  isSourceData,
  SourceParams
} from '../interfaces/sources';
import {
  CardDataOptions,
  TokenResult,
  BankAccount,
  BankAccountData,
  PiiData,
  Pii,
  isBankAccount,
  isBankAccountData,
  isPii,
  isPiiData
} from '../interfaces/token';
import { StripeInstance } from './stripe-instance.class';
import { StripeServiceInterface } from './stripe-instance.interface';

@Injectable()
export class StripeService implements StripeServiceInterface {
  private stripe: StripeInstance;

  constructor(
    @Inject(STRIPE_PUBLISHABLE_KEY) private key: string,
    @Inject(STRIPE_OPTIONS) private options: string,
    private loader: LazyStripeAPILoader,
    private window: WindowRef
  ) {
    this.stripe = new StripeInstance(this.loader, this.window, key, options);
  }

  public elements(options?: ElementsOptions): Observable<Elements> {
    return this.stripe.elements(options);
  }

  public createToken(
    a: Element | BankAccount | Pii,
    b: CardDataOptions | BankAccountData | PiiData | undefined
  ): Observable<TokenResult> {
    return this.stripe.createToken(a, b);
  }

  public createSource(
    a: Element | SourceData,
    b?: SourceData | undefined
  ): Observable<SourceResult> {
    return this.stripe.createSource(a, b);
  }

  public retrieveSource(source: SourceParams): Observable<SourceResult> {
    return this.stripe.retrieveSource(source);
  }
}
