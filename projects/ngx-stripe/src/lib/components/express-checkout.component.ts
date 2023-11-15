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
  ContentChild,
  TemplateRef,
  Optional
} from '@angular/core';
import { Subscription } from 'rxjs';

import {
  StripeElementsOptions,
  StripeElements,
  StripeExpressCheckoutElement,
  StripeExpressCheckoutElementOptions,
  StripeExpressCheckoutElementReadyEvent,
  StripeError,
  StripeExpressCheckoutElementUpdateOptions,
  StripeExpressCheckoutElementClickEvent,
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementShippingAddressChangeEvent,
  StripeExpressCheckoutElementShippingRateChangeEvent
} from '@stripe/stripe-js';

import { NgxStripeElementLoadingTemplateDirective } from '../directives/stripe-element-loading-template.directive';
import { StripeElementsDirective } from '../directives/elements.directive';

import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { StripeElementsService } from '../services/stripe-elements.service';

export type NgxStripeExpressCheckoutElementLoadErrorEvent = {
  elementType: 'expressCheckout';
  error: StripeError;
};

@Component({
  selector: 'ngx-stripe-express-checkout',
  standalone: true,
  template: `
    <div class="field" #stripeElementRef>
      @if (state !== 'ready' && loadingTemplate) {
        <ng-container [ngTemplateOutlet]="loadingTemplate" />
      }
    </div>
  `,
  imports: [CommonModule]
})
export class StripeExpressCheckoutComponent implements OnInit, OnChanges, OnDestroy {
  @ContentChild(NgxStripeElementLoadingTemplateDirective, { read: TemplateRef })
  loadingTemplate?: TemplateRef<NgxStripeElementLoadingTemplateDirective>;
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripeExpressCheckoutElement;

  @Input() containerClass: string;
  @Input() options: StripeExpressCheckoutElementOptions;
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeServiceInterface;

  @Output() load = new EventEmitter<StripeExpressCheckoutElement>();

  @Output() blur = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() clicked = new EventEmitter<StripeExpressCheckoutElementClickEvent>();
  @Output() confirm = new EventEmitter<StripeExpressCheckoutElementConfirmEvent>();
  @Output() focus = new EventEmitter<void>();
  @Output() ready = new EventEmitter<StripeExpressCheckoutElementReadyEvent>();
  @Output() escape = new EventEmitter<void>();
  @Output() loaderror = new EventEmitter<NgxStripeExpressCheckoutElementLoadErrorEvent>();
  @Output() shippingaddresschange = new EventEmitter<StripeExpressCheckoutElementShippingAddressChangeEvent>();
  @Output() shippingratechange = new EventEmitter<StripeExpressCheckoutElementShippingRateChangeEvent>();

  elements: StripeElements;
  state: 'notready' | 'starting' | 'ready' = 'notready';
  private elementsSubscription: Subscription;

  constructor(
    public stripeElementsService: StripeElementsService,
    @Optional() private elementsProvider: StripeElementsDirective
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    this.state = 'starting';
    let updateElements = false;

    if (!this.elementsProvider && (changes.elementsOptions || changes.stripe || !this.elements)) {
      this.elements = await this.stripeElementsService.elements(this.stripe, this.elementsOptions).toPromise();
      updateElements = true;
    }

    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);
    if (changes.options || changes.containerClass || !this.element || updateElements) {
      if (this.elements && updateElements) {
        this.createElement(options);
      }
    }

    this.state = 'ready';
  }

  async ngOnInit() {
    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);

    if (this.elementsProvider) {
      this.elementsSubscription = this.elementsProvider.elements.subscribe((elements) => {
        this.elements = elements;
        this.createElement(options);
        this.state = 'ready';
      });
    } else if (this.state === 'notready') {
      this.state = 'starting';

      this.elements = await this.stripeElementsService.elements(this.stripe).toPromise();
      this.createElement(options);

      this.state = 'ready';
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

  update(options: StripeExpressCheckoutElementUpdateOptions): StripeExpressCheckoutElement {
    return this.element.update(options);
  }

  /**
   * @deprecated
   */
  getLinkAuthenticationElement() {
    return this.element;
  }

  private createElement(options: StripeExpressCheckoutElementOptions) {
    if (this.element) {
      this.element.unmount();
    }

    this.element = this.elements.create('expressCheckout', options);
    this.element.on('blur', () => this.blur.emit());
    this.element.on('cancel', () => this.cancel.emit());
    this.element.on('click', (ev: StripeExpressCheckoutElementClickEvent) => this.clicked.emit(ev));
    this.element.on('confirm', (ev: StripeExpressCheckoutElementConfirmEvent) => this.confirm.emit(ev));
    this.element.on('focus', () => this.focus.emit());
    this.element.on('ready', (ev: StripeExpressCheckoutElementReadyEvent) => this.ready.emit(ev));
    this.element.on('escape', () => this.escape.emit());
    this.element.on('loaderror', (err: NgxStripeExpressCheckoutElementLoadErrorEvent) => this.loaderror.emit(err));
    this.element.on('shippingaddresschange', (ev: StripeExpressCheckoutElementShippingAddressChangeEvent) =>
      this.shippingaddresschange.emit(ev)
    );
    this.element.on('shippingratechange', (ev: StripeExpressCheckoutElementShippingRateChangeEvent) =>
      this.shippingratechange.emit(ev)
    );

    this.element.mount(this.stripeElementRef.nativeElement);

    this.load.emit(this.element);
  }
}
