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
import { from } from 'rxjs';

import {
  Appearance,
  StripeElements,
  StripeElementsOptions,
  StripeError,
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

  @Output() blur = new EventEmitter<{ elementType: 'payment' }>();
  @Output() change = new EventEmitter<StripePaymentElementChangeEvent>();
  @Output() focus = new EventEmitter<{ elementType: 'payment' }>();
  @Output() ready = new EventEmitter<{ elementType: 'payment' }>();
  @Output() escape = new EventEmitter<{ elementType: 'payment' }>();
  @Output() loaderror = new EventEmitter<{ elementType: 'payment'; error: StripeError }>();

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

  fetchUpdates() {
    return from(this.elements.fetchUpdates());
  }

  private createElement(options: Partial<StripePaymentElementOptions> = {}) {
    try {
      this.element = this.elements.create('payment', options);
    } catch (err) {
      this.elements = null;
      throw err;
    }

    this.element.on('change', (ev) => this.change.emit(ev));
    this.element.on('blur', (ev) => this.blur.emit(ev));
    this.element.on('focus', (ev) => this.focus.emit(ev));
    this.element.on('ready', (ev) => this.ready.emit(ev));
    this.element.on('escape', (ev) => this.escape.emit(ev));
    this.element.on('loaderror', (ev) => this.loaderror.emit(ev));

    this.element.mount(this.stripeElementRef.nativeElement);

    this.load.emit(this.element);
  }
}
