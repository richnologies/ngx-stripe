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
  StripeCardElementOptions,
  StripeCardElement,
  StripeElements,
  StripeCardElementChangeEvent
} from '../interfaces/stripejs.interface';

import { StripeInstance } from '../services/stripe-instance.class';
import { StripeElementsService } from '../services/stripe-elements.service';

@Component({
  selector: 'ngx-stripe-card',
  template: `<div class="field" #stripeElementRef></div>`
})
export class StripeCardComponent implements OnChanges, OnDestroy {
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripeCardElement;

  @Input() containerClass: string;
  @Input() options: Partial<StripeCardElementOptions>;
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeInstance;

  @Output() load = new EventEmitter<StripeCardElement>();

  @Output() blur = new EventEmitter<void>();
  @Output() change = new EventEmitter<StripeCardElementChangeEvent>();
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
        this.element = this.elements.create('card', options);
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

  update(options: Partial<StripeCardElementOptions>) {
    this.element.update(options);
  }

  /**
   * @deprecated
   */
  getCard() {
    return this.element;
  }
}
