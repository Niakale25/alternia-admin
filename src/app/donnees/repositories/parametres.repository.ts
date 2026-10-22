import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';

export interface ParametresPlateformeDTO {
  nomPlateforme: string;
  paysPrincipal: string;
  emailAdmin: string;
  fuseauHoraire: string;
  modeMaintenance: boolean;
  seuilAlerteBoitierHeures: number;
  tauxTvaPourcent: number;
  devise: string;
  sauvegardesAutomatiques: boolean;
  frequenceSauvegarde: 'Quotidienne' | 'Hebdomadaire';
}

@Injectable({
  providedIn: 'root'
})
export class ParametresRepository {
  private readonly clientApi = inject(ClientApiService);
  private readonly endpoint = '/parametres';

  recupererParametres(): Observable<ParametresPlateformeDTO> {
    return this.clientApi.get<ParametresPlateformeDTO>(this.endpoint);
  }

  enregistrerParametres(nouveaux: Partial<ParametresPlateformeDTO>): Observable<ParametresPlateformeDTO> {
    return this.clientApi.put<ParametresPlateformeDTO>(this.endpoint, nouveaux);
  }
}
