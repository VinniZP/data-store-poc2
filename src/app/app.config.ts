import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideZoneChangeDetection({ eventCoalescing: false, runCoalescing: false })
  ],
};
