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
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';

import {
  StripeElements,
  StripeCardExpiryElement,
  StripeCardExpiryElementOptions,
  StripeCardExpiryElementChangeEvent
} from '@stripe/stripe-js';

import { StripeCardGroupDirective } from '../directives/card-group.directive';
import { StripeElementsService } from '../services/stripe-elements.service';

@Component({
  selector: 'ngx-stripe-card-expiry',
  template: `<div class="field" #stripeElementRef></div>`
})
export class StripeCardExpiryComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('stripeElementRef', { static: false })
  public stripeElementRef!: ElementRef;
  element!: StripeCardExpiryElement;

  @Input() containerClass: string;
  @Input() options: Partial<StripeCardExpiryElementOptions>;

  @Output() load = new EventEmitter<StripeCardExpiryElement>();

  @Output() blur = new EventEmitter<void>();
  @Output() change = new EventEmitter<StripeCardExpiryElementChangeEvent>();
  @Output() focus = new EventEmitter<void>();
  @Output() ready = new EventEmitter<void>();
  @Output() escape = new EventEmitter<void>();

  elements: StripeElements;
  cardGroupSubscription: Subscription;

  constructor(
    public stripeElementsService: StripeElementsService,
    private cardGroup: StripeCardGroupDirective
  ) {}

  ngOnInit() {
    this.cardGroupSubscription = this.cardGroup.elements.subscribe(
      (elements: StripeElements) => {
        this.elements = elements;
        this.setupElement('elements');
      }
    );
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.options || changes.containerClass) {
      this.setupElement('options');
    }
  }

  ngOnDestroy() {
    this.element.destroy();
    if (this.cardGroupSubscription) {
      this.cardGroupSubscription.unsubscribe();
    }
  }

  update(options: Partial<StripeCardExpiryElementOptions>) {
    this.element.update(options);
  }

  /**
   * @deprecated
   */
  getCardExpiry() {
    return this.element;
  }

  private setupElement(source: 'elements' | 'options') {
    const options = this.stripeElementsService.mergeOptions(
      this.options,
      this.containerClass
    );

    if (this.element && source === 'options') {
      this.update(options);
    } else if (this.elements) {
      this.element = this.elements.create('cardExpiry', options);
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
