import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';

export interface AbonnementDTO {
  id: string;
  parentNom: string;
  parentEmail: string;
  type: 'Premium Famille' | 'Premium Établissement' | 'Accès Général (Inclus Boîtier)';
  montant: number;
  dateDebut: string;
  dateRenouvellement: string;
  statut: 'Actif' | 'Résilié' | 'En attente de paiement' | 'Suspendu';
  autoRenouvellement: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AbonnementRepository {
  private readonly clientApi = inject(ClientApiService);
  private readonly endpoint = '/abonnements';

  recupererTous(): Observable<AbonnementDTO[]> {
    return this.clientApi.get<AbonnementDTO[]>(this.endpoint);
  }

  creer(nouveau: Omit<AbonnementDTO, 'id' | 'dateDebut'>): Observable<AbonnementDTO> {
    return this.clientApi.post<AbonnementDTO>(this.endpoint, nouveau);
  }

  changerStatut(id: string, statut: 'Actif' | 'Résilié' | 'En attente de paiement' | 'Suspendu'): Observable<AbonnementDTO | null> {
    return this.clientApi.patch<AbonnementDTO>(`${this.endpoint}/${id}/statut`, { statut });
  }

  supprimer(id: string): Observable<boolean> {
    return this.clientApi.delete<void>(`${this.endpoint}/${id}`).pipe(
      map(() => true)
    );
  }
}


