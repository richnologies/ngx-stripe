import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ngstr-faqs',
  templateUrl: './faqs.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NgStrFAQSComponent {
  appModule = `
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';

    // Import your library
    import { NgxStripeModule } from 'ngx-stripe';

    @NgModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        NgxStripeModule.forRoot('***your-stripe-publishable-key***'),
        LibraryModule
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
  `;
  options = `options?: { stripeAccount?: string; }`;
}
