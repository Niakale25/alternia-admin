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

export interface DonneesTableauBordDTO {
  kpis: KpiTableauBordDTO[];
  alertes: AlertePrioritaireDTO[];
  graphiqueCroissance: Array<{
    mois: string;
    etablissements: number;
    parents: number;
    boitiers: number;
  }>;
  repartitionLicences: Array<{
    type: string;
    pourcentage: number;
    total: number;
    couleur: string;
  }>;
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
        sousTexte: 'Centres scolaires connectés',
        tendance: 8.4,
        tendanceLabel: '+8,4% ce mois',
        couleur: '#314999',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2z"/></svg>'
      },
      {
        label: 'PARENTS CONNECTÉS',
        valeur: '48 391',
        sousTexte: 'Comptes tuteurs actifs',
        tendance: 12.4,
        tendanceLabel: '+12,4% vs M-1',
        couleur: '#40BBCC',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
      },
      {
        label: 'BOÎTIERS ACTIFS',
        valeur: '1 202',
        sousTexte: 'Sur 1 247 déployés (96,4%)',
        tendance: 4.1,
        tendanceLabel: '96,4% en ligne',
        couleur: '#10B981',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/><circle cx="6" cy="15" r="1"/><circle cx="10" cy="15" r="1"/></svg>'
      },
      {
        label: 'REVENU RÉCURRENT (MRR)',
        valeur: '122M FCFA',
        sousTexte: 'ARR estimé : 1,46 Mrd FCFA',
        tendance: 9.3,
        tendanceLabel: '+9,3% de croissance',
        couleur: '#F1851F',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
      }
    ],
    alertes: [
      {
        id: 'ALT-1',
        type: 'renouvellement',
        message: '14 Licences Établissements expirent dans moins de 30 jours',
        detail: 'Région de Sikasso et Bamako — Procédure de renouvellement groupé recommandée',
        urgence: 'haute',
        actionLabel: 'Traiter les renouvellements',
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
      { mois: 'Mars', etablissements: 980, parents: 38200, boitiers: 960 },
      { mois: 'Avril', etablissements: 1040, parents: 40500, boitiers: 1020 },
      { mois: 'Mai', etablissements: 1110, parents: 43100, boitiers: 1090 },
      { mois: 'Juin', etablissements: 1180, parents: 45600, boitiers: 1150 },
      { mois: 'Juil', etablissements: 1210, parents: 46800, boitiers: 1180 },
      { mois: 'Août', etablissements: 1247, parents: 48391, boitiers: 1202 }
    ],
    repartitionLicences: [
      { type: 'Établissement Bulk', pourcentage: 68, total: 35430, couleur: 'var(--c-brand)' },
      { type: 'Parent Solo B2C', pourcentage: 22, total: 11462, couleur: 'var(--c-cyan)' },
      { type: 'Institutionnel Pack', pourcentage: 10, total: 5212, couleur: 'var(--c-accent)' }
    ]
  };

  recupererDonnees(): Observable<DonneesTableauBordDTO> {
    return of({ ...this.donneesLocales });
  }
}
