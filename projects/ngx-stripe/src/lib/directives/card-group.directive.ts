import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';

import { StripeElements, StripeElementsOptions } from '@stripe/stripe-js';

import { StripeInstance } from '../services/stripe-instance.class';
import { StripeElementsService } from '../services/stripe-elements.service';

@Directive({
  selector: 'ngx-stripe-card-group,[ngxStripeCardGroup]'
})
export class StripeCardGroupDirective implements OnChanges {
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeInstance;

  @Output() elements = new EventEmitter<StripeElements>();

  _elements: StripeElements;

  constructor(public stripeElementsService: StripeElementsService) {}

  async ngOnChanges(changes: SimpleChanges) {
    const elementsOptions = this.elementsOptions;
    const stripe = this.stripe;

    if (changes.elementsOptions || changes.stripe) {
      this._elements = await this.stripeElementsService
        .elements(stripe, elementsOptions)
        .toPromise();

      this.elements.emit(this._elements);
    }
  }
}
