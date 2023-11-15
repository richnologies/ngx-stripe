import { Component } from '@angular/core';

import { NgStrDocsHeaderComponent, NgStrSectionComponent, NgStrSubheaderComponent } from '../../docs-elements';

@Component({
  selector: 'ngstr-faqs',
  templateUrl: './faqs.component.html',
  standalone: true,
  imports: [NgStrDocsHeaderComponent, NgStrSectionComponent, NgStrSubheaderComponent]
})
export default class NgStrFAQSComponent {
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
