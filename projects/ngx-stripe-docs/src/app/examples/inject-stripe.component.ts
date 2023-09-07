import { CommonModule } from '@angular/common';
import { Component, DoCheck, OnChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { StripeFactoryService, StripeService } from 'ngx-stripe';

import { NgStrPlutoService } from '../core';

@Component({
  selector: 'ngstr-inject-example',
  template: `<div>Hello world!</div>`,
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class InjectExampleComponent implements DoCheck, OnChanges {
  stripe = this.stripeService.getInstance();

  constructor(
    private plutoService: NgStrPlutoService,
    private stripeService: StripeService
  ) {}

  ngDoCheck() {
    console.log('ngDoCheck');
  }

  ngOnChanges() {
    console.log('ngOnChanges');
  }
}
