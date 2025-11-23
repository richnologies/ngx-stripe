import { provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { HighlightModule, HighlightOptions, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { provideNgxStripe } from 'ngx-stripe';

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
      provideZoneChangeDetection(),
      provideNgxStripe(),
      provideHttpClient(),
      provideRouter(
        ROUTES,
        withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
      ),
      importProvidersFrom(
        ReactiveFormsModule,
        HighlightModule
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
          coreLibraryLoader: () => import('highlight.js/lib/core'),
          lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'), // Optional, only if you want the line numbers
          languages: {
            typescript: () => import('highlight.js/lib/languages/typescript'),
            css: () => import('highlight.js/lib/languages/css'),
            xml: () => import('highlight.js/lib/languages/xml')
          },
          themePath: 'assets/highlightjs/xcode.css'
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
