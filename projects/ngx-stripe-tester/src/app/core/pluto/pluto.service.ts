import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaymentIntent } from '@stripe/stripe-js';
import Stripe from 'stripe';

import { PLUTO_ID } from './client-id.provider';

@Injectable({ providedIn: 'root' })
export class PlutoService {
  private static readonly BASE_URL = 'https://api.pluto.ricardosanchez.dev/api';

  constructor(
    @Inject(PLUTO_ID) private readonly clientId: string,
    private readonly http: HttpClient
  ) {}

  createPaymentIntent(params: Stripe.PaymentIntentCreateParams): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `${PlutoService.BASE_URL}/payments/create-payment-intent`,
      params,
      { headers: { merchant: this.clientId } }
    );
  }

  createVerificationSession(userid: string): Observable<any> {
    return this.http.post<PaymentIntent>(
      `${PlutoService.BASE_URL}/identity/create-verification-session`,
      { userid },
      { headers: { merchant: this.clientId } }
    );
  }
}
