import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { Element as StripeElement } from '../interfaces/element';
import { StripeService } from '../services/stripe.service';

@Component({
  selector: 'ngx-stripe-card',
  template: `<div class="field" #card></div>`
})
export class StripeCardComponent implements OnInit {
  @Output() public onCard = new EventEmitter<StripeElement>();

  @ViewChild('card') private card: ElementRef;
  private element: StripeElement;
  @Input() private set options(options: any) {
    this.options$.next(options);
  }
  private options$ = new BehaviorSubject<any>(null);

  constructor(private stripeService: StripeService) {}

  public ngOnInit() {
    Observable
      .combineLatest(
        this.stripeService.elements(),
        this.options$.filter((options) => Boolean(options))
      )
      .subscribe(([elements, options]) => {
        this.element = elements.create('card', options);
        this.element.mount(this.card.nativeElement);

        this.onCard.emit(this.element);
      });
  }

  public getCard(): StripeElement {
    return this.element;
  }
}
