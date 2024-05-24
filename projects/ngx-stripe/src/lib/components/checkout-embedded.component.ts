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
  StripeElements
} from '@stripe/stripe-js';

import { NgxStripeElementLoadingTemplateDirective } from '../directives/stripe-element-loading-template.directive';
import { StripeElementsDirective } from '../directives/elements.directive';

import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { StripeElementsService } from '../services/stripe-elements.service';

@Component({
  selector: 'ngx-stripe-checkout-embedded',
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
export class NgxStripeCheckoutEmbeddedComponent implements OnInit, OnChanges, OnDestroy {
  @ContentChild(NgxStripeElementLoadingTemplateDirective, { read: TemplateRef })
  loadingTemplate?: TemplateRef<NgxStripeElementLoadingTemplateDirective>;
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripeCheckoutEmbeddedComponent;

  @Input() containerClass: string;
  @Input() options: StripeCheckoutEmbeddedElementOptions;
  @Input() elementsOptions: Partial<StripeElementsOptions>;
  @Input() stripe: StripeServiceInterface;

  @Output() load = new EventEmitter<StripeCheckoutEmbeddedElement>();

  @Output() blur = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() clicked = new EventEmitter<StripeCheckoutEmbeddedElementClickEvent>();
  @Output() confirm = new EventEmitter<StripeCheckoutEmbeddedElementConfirmEvent>();
  @Output() focus = new EventEmitter<void>();
  @Output() ready = new EventEmitter<StripeCheckoutEmbeddedElementReadyEvent>();
  @Output() escape = new EventEmitter<void>();
  @Output() shippingaddresschange = new EventEmitter<StripeCheckoutEmbeddedElementShippingAddressChangeEvent>();
  @Output() shippingratechange = new EventEmitter<StripeCheckoutEmbeddedElementShippingRateChangeEvent>();

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

  update(options: StripeCheckoutEmbeddedElementUpdateOptions): StripeCheckoutEmbeddedElement {
    return this.element.update(options);
  }

  /**
   * @deprecated
   */
  getLinkAuthenticationElement() {
    return this.element;
  }

  private createElement(options: StripeCheckoutEmbeddedElementOptions) {
    if (this.element) {
      this.element.unmount();
    }

    this.element = this.elements.create('expressCheckout', options);
    this.element.on('blur', () => this.blur.emit());
    this.element.on('cancel', () => this.cancel.emit());
    this.element.on('click', (ev: StripeCheckoutEmbeddedElementClickEvent) => this.clicked.emit(ev));
    this.element.on('confirm', (ev: StripeCheckoutEmbeddedElementConfirmEvent) => this.confirm.emit(ev));
    this.element.on('focus', () => this.focus.emit());
    this.element.on('ready', (ev: StripeCheckoutEmbeddedElementReadyEvent) => this.ready.emit(ev));
    this.element.on('escape', () => this.escape.emit());
    this.element.on('loaderror', (err: NgxStripeCheckoutEmbeddedElementLoadErrorEvent) => this.loaderror.emit(err));
    this.element.on('shippingaddresschange', (ev: StripeCheckoutEmbeddedElementShippingAddressChangeEvent) =>
      this.shippingaddresschange.emit(ev)
    );
    this.element.on('shippingratechange', (ev: StripeCheckoutEmbeddedElementShippingRateChangeEvent) =>
      this.shippingratechange.emit(ev)
    );

    this.element.mount(this.stripeElementRef.nativeElement);

    this.load.emit(this.element);
  }
}
