import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '@partage/services/notification.service';

/**
 * Intercepteur HTTP global pour attraper les erreurs standard Spring Boot (ProblemDetail / ErrorResponse).
 */
export const intercepteurErreurApi: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((erreur: HttpErrorResponse) => {
      let message = 'Une erreur inattendue est survenue.';

      if (erreur.error && typeof erreur.error === 'object' && erreur.error.message) {
        message = erreur.error.message;
      } else if (erreur.status === 401) {
        message = 'Session expirée ou accès non autorisé.';
      } else if (erreur.status === 403) {
        message = 'Vous n\'avez pas les droits nécessaires pour effectuer cette action.';
      } else if (erreur.status === 404) {
        message = 'La ressource demandée est introuvable.';
      } else if (erreur.status >= 500) {
        message = 'Erreur interne du serveur Spring Boot.';
      }

      // En mode développement / fallback sans serveur réel connecté, on peut logguer l'erreur
      console.warn(`[API Spring Boot - ${erreur.status}] ${message}`);

      return throwError(() => erreur);
    })
  );
};
