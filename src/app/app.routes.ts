import { Routes } from '@angular/router';
import { ShellComponent } from './core/layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'commandement',
        pathMatch: 'full'
      },
      {
        path: 'commandement',
        loadComponent: () => import('./features/commandement/commandement.component').then(m => m.CommandementComponent),
        title: 'Centre de Commandement — Alternia'
      },
      {
        path: 'boitiers',
        loadComponent: () => import('./features/boitiers/boitiers.component').then(m => m.BoitiersComponent),
        title: 'Boîtiers — Alternia'
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
        path: 'licences',
        loadComponent: () => import('./features/licences/licences.component').then(m => m.LicencesComponent),
        title: 'Licences & Abonnements — Alternia'
      },
      {
        path: 'ia',
        loadComponent: () => import('./features/ia/ia.component').then(m => m.IaComponent),
        title: 'Intelligence Artificielle — Alternia'
      },
      {
        path: 'infrastructure',
        loadComponent: () => import('./features/infrastructure/infrastructure.component').then(m => m.InfrastructureComponent),
        title: 'Infrastructure Cloud — Alternia'
      },
      {
        path: 'deploiements',
        loadComponent: () => import('./features/deploiements/deploiements.component').then(m => m.DeploiementsComponent),
        title: 'Déploiements — Alternia'
      },
      {
        path: 'maintenance',
        loadComponent: () => import('./features/maintenance/maintenance.component').then(m => m.MaintenanceComponent),
        title: 'Maintenance & Support — Alternia'
      },
      {
        path: 'analytics',
        loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
        title: 'Analytics Globales — Alternia'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
