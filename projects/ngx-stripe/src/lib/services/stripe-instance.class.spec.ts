import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { StripeInstance } from './stripe-instance.class';
import { LazyStripeAPILoader, LazyStripeAPILoaderStatus } from './api-loader.service';
import { WindowRef } from './window-ref.service';

describe('StripeInstance', () => {
  function createInstance(stripeMock: Record<string, unknown>) {
    const status$ = new BehaviorSubject<LazyStripeAPILoaderStatus>({
      loaded: true,
      loading: false,
      error: false
    });
    const loader = {
      asStream: () => status$.asObservable(),
      isReady: () => true,
      load: () => undefined,
      status: status$
    } as unknown as LazyStripeAPILoader;

    const stripeCtor = vi.fn().mockReturnValue({
      registerAppInfo: vi.fn(),
      ...stripeMock
    });

    const windowRef = {
      getNativeWindow: () => ({ Stripe: stripeCtor })
    } as unknown as WindowRef;

    const instance = new StripeInstance('22.10.2', loader, windowRef, 'pk_test_123');
    return { instance, stripeCtor };
  }

  it('calls stripe.confirmPayment once and completes', async () => {
    const confirmPayment = vi
      .fn()
      .mockResolvedValue({ paymentIntent: { status: 'succeeded' } });
    const { instance } = createInstance({ confirmPayment });

    const result = await firstValueFrom(
      instance.confirmPayment({
        elements: {} as any,
        redirect: 'if_required'
      })
    );

    expect(confirmPayment).toHaveBeenCalledTimes(1);
    expect(result.paymentIntent?.status).toBe('succeeded');
  });

  it('exposes getInstance after load', async () => {
    const { instance, stripeCtor } = createInstance({
      confirmPayment: () => Promise.resolve({})
    });
    await firstValueFrom(instance.stripe);
    expect(stripeCtor).toHaveBeenCalledWith('pk_test_123');
    expect(instance.getInstance()).toBeTruthy();
  });
});
