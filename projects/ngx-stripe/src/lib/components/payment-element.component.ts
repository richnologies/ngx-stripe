import {
  Component,
  OnChanges,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';

import {
  Appearance,
  StripeElements,
  StripeElementsOptions,
  StripePaymentElement,
  StripePaymentElementChangeEvent,
  StripePaymentElementOptions
} from '@stripe/stripe-js';

import { StripeElementsService } from '../services/stripe-elements.service';
import { StripeInstance } from '../services/stripe-instance.class';

@Component({
  selector: 'ngx-stripe-payment',
  template: `<div class="field" #stripeElementRef></div>`
})
export class StripePaymentElementComponent implements OnChanges, OnDestroy {
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripePaymentElement;
  elements: StripeElements;

  @Input() containerClass: string;
  @Input() options: Partial<StripePaymentElementOptions>;
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeInstance;

  @Input() appearance: Appearance;
  @Input() clientSecret: string;
  @Input() doNotCreateUntilClientSecretIsSet = false;

  @Output() load = new EventEmitter<StripePaymentElement>();

  @Output() blur = new EventEmitter<void>();
  @Output() change = new EventEmitter<StripePaymentElementChangeEvent>();
  @Output() focus = new EventEmitter<void>();
  @Output() ready = new EventEmitter<void>();
  @Output() escape = new EventEmitter<void>();

  state: 'notready' | 'starting' | 'ready' = 'notready';

  constructor(public stripeElementsService: StripeElementsService) {}

  async ngOnChanges(changes: SimpleChanges) {
    this.state = 'starting';

    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);
    let updateElements = false;

    if (changes.elementsOptions || changes.stripe || changes.clientSecret || changes.appearance || !this.elements) {
      this.elements = await this.stripeElementsService
        .elements(this.stripe, {
          ...(this.elementsOptions || {}),
          ...(this.appearance ? { appearance: this.appearance } : {}),
          ...(this.clientSecret ? { clientSecret: this.clientSecret } : {})
        })
        .toPromise();
      updateElements = true;
    }

    if (changes.options || changes.containerClass || !this.element || updateElements) {
      if (this.element && !updateElements) {
        this.update(options);
      } else if (this.elements && updateElements) {
        this.createElement(options);
      }
    }

    this.state = 'ready';
  }

  ngOnDestroy() {
    if (this.element) {
      this.element.destroy();
    }
  }

  update(options: Partial<StripePaymentElementOptions>): StripePaymentElement {
    return this.element.update(options);
  }

  collapse(): StripePaymentElement {
    return this.element.collapse();
  }

  private createElement(options: Partial<StripePaymentElementOptions> = {}) {
    try {
      this.element = this.elements.create('payment', options);
    } catch (err) {
      this.elements = null;
      throw err;
    }

    this.element.on('change', (ev) => this.change.emit(ev));
    this.element.on('blur', () => this.blur.emit());
    this.element.on('focus', () => this.focus.emit());
    this.element.on('ready', () => this.ready.emit());
    this.element.on('escape', () => this.escape.emit());

    this.element.mount(this.stripeElementRef.nativeElement);

    this.load.emit(this.element);
  }
}
