
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
import { Subscription, from } from 'rxjs';

import {
  Appearance,
  StripeElements,
  StripeElementsOptions,
  StripeError,
  StripePaymentElement,
  StripePaymentElementChangeEvent,
  StripePaymentElementFieldChangeEvent,
  StripePaymentElementOptions
} from '@stripe/stripe-js';

import { StripeElementsDirective } from '../directives/elements.directive';

import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { StripeElementsService } from '../services/stripe-elements.service';

import { destroyStripeElement } from '../util/destroy-stripe-element.util';
import { SubscriberAwareEmitter } from '../util/subscriber-aware-emitter.util';
import {
  PAYMENT_ELEMENT_CREATE_ONLY_KEYS,
  PAYMENT_ELEMENT_NESTED_CREATE_ONLY_KEYS,
  createOnlyCheck,
  omitCreateOnlyOptions
} from '../util/update-options.util';

@Component({
  selector: 'ngx-stripe-payment',
  standalone: true,
  template: `<div class="field" #stripeElementRef></div>`,
  imports: []
})
export class StripePaymentElementComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripePaymentElement;
  elements!: StripeElements;

  @Input() containerClass!: string;
  @Input() options!: Partial<StripePaymentElementOptions>;
  @Input() elementsOptions!: Partial<StripeElementsOptions>;
  @Input() stripe!: StripeServiceInterface;

  @Input() appearance!: Appearance;
  @Input() clientSecret!: string;
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
  private readonly fieldChangeEmitter = new SubscriberAwareEmitter<StripePaymentElementFieldChangeEvent>(() =>
    this.listenForFieldChange()
  );
  /**
   * Requires beta access from Stripe. Emits when a field inside the Payment Element changes state
   * (displayed, focused, completed, errored...). ngx-stripe only listens for the event once
   * something subscribes, in the template or in code.
   */
  @Output() fieldchange: EventEmitter<StripePaymentElementFieldChangeEvent> = this.fieldChangeEmitter;

  state: 'notready' | 'starting' | 'ready' = 'notready';
  private elementsSubscription!: Subscription;
  private fieldChangeElement?: StripePaymentElement;
  private createOnly = createOnlyCheck('Payment Element', 'payment-element');

  constructor(
    public stripeElementsService: StripeElementsService,
    @Optional() private elementsProvider: StripeElementsDirective
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (this.doNotCreateUntilClientSecretIsSet && !this.hasClientSecret()) {
      return;
    }

    this.state = 'starting';
    let updateElements = false;

    if (
      !this.elementsProvider &&
      (changes.elementsOptions || changes.stripe || changes.clientSecret || changes.appearance || !this.elements)
    ) {
      this.elements = (await this.stripeElementsService
        .elements(this.stripe, {
          ...(this.elementsOptions || {}),
          ...(this.appearance ? { appearance: this.appearance } : {}),
          ...(this.clientSecret ? { clientSecret: this.clientSecret } : {})
        } as StripeElementsOptions)
        .toPromise())!;
      updateElements = true;
    }

    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);
    if (changes.options || changes.containerClass || !this.element || updateElements) {
      if (this.element && !updateElements) {
        this.update(options);
      } else if (this.elements && (updateElements || !this.element)) {
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
        if (this.doNotCreateUntilClientSecretIsSet && !this.hasClientSecret()) {
          return;
        }
        this.createElement(options);
        this.state = 'ready';
      });
    } else if (this.state === 'notready') {
      if (this.doNotCreateUntilClientSecretIsSet && !this.hasClientSecret()) {
        return;
      }

      this.state = 'starting';

      this.elements = (await this.stripeElementsService
        .elements(this.stripe, {
          ...(this.elementsOptions || {}),
          ...(this.appearance ? { appearance: this.appearance } : {}),
          ...(this.clientSecret ? { clientSecret: this.clientSecret } : {})
        } as StripeElementsOptions)
        .toPromise())!;
      this.createElement(options);

      this.state = 'ready';
    }
  }

  ngOnDestroy() {
    if (this.elementsSubscription) {
      this.elementsSubscription.unsubscribe();
    }
    destroyStripeElement(this.element);
  }

  update(options: Partial<StripePaymentElementOptions>): StripePaymentElement {
    return this.element.update(
      omitCreateOnlyOptions(
        options,
        PAYMENT_ELEMENT_CREATE_ONLY_KEYS,
        this.createOnly,
        PAYMENT_ELEMENT_NESTED_CREATE_ONLY_KEYS
      )
    );
  }

  collapse(): StripePaymentElement {
    return this.element.collapse();
  }

  fetchUpdates() {
    return from(this.elements.fetchUpdates());
  }

  /**
   * `fieldchange` is a beta event, so it is only registered when an app subscribes to the output.
   * Runs when the element is created and again on each subscription, whichever comes last.
   */
  private listenForFieldChange() {
    if (!this.element || !this.fieldChangeEmitter.hasHadSubscriber || this.fieldChangeElement === this.element) {
      return;
    }
    this.fieldChangeElement = this.element;
    this.element.on('fieldchange', (ev) => this.fieldchange.emit(ev));
  }

  private hasClientSecret(): boolean {
    return Boolean(this.clientSecret || this.elementsOptions?.clientSecret);
  }

  private createElement(options: Partial<StripePaymentElementOptions> = {}) {
    destroyStripeElement(this.element);

    try {
      this.element = this.elements.create('payment', options);
      this.createOnly = createOnlyCheck('Payment Element', 'payment-element', options);
    } catch (err) {
      this.elements = undefined as any;
      throw err;
    }

    this.element.on('change', (ev) => this.change.emit(ev));
    this.element.on('blur', (ev) => this.blur.emit(ev));
    this.element.on('focus', (ev) => this.focus.emit(ev));
    this.element.on('ready', (ev) => this.ready.emit(ev));
    this.element.on('escape', (ev) => this.escape.emit(ev));
    this.element.on('loaderror', (ev) => this.loaderror.emit(ev));
    this.listenForFieldChange();

    this.element.mount(this.stripeElementRef.nativeElement);

    this.load.emit(this.element);
  }
}
