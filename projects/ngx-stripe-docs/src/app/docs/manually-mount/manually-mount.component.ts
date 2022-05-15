import { Component } from '@angular/core';

@Component({
  selector: 'ngstr-manually-mount',
  templateUrl: './manually-mount.component.html'
})
export class NgStrManuallyMountComponent {
  stripeMountTS = `
    import { Component, OnInit, ViewChild } from '@angular/core';
    import { FormGroup, FormBuilder, Validators } from "@angular/forms";

    import { StripeService } from "ngx-stripe";
    import {
      StripeElements,
      StripeCardElement,
      StripeCardElementOptions,
      StripeElementsOptions
    } from '@stripe/stripe-js';

    @Component({
      selector: 'ngstr-stirpe-mount',
      templateUrl: '/stripe-mount.component.html'
    })
    export class StripeTestComponent implements OnInit {
      elements: StripeElements;
      card: StripeCardElement;

      cardOptions: StripeCardElementOptions = {
        style: {
          base: {
            iconColor: '#666EE8',
            color: '#31325F',
            fontWeight: '300',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSize: '18px',
            '::placeholder': {
              color: '#CFD7E0'
            }
          }
        }
      };

      elementsOptions: StripeElementsOptions = {
        locale: 'es'
      };

      stripeTest: FormGroup;

      constructor(
        private fb: FormBuilder,
        private stripeService: StripeService
      ) {}

      ngOnInit() {
        this.stripeTest = this.fb.group({
          name: ['', [Validators.required]]
        });
        this.stripeService.elements(this.elementsOptions)
          .subscribe(elements => {
            this.elements = elements;
            // Only mount the element the first time
            if (!this.card) {
              this.card = this.elements.create('card', this.cardOptions);
              this.card.mount('#card-element');
            }
          });
      }

      createToken() {
        const name = this.stripeTest.get('name').value;
        this.stripeService
          .createToken(this.card, { name })
          .subscribe((result) => {
            if (result.token) {
              // Use the token
              console.log(result.token.id);
            } else if (result.error) {
              // Error creating the token
              console.log(result.error.message);
            }
          });
      }
    }
  `;
  stripeMountHTML = `
    <form novalidate (ngSubmit)="createToken()" [formGroup]="stripeTest">
      <input type="text" formControlName="name" placeholder="Jane Doe">
      <div id="card-element" class="field"></div>
      <button type="submit">
        CREATE TOKEN
      </button>
    </form>
  `;
}
