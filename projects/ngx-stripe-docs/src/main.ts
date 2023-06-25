import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HighlightModule, HighlightOptions, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { provideStripe } from 'ngx-stripe';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app/app.component';
import { ROUTES } from './app/app.routing';
import { PLUTO_ID } from './app/core';
import { ENV } from './app/interfaces';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

function bootstrap() {
  bootstrapApplication(AppComponent, {
    providers: [
      provideStripe(),
      importProvidersFrom(
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        HttpClientModule,
        RouterModule.forRoot(ROUTES, { initialNavigation: 'enabledBlocking' }),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HighlightModule,
        ToastrModule.forRoot({
          positionClass: 'toast-bottom-right',
          iconClasses: {
            info: 'toast-ngx-stripe'
          },
          preventDuplicates: false
        })
      ),
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
    ]
  }).catch((err) => console.error(err));
}

if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
