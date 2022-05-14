import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { HighlightModule, HighlightOptions, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { NgxStripeModule } from 'ngx-stripe';
import { ToastrModule } from 'ngx-toastr';

import { environment } from '../environments/environment';

import { StrCoreModule, PLUTO_ID } from './core';
import { ENV } from './interfaces';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routing';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { relativeLinkResolution: 'legacy' }),
    NgxStripeModule.forRoot(
      'pk_test_51Ii5RpH2XTJohkGafOSn3aoFFDjfCE4G9jmW48Byd8OS0u2707YHusT5PojHOwWAys9HbvNylw7qDk0KkMZomdG600TJYNYj20'
    ),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HighlightModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      iconClasses: {
        info: 'toast-ngx-stripe'
      },
      preventDuplicates: false
    }),
    StrCoreModule
  ],
  providers: [
    {
      provide: ENV,
      useValue: environment
    },
    {
      provide: PLUTO_ID,
      useValue: '449f8516-791a-49ab-a09d-50f79a0678b6'
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: <HighlightOptions>{
        lineNumbers: true,
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'),
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml')
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
