import { InjectionToken } from '@angular/core';

export interface ConfigurationApi {
  urlBase: string;
  version: string;
  cleApiKey?: string;
  tempsAttenteMs: number;
}

export const JETON_CONFIG_API = new InjectionToken<ConfigurationApi>('CONFIGURATION_API', {
  providedIn: 'root',
  factory: () => {
    const isDevLocal = typeof window !== 'undefined' && (window.location.port === '4200' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const host = (typeof window !== 'undefined' && window.location.hostname) ? window.location.hostname : '127.0.0.1';
    return {
      urlBase: isDevLocal ? `http://${host}:8000/api/v1` : '/api/v1',
      version: '1.0.0',
      tempsAttenteMs: 15000
    };
  }
});

