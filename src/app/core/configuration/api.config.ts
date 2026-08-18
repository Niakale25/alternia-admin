import { InjectionToken } from '@angular/core';

export interface ConfigurationApi {
  urlBase: string;
  version: string;
  cleApiKey?: string;
  tempsAttenteMs: number;
}

export const JETON_CONFIG_API = new InjectionToken<ConfigurationApi>('CONFIGURATION_API', {
  providedIn: 'root',
  factory: () => ({
    urlBase: '/api/v1',
    version: '1.0.0',
    tempsAttenteMs: 15000
  })
});
