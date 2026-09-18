import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HtmlSecurisePipe } from '../../../partage/tuyaux/html-securise.pipe';
import { AuthentificationService } from '../../services/authentification/authentification.service';

export interface ElementNavigation {
  label: string;
  route: string;
  queryParams?: Record<string, string>;
  icone: string;
}

export interface GroupeNavigation {
  label: string;
  elements: ElementNavigation[];
}

@Component({
  selector: 'app-barre-laterale',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, HtmlSecurisePipe],
  templateUrl: './barre-laterale.component.html',
  styleUrls: ['./barre-laterale.component.scss']
})
export class BarreLateraleComponent {
  readonly authService = inject(AuthentificationService);

  @Input() repliee: boolean = false;
  @Output() basculerRepli = new EventEmitter<void>();

  readonly groupesNavigation: GroupeNavigation[] = [
    {
      label: 'GOUVERNANCE SYSTEME',
      elements: [
        {
          label: 'Tableau de Bord',
          route: '/tableau-bord',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>'
        },
        {
          label: 'Établissements',
          route: '/etablissements',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2z"/></svg>'
        },
        {
          label: 'Apprenants & Familles',
          route: '/parents',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
        }
      ]
    },
    {
      label: 'INFRASTRUCTURE & EDGE',
      elements: [
        {
          label: 'Boîtiers Alternia Box',
          route: '/boitiers',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/><circle cx="6" cy="15" r="1"/><circle cx="10" cy="15" r="1"/></svg>'
        }
      ]
    },
    {
      label: 'INTELLIGENCE & PÉDAGOGIE',
      elements: [
        {
          label: 'Culture & Patrimoine',
          route: '/culture',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/><path d="M6 14h7"/></svg>'
        },
        {
          label: 'Studio Avatars & Voix',
          route: '/pedagogie-ia',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>'
        }
      ]
    },
    {
      label: 'BUSINESS & SYSTÈME',
      elements: [
        {
          label: 'Abonnements & Formules',
          route: '/abonnements',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>'
        },

        {
          label: 'Statistiques d\'Impact',
          route: '/statistiques',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>'
        },
        {
          label: 'Notifications & Alertes',
          route: '/notifications',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>'
        },
        {
          label: 'Paramètres Système',
          route: '/parametres',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
        }
      ]
    }
  ];

  onBasculer(): void {
    this.basculerRepli.emit();
  }
}
