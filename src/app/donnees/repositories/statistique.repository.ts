import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';

export interface StatistiquesGlobalesDTO {
  tempsUtilisationTotalHeures: number;
  volumeQuestionsMois: number;
  tauxSatisfactionMoyen: number;
  boitiersActifsRatio: number;
  matieresPlusConsultees: Array<{
    matiere: string;
    pourcentage: number;
    heuresTotal: number;
    croissance: number;
  }>;
  sujetsFrequents: Array<{
    sujet: string;
    matiere: string;
    occurrences: number;
    tendance: 'hausse' | 'baisse' | 'stable';
  }>;
  evolutionMensuelle: Array<{
    mois: string;
    questions: number;
    boitiersActifs: number;
    sessions: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class StatistiqueRepository {
  private readonly clientApi = inject(ClientApiService);
  private readonly endpoint = '/statistiques';

  private donneesLocales: StatistiquesGlobalesDTO = {
    tempsUtilisationTotalHeures: 1432800,
    volumeQuestionsMois: 1845000,
    tauxSatisfactionMoyen: 96.8,
    boitiersActifsRatio: 96.4,
    matieresPlusConsultees: [
      { matiere: 'Mathématiques & Géométrie', pourcentage: 38, heuresTotal: 544000, croissance: 14.5 },
      { matiere: 'Sciences Physiques & Chimie', pourcentage: 26, heuresTotal: 372000, croissance: 18.2 },
      { matiere: 'Français & Littérature', pourcentage: 21, heuresTotal: 300000, croissance: 8.7 },
      { matiere: 'SVT & Biologie', pourcentage: 15, heuresTotal: 216800, croissance: 11.0 }
    ],
    sujetsFrequents: [
      { sujet: 'Théorème de Pythagore & Trigonométrie', matiere: 'Mathématiques', occurrences: 42100, tendance: 'hausse' },
      { sujet: 'Lois d\'Ohm et circuits électriques', matiere: 'Physique', occurrences: 36800, tendance: 'hausse' },
      { sujet: 'Concordance des temps & subjonctif', matiere: 'Français', occurrences: 29400, tendance: 'stable' },
      { sujet: 'Division cellulaire & Mitose', matiere: 'SVT', occurrences: 24100, tendance: 'hausse' },
      { sujet: 'Équations du second degré', matiere: 'Mathématiques', occurrences: 21900, tendance: 'baisse' }
    ],
    evolutionMensuelle: [
      { mois: 'Mars', questions: 1200000, boitiersActifs: 980, sessions: 420000 },
      { mois: 'Avril', questions: 1350000, boitiersActifs: 1040, sessions: 490000 },
      { mois: 'Mai', questions: 1510000, boitiersActifs: 1110, sessions: 560000 },
      { mois: 'Juin', questions: 1680000, boitiersActifs: 1180, sessions: 610000 },
      { mois: 'Juil', questions: 1720000, boitiersActifs: 1210, sessions: 630000 },
      { mois: 'Août', questions: 1845000, boitiersActifs: 1247, sessions: 685000 }
    ]
  };

  recupererStatistiquesGlobales(periode: string = '30 jours'): Observable<StatistiquesGlobalesDTO> {
    return of({ ...this.donneesLocales });
  }
}
