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
  StripeTaxIdElement,
  StripeTaxIdElementOptions,
  StripeTaxIdElementChangeEvent
} from '@stripe/stripe-js';

import { NgxStripeElementLoadingTemplateDirective } from '../directives/stripe-element-loading-template.directive';
import { StripeElementsDirective } from '../directives/elements.directive';

import { StripeServiceInterface } from '../interfaces/stripe-instance.interface';

import { StripeElementsService } from '../services/stripe-elements.service';

@Component({
  selector: 'ngx-stripe-tax-id',
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
export class StripeTaxIdComponent implements OnInit, OnChanges, OnDestroy {
  @ContentChild(NgxStripeElementLoadingTemplateDirective, { read: TemplateRef })
  loadingTemplate?: TemplateRef<NgxStripeElementLoadingTemplateDirective>;
  @ViewChild('stripeElementRef') public stripeElementRef!: ElementRef;
  element!: StripeTaxIdElement;

  @Input() containerClass!: string;
  @Input() options!: StripeTaxIdElementOptions;
  @Input() elementsOptions!: StripeElementsOptions;
  @Input() stripe!: StripeServiceInterface;

  @Output() load = new EventEmitter<StripeTaxIdElement>();

  @Output() blur = new EventEmitter<void>();
  @Output() change = new EventEmitter<StripeTaxIdElementChangeEvent>();
  @Output() focus = new EventEmitter<void>();
  @Output() ready = new EventEmitter<void>();
  @Output() escape = new EventEmitter<void>();
  @Output() loaderror = new EventEmitter<void>();
  @Output() loaderstart = new EventEmitter<void>();

  elements!: StripeElements;
  state: 'notready' | 'starting' | 'ready' = 'notready';
  private elementsSubscription!: Subscription;

  constructor(
    public stripeElementsService: StripeElementsService,
    @Optional() private elementsProvider: StripeElementsDirective
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    this.state = 'starting';
    let updateElements = false;

    if (!this.elementsProvider && (changes.elementsOptions || changes.stripe || !this.elements)) {
      this.elements = (await this.stripeElementsService.elements(this.stripe, this.elementsOptions).toPromise())!;
      updateElements = true;
    }

    const options = this.stripeElementsService.mergeOptions(this.options, this.containerClass);
    if (changes.options || changes.containerClass || !this.element || updateElements) {
      if (this.element && !updateElements) {
        this.update(options);
      } else if (this.elements && updateElements) {
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

      this.elements = (await this.stripeElementsService.elements(this.stripe).toPromise())!;
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

  update(options: Partial<StripeTaxIdElementOptions>): StripeTaxIdElement {
    return this.element.update(options);
  }

  getValue(): Promise<StripeTaxIdElementChangeEvent> {
    const taxId = this.elements.getElement('taxId');
    return taxId!.getValue();
  }

  private createElement(options: StripeTaxIdElementOptions) {
    if (this.element) {
      this.element.unmount();
    }

    this.element = this.elements.create('taxId', options);
    this.element.on('change', (ev: StripeTaxIdElementChangeEvent) => this.change.emit(ev));
    this.element.on('blur', () => this.blur.emit());
    this.element.on('focus', () => this.focus.emit());
    this.element.on('ready', () => this.ready.emit());
    this.element.on('escape', () => this.escape.emit());
    this.element.on('loaderror', () => this.loaderror.emit());
    this.element.on('loaderstart', () => this.loaderstart.emit());

    this.element.mount(this.stripeElementRef.nativeElement);

    this.load.emit(this.element);
  }
}
