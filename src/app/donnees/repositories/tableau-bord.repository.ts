import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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

  recupererDonnees(): Observable<DonneesTableauBordDTO> {
    return this.clientApi.get<DonneesTableauBordDTO>(this.endpoint);
  }
}
