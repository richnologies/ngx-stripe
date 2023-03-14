import { Directive, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

import {
  StripeCardCvcElement,
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElement,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElement,
  StripeCardNumberElementChangeEvent,
  StripeElements,
  StripeElementsOptions
} from '@stripe/stripe-js';

import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { StripeElementsService } from '../services/stripe-elements.service';

type NgxStripeCardGroupChangeEvent =
  | StripeCardNumberElementChangeEvent
  | StripeCardExpiryElementChangeEvent
  | StripeCardCvcElementChangeEvent;

type NgxStripeCardGroupElements = StripeCardNumberElement | StripeCardExpiryElement | StripeCardCvcElement;

@Directive({ selector: 'ngx-stripe-card-group,[ngxStripeCardGroup]' })
export class StripeCardGroupDirective implements OnInit, OnChanges {
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeServiceInterface;

  @Output() elements = new EventEmitter<StripeElements>();

  @Output() load = new EventEmitter<NgxStripeCardGroupElements>();

  @Output() blur = new EventEmitter<void>();
  @Output() change = new EventEmitter<NgxStripeCardGroupChangeEvent>();
  @Output() focus = new EventEmitter<void>();
  @Output() ready = new EventEmitter<void>();
  @Output() escape = new EventEmitter<void>();

  _elements: StripeElements;
  state: 'notready' | 'starting' | 'ready' = 'notready';

  constructor(public stripeElementsService: StripeElementsService) {}

  async ngOnChanges(changes: SimpleChanges) {
    this.state = 'starting';

    const elementsOptions = this.elementsOptions;
    const stripe = this.stripe;

    if (changes.elementsOptions || changes.stripe || !this._elements) {
      this._elements = await this.stripeElementsService.elements(stripe, elementsOptions).toPromise();
      this.elements.emit(this._elements);
    }

    this.state = 'ready';
  }

  async ngOnInit() {
    if (this.state === 'notready') {
      this.state = 'starting';

      this._elements = await this.stripeElementsService.elements(this.stripe).toPromise();
      this.elements.emit(this._elements);

      this.state = 'ready';
    }
  }
}
