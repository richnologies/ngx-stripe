import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  Optional,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { Observable, from, Subscription } from 'rxjs';

import {
  StripeElementsOptions,
  StripeElements,
  PaymentRequestOptions,
  PaymentRequest,
  CanMakePaymentResult,
  PaymentRequestUpdateOptions,
  StripePaymentRequestButtonElement,
  StripePaymentRequestButtonElementOptions,
  StripePaymentRequestButtonElementClickEvent,
  PaymentRequestTokenEvent,
  PaymentRequestPaymentMethodEvent,
  PaymentRequestSourceEvent,
  PaymentRequestShippingAddressEvent,
  PaymentRequestShippingOptionEvent
} from '@stripe/stripe-js';

import { StripeElementsDirective } from '../directives/elements.directive';

import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { StripeElementsService } from '../services/stripe-elements.service';

import { destroyStripeElement } from '../util/destroy-stripe-element.util';

@Component({
  selector: 'ngx-stripe-payment-request-button',
  standalone: true,
  template: `<div class="field" #stripeElementRef></div>`,
  imports: [CommonModule]
})
export class StripePaymentRequestButtonComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripePaymentRequestButtonElement;
  paymentRequest!: PaymentRequest;

  @Input() containerClass: string;
  @Input() paymentOptions: PaymentRequestOptions;
  @Input() options: StripePaymentRequestButtonElementOptions;
  @Input() elementsOptions: StripeElementsOptions;
  @Input() stripe: StripeServiceInterface;

  @Output() load = new EventEmitter<{
    paymentRequestButton: StripePaymentRequestButtonElement;
    paymentRequest: PaymentRequest;
  }>();

  @Output() change = new EventEmitter<StripePaymentRequestButtonElementClickEvent>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();
  @Output() ready = new EventEmitter<void>();

  @Output() token = new EventEmitter<PaymentRequestTokenEvent>();
  @Output() paymentMethod = new EventEmitter<PaymentRequestPaymentMethodEvent>();
  @Output() source = new EventEmitter<PaymentRequestSourceEvent>();
  @Output() cancel = new EventEmitter<void>();
  @Output() shippingaddresschange = new EventEmitter<PaymentRequestShippingAddressEvent>();
  @Output() shippingoptionchange = new EventEmitter<PaymentRequestShippingOptionEvent>();
  @Output() notavailable = new EventEmitter<void>();

  elements: StripeElements;
  private state: 'notready' | 'starting' | 'ready' = 'notready';
  private elementsSubscription!: Subscription;
  private viewInitialized = false;
  private paymentRequestHandler: 'token' | 'paymentmethod' | 'source' | null = null;
  /** Bumps on each createElement so a superseded async mount does not finish. */
  private createGeneration = 0;

  constructor(
    public stripeElementsService: StripeElementsService,
    @Optional() private elementsProvider: StripeElementsDirective
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    this.state = 'starting';
    let updateElements = false;

    if (!this.elementsProvider && (changes.elementsOptions || changes.stripe || !this.elements)) {
      const elements = await this.stripeElementsService.elements(this.stripe, this.elementsOptions).toPromise();
      this.elements = elements;
      updateElements = true;
    }

    if (changes.paymentOptions && this.paymentRequest) {
      this.updateRequest(this.paymentOptions);
    }

    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);
    if (changes.options || changes.containerClass || !this.element || updateElements) {
      if (this.element && !updateElements) {
        this.update(options);
      } else if (this.elements && updateElements) {
        this.createElement(options);
      }
    }
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

      this.elements = await this.stripeElementsService.elements(this.stripe).toPromise();
      this.createElement(options);

      this.state = 'ready';
    }
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
    this.syncPaymentRequestHandlers();
  }

  ngOnDestroy() {
    if (this.elementsSubscription) {
      this.elementsSubscription.unsubscribe();
    }
    destroyStripeElement(this.element);
  }

  canMakePayment(): Observable<CanMakePaymentResult | null> {
    return from(this.paymentRequest.canMakePayment());
  }

  update(options: Partial<StripePaymentRequestButtonElementOptions>) {
    this.element.update(options);
  }

  updateRequest(options: PaymentRequestUpdateOptions) {
    const { currency, total, displayItems, shippingOptions } = options;

    this.paymentRequest.update({
      currency,
      total,
      displayItems,
      shippingOptions
    });
  }

  show(): void {
    this.paymentRequest.show();
  }

  abort(): void {
    this.paymentRequest.abort();
  }

  isShowing(): boolean {
    return this.paymentRequest.isShowing();
  }

  /**
   * @deprecated
   */
  getButton() {
    return this.element;
  }

  private desiredPaymentRequestHandler(): 'token' | 'paymentmethod' | 'source' | null {
    if (this.paymentMethod.observed) {
      return 'paymentmethod';
    }
    if (this.source.observed) {
      return 'source';
    }
    if (this.token.observed) {
      return 'token';
    }
    return null;
  }

  private registerPaymentRequestHandlers(): void {
    const handler = this.desiredPaymentRequestHandler();
    this.paymentRequestHandler = handler;

    if (handler === 'paymentmethod') {
      this.paymentRequest.on('paymentmethod', (ev) => this.paymentMethod.emit(ev));
    } else if (handler === 'source') {
      this.paymentRequest.on('source', (ev) => this.source.emit(ev));
    } else if (handler === 'token') {
      this.paymentRequest.on('token', (ev) => this.token.emit(ev));
    }
  }

  /**
   * Output bindings are attached after ngOnInit; re-create the PaymentRequest when the
   * subscribed handler changes (see #169, #183, #254).
   */
  private syncPaymentRequestHandlers(): void {
    if (!this.viewInitialized || !this.paymentRequest || !this.elements) {
      return;
    }

    const desired = this.desiredPaymentRequestHandler();
    if (desired === this.paymentRequestHandler) {
      return;
    }

    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);
    void this.createElement(options);
  }

  private async createElement(options: Partial<StripePaymentRequestButtonElementOptions> = {}) {
    const generation = ++this.createGeneration;

    this.paymentRequest = this.stripeElementsService.paymentRequest(this.stripe, this.paymentOptions);
    this.registerPaymentRequestHandlers();
    this.paymentRequest.on('cancel', () => this.cancel.emit());
    this.paymentRequest.on('shippingaddresschange', (ev) => this.shippingaddresschange.emit(ev));
    this.paymentRequest.on('shippingoptionchange', (ev) => this.shippingoptionchange.emit(ev));

    destroyStripeElement(this.element);
    this.element = this.elements.create('paymentRequestButton', {
      paymentRequest: this.paymentRequest,
      ...options
    });

    const result = await this.paymentRequest.canMakePayment();
    if (generation !== this.createGeneration) {
      return;
    }

    if (result) {
      this.element.on('click', (ev) => this.change.emit(ev));
      this.element.on('blur', () => this.blur.emit());
      this.element.on('focus', () => this.focus.emit());
      this.element.on('ready', () => this.ready.emit());

      this.element.mount(this.stripeElementRef.nativeElement);

      this.load.emit({
        paymentRequestButton: this.element,
        paymentRequest: this.paymentRequest
      });
    } else {
      this.notavailable.emit();
    }
  }
}
