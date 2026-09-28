import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';
import { NgStrOwnershipCalloutComponent } from '../../docs-elements/ownership-callout/ownership-callout.component';

@Component({
  selector: 'ngstr-faqs',
  templateUrl: './faqs.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgStrDocsHeaderComponent,
    NgStrHighlightComponent,
    NgStrOwnershipCalloutComponent,
    NgStrSectionComponent,
    NgStrSubheaderComponent
  ]
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
