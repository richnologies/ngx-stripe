import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideNgxStripe } from '../ngx-stripe.module';
import { NGX_STRIPE_VERSION, STRIPE_PUBLISHABLE_KEY } from '../interfaces/ngx-stripe.interface';
import { LazyStripeAPILoader } from './api-loader.service';
import { StripeService } from './stripe.service';
import { StripeFactoryService } from './stripe-factory.service';

describe('provideNgxStripe', () => {
  it('registers core providers and version', () => {
    TestBed.configureTestingModule({
      providers: [provideNgxStripe('pk_test_demo')]
    });

    expect(TestBed.inject(STRIPE_PUBLISHABLE_KEY)).toBe('pk_test_demo');
    expect(TestBed.inject(NGX_STRIPE_VERSION)).toBe('22.10.2');
    expect(TestBed.inject(LazyStripeAPILoader)).toBeTruthy();
    expect(TestBed.inject(StripeService)).toBeTruthy();
    expect(TestBed.inject(StripeFactoryService)).toBeTruthy();
  });

  it('creates a second instance via the factory', () => {
    TestBed.configureTestingModule({
      providers: [provideNgxStripe('pk_test_default')]
    });

    const factory = TestBed.inject(StripeFactoryService);
    const other = factory.create('pk_test_other');
    expect(other).toBeTruthy();
    expect(typeof other.confirmPayment).toBe('function');
    expect(typeof other.elements).toBe('function');
  });

  it('registers under zoneless change detection', () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideNgxStripe('pk_test_zoneless')]
    });

    expect(TestBed.inject(STRIPE_PUBLISHABLE_KEY)).toBe('pk_test_zoneless');
    expect(TestBed.inject(LazyStripeAPILoader)).toBeTruthy();
    expect(TestBed.inject(StripeService)).toBeTruthy();
  });
});
