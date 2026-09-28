/**
 * Stripe.js throws if `destroy()` is called on an element that is already destroyed
 * (for example when the mount node is removed before `ngOnDestroy` runs during routing).
 */
export function destroyStripeElement(element: { destroy(): void } | null | undefined): void {
  if (!element) {
    return;
  }

  try {
    element.destroy();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('already been destroyed')) {
      return;
    }
    throw err;
  }
}
