import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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

  recupererStatistiquesGlobales(periode: string = '30 jours'): Observable<StatistiquesGlobalesDTO> {
    return this.clientApi.get<StatistiquesGlobalesDTO>(this.endpoint, { periode });
  }
}
