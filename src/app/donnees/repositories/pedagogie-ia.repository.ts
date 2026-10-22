import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';

export interface AvatarPedagogiqueDTO {
  id: string;
  nom: string;
  matiere: string;
  stylePedagogique: string;
  voixTts: string;
  photoUrl: string;
  audioSampleText: string;
  promptSysteme: string;
  actif: boolean;
  parDefaut: boolean;
  niveauClasse: string;
  accent: string;
  // Paramètres Simli Streaming à distance
  moteurRendu: 'simli' | 'statique';
  simliApiKey?: string;
  simliFaceId?: string;
  simliModel?: 'fasttalk' | 'trinity' | 'artalk';
  simliHandleSilence?: boolean;
  statutTraitement?: 'pret' | 'en_cours' | 'echec';
  qualiteVisage?: number;
  latenceEdgeMs?: number;
  dateTraitement?: string;
}

export interface DonneesPedagogieIaDTO {
  avatars: AvatarPedagogiqueDTO[];
  kpis: {
    totalRequetesIa: string;
    tempsMoyenReponseEdge: string;
    avatarsActifs: number;
    voixTtsDisponibles: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PedagogieIaRepository {
  private readonly clientApi = inject(ClientApiService);
  private readonly endpoint = '/pedagogie-ia';

  recupererDonnees(): Observable<DonneesPedagogieIaDTO> {
    return this.clientApi.get<DonneesPedagogieIaDTO>(this.endpoint);
  }

  creerAvatar(nouveau: Omit<AvatarPedagogiqueDTO, 'id'>): Observable<AvatarPedagogiqueDTO> {
    return this.clientApi.post<AvatarPedagogiqueDTO>(`${this.endpoint}/avatars`, nouveau);
  }

  modifierAvatar(id: string, modifications: Partial<AvatarPedagogiqueDTO>): Observable<AvatarPedagogiqueDTO | null> {
    return this.clientApi.put<AvatarPedagogiqueDTO>(`${this.endpoint}/avatars/${id}`, modifications);
  }

  supprimerAvatar(id: string): Observable<boolean> {
    return this.clientApi.delete<void>(`${this.endpoint}/avatars/${id}`).pipe(
      map(() => true)
    );
  }
}
