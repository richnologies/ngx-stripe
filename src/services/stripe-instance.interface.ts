import { Observable } from 'rxjs';

import { Element } from '../interfaces/element';
import { Elements, ElementsOptions } from '../interfaces/elements';
import { BankAccount, BankAccountData, CardDataOptions, Pii, PiiData, TokenResult } from '../interfaces/token';
import { SourceData, SourceParams, SourceResult } from '../interfaces/sources';
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
