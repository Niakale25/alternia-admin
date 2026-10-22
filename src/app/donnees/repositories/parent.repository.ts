import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';

export interface ParentDTO {
  id: string;
  nomFamille: string;
  tuteur: string;
  email: string;
  telephone: string;
  etablissement: string;
  enfantsRattaches: number;
  statut: 'Actif' | 'Inactif' | 'Suspendu';
  derniereActivite: string;
  abonnementsType: 'Premium Famille' | 'Premium Établissement' | 'Accès Général (Inclus Boîtier)';
}

@Injectable({
  providedIn: 'root'
})
export class ParentRepository {
  private readonly clientApi = inject(ClientApiService);
  private readonly endpoint = '/parents';

  recupererTous(): Observable<ParentDTO[]> {
    return this.clientApi.get<ParentDTO[]>(this.endpoint);
  }

  creer(nouveau: Omit<ParentDTO, 'id' | 'derniereActivite'>): Observable<ParentDTO> {
    return this.clientApi.post<ParentDTO>(this.endpoint, nouveau);
  }

  changerStatut(id: string): Observable<ParentDTO | null> {
    return this.clientApi.patch<ParentDTO>(`${this.endpoint}/${id}/statut`, {});
  }

  supprimer(id: string): Observable<boolean> {
    return this.clientApi.delete<void>(`${this.endpoint}/${id}`).pipe(
      map(() => true)
    );
  }
}
