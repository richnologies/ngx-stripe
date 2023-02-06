import {
  Component,
  OnChanges,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  SimpleChanges,
  Optional,
  OnInit
} from '@angular/core';
import { lastValueFrom, Subscription, from } from 'rxjs';

import {
  Appearance,
  StripeElements,
  StripeElementsOptions,
  StripeError,
  StripePaymentElement,
  StripePaymentElementChangeEvent,
  StripePaymentElementOptions
} from '@stripe/stripe-js';

import { StripeElementsDirective } from '../directives/elements.directive';

import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { StripeElementsService } from '../services/stripe-elements.service';

@Component({
  selector: 'ngx-stripe-payment',
  template: `<div class="field" #stripeElementRef></div>`
})
export class StripePaymentElementComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripePaymentElement;
  elements: StripeElements;

  @Input() containerClass: string;
  @Input() options: Partial<StripePaymentElementOptions>;
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeServiceInterface;

  @Input() appearance: Appearance;
  @Input() clientSecret: string;
  @Input() doNotCreateUntilClientSecretIsSet = false;

  @Output() load = new EventEmitter<StripePaymentElement>();

  @Output() blur = new EventEmitter<{ elementType: 'payment' }>();
  @Output() change = new EventEmitter<StripePaymentElementChangeEvent>();
  @Output() focus = new EventEmitter<{ elementType: 'payment' }>();
  @Output() ready = new EventEmitter<{ elementType: 'payment' }>();
  @Output() escape = new EventEmitter<{ elementType: 'payment' }>();
  @Output() loaderror = new EventEmitter<{
    elementType: 'payment';
    error: StripeError;
  }>();

  state: 'notready' | 'starting' | 'ready' = 'notready';
  private elementsSubscription: Subscription;

  constructor(
    public stripeElementsService: StripeElementsService,
    @Optional() private elementsProvider: StripeElementsDirective
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    this.state = 'starting';
    let updateElements = false;

    if (
      !this.elementsProvider &&
      (changes.elementsOptions || changes.stripe || changes.clientSecret || changes.appearance || !this.elements)
    ) {
      this.elements = await lastValueFrom(
        this.stripeElementsService.elements(this.stripe, {
          ...(this.elementsOptions || {}),
          ...(this.appearance ? { appearance: this.appearance } : {}),
          ...(this.clientSecret ? { clientSecret: this.clientSecret } : {})
        })
      );
      updateElements = true;
    }

    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);
    if (changes.options || changes.containerClass || !this.element || updateElements) {
      if (this.element && !updateElements) {
        this.update(options);
      } else if (this.elements && updateElements) {
        this.createElement(options);
      }
    }

    this.state = 'ready';
  }

  async ngOnInit() {
    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);

    if (this.elementsProvider) {
      this.elementsSubscription = this.elementsProvider.elements.subscribe((elements) => {
        this.elements = elements;
        this.createElement(options);
        this.state = 'ready';
      });
    } else if (this.state === 'notready') {
      this.state = 'starting';

      this.elements = await lastValueFrom(
        this.stripeElementsService.elements(this.stripe, {
          ...(this.elementsOptions || {}),
          ...(this.appearance ? { appearance: this.appearance } : {}),
          ...(this.clientSecret ? { clientSecret: this.clientSecret } : {})
        })
      );
      this.createElement(options);

      this.state = 'ready';
    }
  }

  ngOnDestroy() {
    if (this.element) {
      this.element.destroy();
    }
    if (this.elementsSubscription) {
      this.elementsSubscription.unsubscribe();
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
    if (this.element) {
      this.element.unmount();
    }

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
