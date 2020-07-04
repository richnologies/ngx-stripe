import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';

import {
  StripeElementsOptions,
  StripeElements,
  StripeCardCvcElement,
  StripeCardCvcElementChangeEvent,
  StripeCardCvcElementOptions
} from '../interfaces/stripejs.interface';

import { StripeInstance } from '../services/stripe-instance.class';
import { StripeElementsService } from '../services/stripe-elements.service';
import {} from '@stripe/stripe-js';

@Component({
  selector: 'ngx-stripe-card-cvc',
  template: `<div class="field" #stripeElementRef></div>`
})
export class StripeCardCvcComponent implements OnChanges, OnDestroy {
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripeCardCvcElement;

  @Input() containerClass: string;
  @Input() options: Partial<StripeCardCvcElementOptions>;
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeInstance;

  @Output() load = new EventEmitter<StripeCardCvcElement>();

  @Output() blur = new EventEmitter<void>();
  @Output() change = new EventEmitter<StripeCardCvcElementChangeEvent>();
  @Output() focus = new EventEmitter<void>();
  @Output() ready = new EventEmitter<void>();
  @Output() escape = new EventEmitter<void>();

  elements: StripeElements;

  constructor(public stripeElementsService: StripeElementsService) {}

  async ngOnChanges(changes: SimpleChanges) {
    const options = this.stripeElementsService.mergeOptions(
      this.options,
      this.containerClass
    );
    const elementsOptions = this.elementsOptions;
    const stripe = this.stripe;

    if (changes.elementsOptions || changes.stripe) {
      const elements = await this.stripeElementsService
        .elements(stripe, elementsOptions)
        .toPromise();
      this.elements = elements;
    }

    if (changes.options || changes.containerClass) {
      if (this.element) {
        this.update(options);
      } else {
        this.element = this.elements.create('cardCvc', options);
        this.element.on('change', (ev) => this.change.emit(ev));
        this.element.on('blur', () => this.blur.emit());
        this.element.on('focus', () => this.focus.emit());
        this.element.on('ready', () => this.ready.emit());
        this.element.on('escape', () => this.escape.emit());

        this.element.mount(this.stripeElementRef.nativeElement);

        this.load.emit(this.element);
      }
    }
  }

  ngOnDestroy() {
    this.element.destroy();
  }

  update(options: Partial<StripeCardCvcElementOptions>) {
    this.element.update(options);
  }

  /**
   * @deprecated
   */
  getCardCvc() {
    return this.element;
  }
}
