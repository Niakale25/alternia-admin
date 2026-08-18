import { Routes } from '@angular/router';
import { StructureGlobaleComponent } from '@core/disposition/structure-globale/structure-globale.component';
import { gardienAuthentification, gardienDejaConnecte } from '@core/gardiens/authentification.gardien';

export const routes: Routes = [
  // ── Page de connexion (accessible uniquement si non connecté) ──────────────
  {
    path: 'connexion',
    loadComponent: () =>
      import('./fonctionnalites/authentification/pages/connexion/connexion-page.component').then(
        m => m.ConnexionPageComponent
      ),
    canActivate: [gardienDejaConnecte],
    title: 'Connexion — Alternia Admin'
  },

  // ── Zone protégée (dashboard) ─────────────────────────────────────────────
  {
    path: '',
    component: StructureGlobaleComponent,
    canActivate: [gardienAuthentification],
    children: [
      {
        path: '',
        redirectTo: 'tableau-bord',
        pathMatch: 'full'
      },
      {
        path: 'tableau-bord',
        loadComponent: () =>
          import('./fonctionnalites/tableau-bord/pages/tableau-bord-page.component').then(
            m => m.TableauBordPageComponent
          ),
        title: 'Tableau de Bord — Alternia'
      },
      {
        path: 'etablissements',
        loadComponent: () =>
          import('./fonctionnalites/etablissements/pages/etablissements-page.component').then(
            m => m.EtablissementsPageComponent
          ),
        title: 'Établissements — Alternia'
      },
      {
        path: 'parents',
        loadComponent: () =>
          import('./fonctionnalites/parents/pages/parents-page.component').then(
            m => m.ParentsPageComponent
          ),
        title: 'Comptes Parents — Alternia'
      },
      {
        path: 'boitiers',
        loadComponent: () =>
          import('./fonctionnalites/boitiers/pages/boitiers-page.component').then(
            m => m.BoitiersPageComponent
          ),
        title: 'Boîtiers Alternia — Alternia'
      },

      {
        path: 'licences',
        loadComponent: () =>
          import('./fonctionnalites/licences/pages/licences-page.component').then(
            m => m.LicencesPageComponent
          ),
        title: 'Licences & Clés — Alternia'
      },
      {
        path: 'abonnements',
        loadComponent: () =>
          import('./fonctionnalites/abonnements/pages/abonnements-page.component').then(
            m => m.AbonnementsPageComponent
          ),
        title: 'Abonnements Parents — Alternia'
      },
      {
        path: 'statistiques',
        loadComponent: () =>
          import('./fonctionnalites/statistiques/pages/statistiques-page.component').then(
            m => m.StatistiquesPageComponent
          ),
        title: 'Statistiques Pédagogiques — Alternia'
      },
      {
        path: 'parametres',
        loadComponent: () =>
          import('./fonctionnalites/parametres/pages/parametres-page.component').then(
            m => m.ParametresPageComponent
          ),
        title: 'Paramètres Système — Alternia'
      }
    ]
  },

  // ── Page 404 ─────────────────────────────────────────────────────────────
  {
    path: '**',
    loadComponent: () =>
      import('./partage/composants/page-introuvable/page-introuvable.component').then(
        m => m.PageIntrouvableComponent
      ),
    title: 'Page introuvable — Alternia'
  }
];
