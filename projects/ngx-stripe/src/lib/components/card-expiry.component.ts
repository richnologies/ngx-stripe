import { CommonModule } from '@angular/common';
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
  Optional,
  ContentChild,
  TemplateRef
} from '@angular/core';
import { Subscription } from 'rxjs';

import {
  StripeElements,
  StripeCardExpiryElement,
  StripeCardExpiryElementOptions,
  StripeCardExpiryElementChangeEvent
} from '@stripe/stripe-js';

import { NgxStripeElementLoadingTemplateDirective } from '../directives/stripe-element-loading-template.directive';

import { StripeCardGroupDirective } from '../directives/card-group.directive';
import { StripeElementsDirective } from '../directives/elements.directive';

import { StripeElementsService } from '../services/stripe-elements.service';

@Component({
  selector: 'ngx-stripe-card-expiry',
  standalone: true,
  template: `
    <div class="field" #stripeElementRef>
      @if (cardGroup && cardGroup.state !== 'ready' && loadingTemplate) {
        <ng-container [ngTemplateOutlet]="loadingTemplate" />
      }
    </div>
  `,
  imports: [CommonModule]
})
export class StripeCardExpiryComponent implements OnInit, OnChanges, OnDestroy {
  @ContentChild(NgxStripeElementLoadingTemplateDirective, { read: TemplateRef })
  loadingTemplate?: TemplateRef<NgxStripeElementLoadingTemplateDirective>;
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
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
  elementsSubscription: Subscription;

  constructor(
    public stripeElementsService: StripeElementsService,
    @Optional() public cardGroup: StripeCardGroupDirective,
    @Optional() private elementsProvider: StripeElementsDirective
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.options || changes.containerClass) {
      this.setupElement('options');
    }
  }

  ngOnInit() {
    if (this.cardGroup) {
      this.elementsSubscription = this.cardGroup.elements.subscribe((elements: StripeElements) => {
        this.elements = elements;
        this.setupElement('elements');
      });
    } else if (this.elementsProvider) {
      this.elementsSubscription = this.elementsProvider.elements.subscribe((elements) => {
        this.elements = elements;
        this.setupElement('elements');
      });
    } else {
      throw new Error('StripeCardExpiryComponent must have StripeCardGroupDirective or StripeElementsDirective parent');
    }
  }

  ngOnDestroy() {
    if (this.element) {
      this.element.destroy();
    }
    if (this.elementsSubscription) {
      this.elementsSubscription.unsubscribe();
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
    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);

    if (this.element && source === 'options') {
      this.update(options);
    } else if (this.elements && source === 'elements') {
      this.element = this.elements.create('cardExpiry', options);
      this.element.on('change', (ev) => {
        this.change.emit(ev);
        this.cardGroup?.change.emit(ev);
      });
      this.element.on('blur', () => {
        this.blur.emit();
        this.cardGroup?.blur.emit();
      });
      this.element.on('focus', () => {
        this.focus.emit();
        this.cardGroup?.focus.emit();
      });
      this.element.on('ready', () => {
        this.ready.emit();
        this.cardGroup?.ready.emit();
      });
      this.element.on('escape', () => {
        this.escape.emit();
        this.cardGroup?.escape.emit();
      });

      this.element.mount(this.stripeElementRef.nativeElement);

      this.load.emit(this.element);
      this.cardGroup?.load.emit(this.element);
    }
  }
}
