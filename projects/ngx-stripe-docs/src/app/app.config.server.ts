import { HttpBackend } from '@angular/common/http';
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { EMPTY } from 'rxjs';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // The live demos create PaymentIntents on init. Prerendering runs at build time, so no
    // request may leave the build: every HttpClient call completes empty and the demos stay
    // in their loading state until the browser takes over.
    { provide: HttpBackend, useValue: { handle: () => EMPTY } }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
