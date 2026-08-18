import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Intercepteur HTTP pour injecter le jeton JWT dans les en-têtes Authorization
 */
export const intercepteurAuthentification: HttpInterceptorFn = (req, next) => {
  const jeton = typeof window !== 'undefined' ? localStorage.getItem('alternia_jeton_auth') : null;

  if (jeton) {
    const requeteAuthentifiee = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jeton}`,
        'Accept-Language': 'fr-FR,fr;q=0.9'
      }
    });
    return next(requeteAuthentifiee);
  }

  return next(req);
};
