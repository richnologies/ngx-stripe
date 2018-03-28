import { Observable } from 'rxjs/Observable';

import { Element } from '../interfaces/element';
import { ElementsOptions, Elements } from '../interfaces/elements';
import {
  BankAccount,
  Pii,
  CardDataOptions,
  BankAccountData,
  PiiData,
  TokenResult
} from '../interfaces/token';
import { SourceData, SourceResult, SourceParams } from '../interfaces/sources';
import { PaymentRequestOptions } from '../interfaces/payment-request';

export interface StripeServiceInterface {
  elements(options?: ElementsOptions): Observable<Elements>;
  createToken(
    a: Element | BankAccount | Pii,
    b: CardDataOptions | BankAccountData | PiiData | undefined
  ): Observable<TokenResult>;
  createSource(
    a: Element | SourceData,
    b?: SourceData | undefined
  ): Observable<SourceResult>;
  retrieveSource(source: SourceParams): Observable<SourceResult>;
  paymentRequest(options: PaymentRequestOptions): any;
}
