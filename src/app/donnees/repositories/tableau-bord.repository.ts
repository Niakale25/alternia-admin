import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';

export interface KpiTableauBordDTO {
  label: string;
  valeur: string;
  sousTexte: string;
  tendance: number;
  tendanceLabel: string;
  couleur: string;
  icon: string;
  sparkline: number[];
  badgeLive?: string;
}

export interface AlertePrioritaireDTO {
  id: string;
  type: 'renouvellement' | 'boitier' | 'etablissement' | 'info';
  message: string;
  detail: string;
  urgence: 'haute' | 'normale' | 'basse';
  actionLabel: string;
  date: string;
}

export interface PointCroissanceDTO {
  mois: string;
  etablissements: number;
  parents: number;
  boitiers: number;
  requetesIA: number;
  sessionsCulture: number;
}

export interface DonneesTableauBordDTO {
  kpis: KpiTableauBordDTO[];
  alertes: AlertePrioritaireDTO[];
  graphiqueCroissance: PointCroissanceDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class TableauBordRepository {
  private readonly clientApi = inject(ClientApiService);
  private readonly endpoint = '/tableau-bord';

  private donneesLocales: DonneesTableauBordDTO = {
    kpis: [
      {
        label: 'ÉTABLISSEMENTS PARTENAIRES',
        valeur: '1 247',
        sousTexte: 'Lycées & Collèges connectés',
        tendance: 8.4,
        tendanceLabel: '+8,4% ce mois',
        couleur: '#314999',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2z"/></svg>',
        sparkline: [980, 1040, 1110, 1180, 1210, 1247],
        badgeLive: 'Mali Réseau'
      },
      {
        label: 'APPRENANTS & PARENTS',
        valeur: '48 391',
        sousTexte: 'Élèves actifs 10e, 11e, 12e',
        tendance: 12.4,
        tendanceLabel: '+12,4% vs M-1',
        couleur: '#0284c7',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        sparkline: [38200, 40500, 43100, 45600, 46800, 48391],
        badgeLive: '+540 ajd'
      },
      {
        label: 'BOÎTIERS EDGE ACTIFS',
        valeur: '1 202',
        sousTexte: '96,4% de flotte en ligne',
        tendance: 4.1,
        tendanceLabel: 'Edge Autonome',
        couleur: '#10b981',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/><circle cx="6" cy="15" r="1"/><circle cx="10" cy="15" r="1"/></svg>',
        sparkline: [960, 1020, 1090, 1150, 1180, 1202],
        badgeLive: '96.4% Live'
      },
      {
        label: 'SESSIONS & IMPACT CULTUREL',
        valeur: '142 800',
        sousTexte: 'Contes & fiches explorées',
        tendance: 18.2,
        tendanceLabel: '+18,2% d\'engagement',
        couleur: '#f1851f',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/><path d="M6 14h7"/></svg>',
        sparkline: [92000, 104000, 118000, 126000, 134000, 142800],
        badgeLive: 'Alta Culture'
      }
    ],
    alertes: [
      {
        id: 'ALT-1',
        type: 'renouvellement',
        message: '14 Abonnements Établissements expirent dans moins de 30 jours',
        detail: 'Région de Sikasso et Bamako — Procédure de renouvellement groupé recommandée',
        urgence: 'haute',
        actionLabel: 'Gérer les abonnements',
        date: 'Aujourd\'hui 08:30'
      },
      {
        id: 'ALT-2',
        type: 'boitier',
        message: '3 Boîtiers hors ligne depuis plus de 48 heures',
        detail: 'Ségou (2 boîtiers) et Mopti (1 boîtier) — Vérification réseau requise',
        urgence: 'normale',
        actionLabel: 'Inspecter les boîtiers',
        date: 'Hier 16:45'
      },
      {
        id: 'ALT-3',
        type: 'etablissement',
        message: 'Nouvelle demande d\'adhésion : École Pilote InnovEd Koulikoro',
        detail: 'Dossier complet soumis avec 300 élèves pour validation administrative',
        urgence: 'basse',
        actionLabel: 'Valider le dossier',
        date: '12/08/2026'
      }
    ],
    graphiqueCroissance: [
      { mois: 'Mars', etablissements: 980, parents: 38200, boitiers: 960, requetesIA: 84200, sessionsCulture: 92000 },
      { mois: 'Avril', etablissements: 1040, parents: 40500, boitiers: 1020, requetesIA: 98500, sessionsCulture: 104000 },
      { mois: 'Mai', etablissements: 1110, parents: 43100, boitiers: 1090, requetesIA: 112000, sessionsCulture: 118000 },
      { mois: 'Juin', etablissements: 1180, parents: 45600, boitiers: 1150, requetesIA: 125400, sessionsCulture: 126000 },
      { mois: 'Juil', etablissements: 1210, parents: 46800, boitiers: 1180, requetesIA: 132000, sessionsCulture: 134000 },
      { mois: 'Août', etablissements: 1247, parents: 48391, boitiers: 1202, requetesIA: 148900, sessionsCulture: 142800 }
    ]
  };

  recupererDonnees(): Observable<DonneesTableauBordDTO> {
    return of({ ...this.donneesLocales });
  }
}
