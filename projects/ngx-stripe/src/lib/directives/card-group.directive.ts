import {
  Directive,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  AfterViewInit,
  ContentChild,
  OnDestroy
} from '@angular/core';
import { merge, Subscription } from 'rxjs';

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

import { StripeCardNumberComponent } from '../components/card-number.component';
import { StripeCardExpiryComponent } from '../components/card-expiry.component';
import { StripeCardCvcComponent } from '../components/card-cvc.component';

import { StripeInstance } from '../services/stripe-instance.class';
import { StripeElementsService } from '../services/stripe-elements.service';

type NgxStripeCardGroupChangeEvent =
  | StripeCardNumberElementChangeEvent
  | StripeCardExpiryElementChangeEvent
  | StripeCardCvcElementChangeEvent;

type NgxStripeCardGroupElements =
  | StripeCardNumberElement
  | StripeCardExpiryElement
  | StripeCardCvcElement;

@Directive({
  selector: 'ngx-stripe-card-group,[ngxStripeCardGroup]',
  standalone: true,
})
export class StripeCardGroupDirective implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ContentChild(StripeCardNumberComponent) cardNumber: StripeCardNumberComponent;
  @ContentChild(StripeCardExpiryComponent) cardExpiry: StripeCardExpiryComponent;
  @ContentChild(StripeCardCvcComponent) cardCvc: StripeCardCvcComponent;

  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeInstance;

  @Output() elements = new EventEmitter<StripeElements>();

  @Output() load = new EventEmitter<NgxStripeCardGroupElements>();

  @Output() blur = new EventEmitter<void>();
  @Output() change = new EventEmitter<NgxStripeCardGroupChangeEvent>();
  @Output() focus = new EventEmitter<void>();
  @Output() ready = new EventEmitter<void>();
  @Output() escape = new EventEmitter<void>();

  _elements: StripeElements;
  state: 'notready' | 'starting' | 'ready' = 'notready';

  private subscriptions: Subscription = new Subscription();

  constructor(public stripeElementsService: StripeElementsService) {}

  ngAfterViewInit() {
    ['load', 'blur', 'change', 'focus', 'ready', 'escape']
      .map(ev => {
        console.log(ev);
        return merge(
          this.cardNumber[ev],
          this.cardExpiry[ev],
          this.cardCvc[ev]
        ).subscribe(result => this[ev].emit(result));
      })
      .forEach(subscriber => this.subscriptions.add(subscriber));
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

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
