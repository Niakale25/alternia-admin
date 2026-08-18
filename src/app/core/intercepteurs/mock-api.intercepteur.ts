import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, throwError, delay } from 'rxjs';

// ─── Identifiants du super admin de test ─────────────────────────────────────
const COMPTES_ADMINS: Record<string, { motDePasse: string; nom: string }> = {
  'adminalternia@gmail.com': {
    motDePasse: 'admin123',
    nom: 'Super Administrateur'
  }
};

/**
 * Intercepteur Mock — simule les réponses API sans backend réel.
 * À DÉSACTIVER dès que le vrai backend est disponible.
 */
export const intercepteurMockApi: HttpInterceptorFn = (req, next) => {
  // ── POST /api/v1/auth/login ──────────────────────────────────────────────
  if (req.method === 'POST' && req.url.includes('/api/v1/auth/login')) {
    const corps = req.body as { email?: string; motDePasse?: string };
    const email = corps?.email ?? '';
    const motDePasse = corps?.motDePasse ?? '';

    const compte = COMPTES_ADMINS[email.toLowerCase()];

    if (compte && compte.motDePasse === motDePasse) {
      //  Connexion réussie
      const reponse = new HttpResponse({
        status: 200,
        body: {
          jeton: `mock-jwt-token-${Date.now()}`,
          admin: {
            id: '1',
            email: email,
            nom: compte.nom
          }
        }
      });
      // Simule un délai réseau réaliste de 800ms
      return of(reponse).pipe(delay(800) as any);
    } else {
      // Identifiants incorrects
      return throwError(() =>
        new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
          error: { message: 'Email ou mot de passe incorrect.' }
        })
      ).pipe(delay(600) as any);
    }
  }

  // Toutes les autres requêtes passent normalement
  return next(req);
};
