import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { HighlightModule, HighlightOptions, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { provideNgxStripe } from 'ngx-stripe';

import { ROUTES } from './app.routing';
import { PLUTO_ID } from './core';
import { ENV } from './interfaces';

import { environment } from '../environments/environment';

/** Providers shared by the browser bootstrap (main.ts) and the build-time prerender (main.server.ts). */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideClientHydration(),
    provideNgxStripe(),
    provideHttpClient(),
    provideRouter(ROUTES, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),
    importProvidersFrom(ReactiveFormsModule, HighlightModule),
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
          javascript: () => import('highlight.js/lib/languages/javascript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml')
        }
      }
    }
  ]
};
