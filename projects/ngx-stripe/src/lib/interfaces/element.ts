export interface Element {
  mount(el: HTMLElement | string): void;
  on(ev: ElementEventType, handler: (ev?: any) => void): void;
  blur(): void;
  clear(): void;
  focus(): void;
  unmount(): void;
  update(options: ElementOptions): void;
}

export type ElementEventType = 'blur' | 'change' | 'click' | 'focus' | 'ready';

export type ElementType =
  | 'card'
  | 'cardNumber'
  | 'cardExpiry'
  | 'cardCvc'
  | 'postalCode'
  | 'paymentRequestButton'
  | 'iban'
  | 'idealBank';

export interface ElementOptions {
  style?: {
    base?: ElementStyleAttributes;
    complete?: ElementStyleAttributes;
    empty?: ElementStyleAttributes;
    invalid?: ElementStyleAttributes;
  };
  hidePostalCode?: boolean;
  supportedCountries?: any;
  hideIcon?: boolean;
  iconStyle?: 'solid' | 'default';
  placeholder?: string;
  value?: string | object;
}

export interface ElementStyleAttributes {
  color?: any;
  fontFamily?: any;
  fontSize?: any;
  fontSmoothing?: any;
  fontStyle?: any;
  fontWeight?: any;
  fontVariant?: any;
  iconColor?: any;
  lineHeight?: any;
  letterSpacing?: any;
  textDecoration?: any;
  textShadow?: any;
  textTransform?: any;
  ':hover'?: any;
  ':focus'?: any;
  '::placeholder'?: any;
  '::selection'?: any;
  ':-webkit-autofill'?: any;
}
