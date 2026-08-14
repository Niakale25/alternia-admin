import { Routes } from '@angular/router';
import { ShellComponent } from './core/layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'tableau-bord',
        pathMatch: 'full'
      },
      // Ancienne route commandement redirigée pour compatibilité
      {
        path: 'commandement',
        redirectTo: 'tableau-bord',
        pathMatch: 'full'
      },
      {
        path: 'tableau-bord',
        loadComponent: () => import('./features/tableau-bord/tableau-bord.component').then(m => m.TableauBordComponent),
        title: 'Tableau de Bord — Alternia'
      },
      {
        path: 'etablissements',
        loadComponent: () => import('./features/etablissements/etablissements.component').then(m => m.EtablissementsComponent),
        title: 'Établissements — Alternia'
      },
      {
        path: 'parents',
        loadComponent: () => import('./features/parents/parents.component').then(m => m.ParentsComponent),
        title: 'Parents — Alternia'
      },
      {
        path: 'boitiers',
        loadComponent: () => import('./features/boitiers/boitiers.component').then(m => m.BoitiersComponent),
        title: 'Boîtiers — Alternia'
      },

      {
        path: 'moteurs-ia',
        loadComponent: () => import('./features/moteurs-ia/moteurs-ia.component').then(m => m.MoteursIAComponent),
        title: 'Moteurs IA Pédagogiques — Alternia'
      },
      {
        path: 'licences',
        loadComponent: () => import('./features/licences/licences.component').then(m => m.LicencesComponent),
        title: 'Licences & Abonnements — Alternia'
      },
      {
        path: 'abonnements',
        loadComponent: () => import('./features/abonnements/abonnements.component').then(m => m.AbonnementsComponent),
        title: 'Abonnements Parents — Alternia'
      },
      {
        path: 'statistiques',
        loadComponent: () => import('./features/statistiques/statistiques.component').then(m => m.StatistiquesComponent),
        title: 'Statistiques Pédagogiques — Alternia'
      },
      {
        path: 'parametres',
        loadComponent: () => import('./features/parametres/parametres.component').then(m => m.ParametresComponent),
        title: 'Paramètres — Alternia'
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page introuvable — Alternia'
  }
];
