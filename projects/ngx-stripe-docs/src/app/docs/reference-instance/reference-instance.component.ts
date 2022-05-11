import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ngstr-reference-instance',
  templateUrl: './reference-instance.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NgStrReferenceInstanceComponent {
  referenceAndInstance = `
    import { Component, OnInit } from '@angular/core';

    import { StripeService } from 'ngx-stripe';

    @Component({
      selector: 'ngstr-stripe-test',
      templateUrl: 'stripe.html'
    })
    export class StripeTestComponent implements OnInit {

      constructor(
        private fb: FormBuilder,
        private stripeSerivce: StripeService
      ) {}

      ngOnInit() {
        // this is equivalent to window.Stipe, but it make sure the module is loaded
        const Stripe$: Observable<any> = this.stripeService.getStripeReference();

        // this is a reference to the stripe elements object
        const stripe = this.stripeService.getInstance();
      }
    }
  `;
}
