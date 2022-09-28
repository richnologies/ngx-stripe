import { Component } from '@angular/core';
import { DocsElementsModule } from '../../docs-elements/docs-elements.module';

@Component({
  selector: 'ngstr-service-factory',
  templateUrl: './service-factory.component.html',
  standalone: true,
  imports: [DocsElementsModule]
})
export class NgStrServiceFactoryComponent {
  serviceFactoryTS = `
    import { Component, OnInit, ViewChild } from '@angular/core';
    import { FormGroup, FormBuilder, Validators } from "@angular/forms";

    import {
      StripeCardComponent,
      StripeInstance,
      StripeFactoryService
    } from "ngx-stripe";

    @Component({
      selector: 'ngstr-stripe-test',
      templateUrl: 'stripe.html'
    })
    export class StripeTestComponent implements OnInit {
      @ViewChild(StripeCardComponent) card: StripeCardComponent;

      stripe: StripeInstance;
      stripeTest: FormGroup;

      constructor(
        private fb: FormBuilder,
        private stripeFactory: StripeFactoryService
      ) {}

      ngOnInit() {
        this.stripe = this.stripeFactory.create('***your-stripe-publishable key***');
        this.stripeTest = this.fb.group({
          name: ['', [Validators.required]],
        });
      }

      createToken(): void {
        const name = this.stripeTest.get('name').value;
        this.stripe.createToken(this.card.element, { name }).subscribe((result) => {
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
  serviceFactoryHTML = `
    <h2>Create Token Example</h2>
    <ngx-stripe-card [stripe]="stripe"></ngx-stripe-card>
    <button type="submit" (click)="createToken()">
      CREATE TOKEN
    </button>
  `;
  serviceFactoryModule = `
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';

    import { AppComponent } from './app.component';

    // Import your library
    import { NgxStripeModule } from 'ngx-stripe';

    @NgModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        NgxStripeModule.forRoot(),
        LibraryModule
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
  `;
}
