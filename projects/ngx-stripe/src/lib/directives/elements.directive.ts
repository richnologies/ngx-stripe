import { Directive, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { StripeElements, StripeElementsOptions } from '@stripe/stripe-js';

import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { StripeElementsService } from '../services/stripe-elements.service';

@Directive({
  selector: 'ngx-stripe-elements,[ngxStripeElements]'
})
export class StripeElementsDirective implements OnInit, OnChanges {
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeServiceInterface;

  @Output() elements = new EventEmitter<StripeElements>();

  _elements: StripeElements;
  state: 'notready' | 'starting' | 'ready' = 'notready';

  constructor(public stripeElementsService: StripeElementsService) {}

  async ngOnChanges(changes: SimpleChanges) {
    this.state = 'starting';

    const elementsOptions = this.elementsOptions;
    const stripe = this.stripe;

    if (changes.elementsOptions || changes.stripe || !this._elements) {
      this._elements = await lastValueFrom(this.stripeElementsService.elements(stripe, elementsOptions));
      this.elements.emit(this._elements);
    }

    this.state = 'ready';
  }

  async ngOnInit() {
    if (this.state === 'notready') {
      this.state = 'starting';

      this._elements = await lastValueFrom(this.stripeElementsService.elements(this.stripe));
      this.elements.emit(this._elements);

      this.state = 'ready';
    }
  }
}
