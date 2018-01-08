export class WindowRef {
  public getNativeWindow(): Window & { Stripe?: any } {
    return window;
  }
}
