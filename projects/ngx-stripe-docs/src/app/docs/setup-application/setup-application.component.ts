import { Component } from '@angular/core';

import {
  NgStrCodeComponent,
  NgStrDocsHeaderComponent,
  NgStrHighlightComponent,
  NgStrLinkComponent,
  NgStrSectionComponent,
  NgStrSubheaderComponent
} from '../../docs-elements';

@Component({
  selector: 'ngstr-setup-application',
  templateUrl: './setup-application.component.html',
  standalone: true,
  imports: [
    NgStrCodeComponent,
    NgStrHighlightComponent,
    NgStrLinkComponent,
    NgStrSectionComponent,
    NgStrDocsHeaderComponent,
    NgStrSubheaderComponent
  ]
})
export default class NgStrSetupApplicationComponent {
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
  appConfig = `
    import { provideNgxStripe } from 'ngx-stripe';

    bootstrapApplication(AppComponent, {
      providers: [provideNgxStripe('***your-stripe-publishable-key***')]
    });
  `;
  options = `options?: { stripeAccount?: string; }`;
}
