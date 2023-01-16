import { Directive, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

import { StripeElements, StripeElementsOptions } from '@stripe/stripe-js';

import { StripeInstance } from '../services/stripe-instance.class';
import { StripeElementsService } from '../services/stripe-elements.service';

@Directive({
  selector: 'ngx-stripe-elements,[ngxStripeElements]'
})
export class StripeElementsDirective implements OnInit, OnChanges {
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeInstance;

  @Output() elements = new EventEmitter<StripeElements>();

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
