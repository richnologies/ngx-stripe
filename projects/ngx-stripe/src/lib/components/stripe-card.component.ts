import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output
} from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

import {
  StripeElementsOptions,
  StripeCardElementOptions,
  StripeCardElement,
  StripeElements
} from '../interfaces/stripejs.interface';

import { StripeService } from '../services/stripe.service';
import { StripeInstance } from '../services/stripe-instance.class';

@Component({
  selector: 'ngx-stripe-card',
  template: ` <div class="field" #stripeCard></div> `
})
export class StripeCardComponent implements AfterViewInit {
  @Output() public card = new EventEmitter<StripeCardElement>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  public on = new EventEmitter<{
    type: 'change' | 'ready' | 'focus' | 'blur' | 'escape';
    event: any;
  }>();

  @ViewChild('stripeCard') public stripeCard!: ElementRef;
  public element!: StripeCardElement;
  @Input()
  public set options(optionsIn: StripeCardElementOptions) {
    this.options$.next(optionsIn);
  }
  public options$ = new BehaviorSubject<StripeCardElementOptions>({});
  @Input()
  public set elementsOptions(optionsIn: StripeElementsOptions) {
    this.elementsOptions$.next(optionsIn);
  }
  public elementsOptions$ = new BehaviorSubject<StripeElementsOptions>({});
  @Input()
  public set stripe(stripeIn: StripeInstance) {
    this.stripe$.next(stripeIn);
  }
  public stripe$ = new BehaviorSubject<StripeInstance | null>(null);

  constructor(public stripeService: StripeService) {}

  public ngAfterViewInit() {
    const elements$: Observable<StripeElements> = combineLatest([
      this.elementsOptions$.asObservable(),
      this.stripe$.asObservable()
    ]).pipe(
      switchMap(([options, stripe]) => {
        if (stripe) {
          if (Object.keys(options).length > 0) {
            return stripe.elements(options);
          }
          return stripe.elements();
        } else {
          if (Object.keys(options).length > 0) {
            return this.stripeService.elements(options);
          }
          return this.stripeService.elements();
        }
      })
    );
    combineLatest([
      elements$,
      this.options$.asObservable().pipe(filter((options) => Boolean(options)))
    ]).subscribe(([elements, options]) => {
      this.element = elements.create('card', options);

      this.element.on('change', (ev) =>
        this.on.emit({
          event: ev,
          type: 'change'
        })
      );

      this.element.on('blur', () =>
        this.on.emit({
          event: null,
          type: 'blur'
        })
      );

      this.element.on('focus', () =>
        this.on.emit({
          event: null,
          type: 'focus'
        })
      );

      this.element.on('ready', () =>
        this.on.emit({
          event: null,
          type: 'ready'
        })
      );

      this.element.on('escape', () =>
        this.on.emit({
          event: null,
          type: 'ready'
        })
      );

      this.element.mount(this.stripeCard.nativeElement);

      this.card.emit(this.element);
    });
  }

  getCard(): StripeCardElement {
    return this.element;
  }

  update(options: Partial<StripeCardElementOptions>) {
    this.element.update(options);
  }
}
