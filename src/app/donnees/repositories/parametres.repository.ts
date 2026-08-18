import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  private parametresLocaux: ParametresPlateformeDTO = {
    nomPlateforme: 'Alternia EdTech Super Admin',
    paysPrincipal: 'Mali',
    emailAdmin: 'admin@alternia.io',
    fuseauHoraire: 'Africa/Bamako (GMT+0)',
    modeMaintenance: false,
    seuilAlerteBoitierHeures: 24,
    tauxTvaPourcent: 18,
    devise: 'FCFA',
    sauvegardesAutomatiques: true,
    frequenceSauvegarde: 'Quotidienne'
  };

  recupererParametres(): Observable<ParametresPlateformeDTO> {
    return of({ ...this.parametresLocaux });
  }

  enregistrerParametres(nouveaux: Partial<ParametresPlateformeDTO>): Observable<ParametresPlateformeDTO> {
    this.parametresLocaux = { ...this.parametresLocaux, ...nouveaux };
    return of({ ...this.parametresLocaux });
  }
}
