import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  Optional
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
  StripeElements,
  StripeCardNumberElement,
  StripeCardNumberElementOptions,
  StripeCardNumberElementChangeEvent
} from '@stripe/stripe-js';

import { StripeCardGroupDirective } from '../directives/card-group.directive';
import { StripeElementsService } from '../services/stripe-elements.service';

@Component({
  selector: 'ngx-stripe-card-number',
  template: `<div class="field" #stripeElementRef></div>`
})
export class StripeCardNumberComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('stripeElementRef') public stripeElementRef: ElementRef;
  element: StripeCardNumberElement;

  @Input() containerClass: string;
  @Input() options: Partial<StripeCardNumberElementOptions>;

  @Output() load = new EventEmitter<StripeCardNumberElement>();

  @Output() blur = new EventEmitter<void>();
  @Output() change = new EventEmitter<StripeCardNumberElementChangeEvent>();
  @Output() focus = new EventEmitter<void>();
  @Output() ready = new EventEmitter<void>();
  @Output() escape = new EventEmitter<void>();

  elements: StripeElements;
  cardGroupSubscription: Subscription;

  constructor(
    public stripeElementsService: StripeElementsService,
    @Optional() private cardGroup: StripeCardGroupDirective
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.options || changes.containerClass) {
      this.setupElement('options');
    }
  }

  ngOnInit() {
    if (this.cardGroup) {
      this.cardGroupSubscription = this.cardGroup.elements.subscribe(
        (elements: StripeElements) => {
          this.elements = elements;
          this.setupElement('elements');
        }
      );
    } else {
      throw new Error(
        'StripeCardNumberComponent must have StripeCardGroupDirective parent'
      );
    }
  }

  ngOnDestroy() {
    if (this.element) {
      this.element.destroy();
    }
    if (this.cardGroupSubscription) {
      this.cardGroupSubscription.unsubscribe();
    }
  }

  update(options: Partial<StripeCardNumberElementOptions>) {
    this.element.update(options);
  }

  /**
   * @deprecated
   */
  getCardNumber() {
    return this.element;
  }

  private setupElement(source: 'elements' | 'options') {
    const options = this.stripeElementsService.mergeOptions(
      this.options,
      this.containerClass
    );

    if (this.element && source === 'options') {
      this.update(options);
    } else if (this.elements && source === 'elements') {
      this.element = this.elements.create('cardNumber', options);
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
