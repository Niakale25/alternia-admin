import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';

export interface EtablissementDTO {
  id: string;
  nom: string;
  ville: string;
  region: string;
  boitiersCount: number;
  profilsCount: number;
  effectifScolaire: number;
  dateInscription: string;
  statut: 'Actif' | 'En attente' | 'Suspendu';
  directeurEmail: string;
  offre: 'Enterprise' | 'Institutionnel' | 'Standard';
  contactPhone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EtablissementRepository {
  private readonly clientApi = inject(ClientApiService);
  private readonly endpoint = '/etablissements';

  recupererTous(): Observable<EtablissementDTO[]> {
    return this.clientApi.get<EtablissementDTO[]>(this.endpoint);
  }

  creer(nouveau: Omit<EtablissementDTO, 'id' | 'dateInscription'>): Observable<EtablissementDTO> {
    return this.clientApi.post<EtablissementDTO>(this.endpoint, nouveau);
  }

  changerStatut(id: string): Observable<EtablissementDTO | null> {
    return this.clientApi.patch<EtablissementDTO>(`${this.endpoint}/${id}/statut`, {});
  }

  supprimer(id: string): Observable<boolean> {
    return this.clientApi.delete<void>(`${this.endpoint}/${id}`).pipe(
      map(() => true)
    );
  }
}
