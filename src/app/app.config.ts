import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { intercepteurAuthentification } from '@core/intercepteurs/authentification.intercepteur';
import { intercepteurErreurApi } from '@core/intercepteurs/erreur-api.intercepteur';
import { intercepteurMockApi } from '@core/intercepteurs/mock-api.intercepteur';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([intercepteurMockApi, intercepteurAuthentification, intercepteurErreurApi]))
  ]
};
