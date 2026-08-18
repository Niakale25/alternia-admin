import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HtmlSecurisePipe } from '../../../partage/tuyaux/html-securise.pipe';

export interface ElementNavigation {
  label: string;
  route: string;
  icone: string;
  badge?: number | string;
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
  @Input() repliee: boolean = false;
  @Output() basculerRepli = new EventEmitter<void>();

  readonly groupesNavigation: GroupeNavigation[] = [
    {
      label: 'GOUVERNANCE EDTECH',
      elements: [
        {
          label: 'Tableau de Bord',
          route: '/tableau-bord',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>'
        },
        {
          label: 'Établissements',
          route: '/etablissements',
          badge: '1 247',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2z"/></svg>'
        },
        {
          label: 'Comptes Parents',
          route: '/parents',
          badge: '48k',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
        }
      ]
    },
    {
      label: 'INFRASTRUCTURE CLASSE',
      elements: [
        {
          label: 'Boîtiers Alternia',
          route: '/boitiers',
          badge: '96%',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/><circle cx="6" cy="15" r="1"/><circle cx="10" cy="15" r="1"/></svg>'
        }
      ]
    },
    {
      label: 'COMMERCE & RAPPORTS',
      elements: [
        {
          label: 'Licences & Packs',
          route: '/licences',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>'
        },
        {
          label: 'Abonnements B2C',
          route: '/abonnements',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
        },
        {
          label: 'Statistiques Globales',
          route: '/statistiques',
          icone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>'
        }
      ]
    },
    {
      label: 'SYSTÈME',
      elements: [
        {
          label: 'Paramètres',
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
