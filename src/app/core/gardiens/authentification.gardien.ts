import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthentificationService } from '@core/services/authentification/authentification.service';

/**
 * Gardien de route — redirige vers /connexion si le super admin n'est pas connecté
 */
export const gardienAuthentification: CanActivateFn = () => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);

  if (authService.estConnecte()) {
    return true;
  }

  return router.createUrlTree(['/connexion']);
};

/**
 * Gardien inverse — redirige vers /tableau-bord si déjà connecté
 */
export const gardienDejaConnecte: CanActivateFn = () => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);

  if (!authService.estConnecte()) {
    return true;
  }

  return router.createUrlTree(['/tableau-bord']);
};
