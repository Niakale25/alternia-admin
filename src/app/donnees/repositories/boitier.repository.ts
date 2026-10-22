import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';

export interface BoitierDTO {
  id: string;
  serialNumber: string;
  modele: string;
  etablissementId: string;
  etablissementNom: string;
  statut: 'Actif' | 'Hors ligne' | 'Maintenance' | 'Synchronisation';
  versionFirmware: string;
  derniereConnexion: string;
  ville: string;
  region: string;
  batterie: number; // Pourcentage (0-100)
  stockageGo: number; // Stockage total (ex: 64)
  stockageUtiliseGo: number; // Stockage occupé (ex: 18.2)
  ipLocale: string; // ex: 192.168.4.1
  wifiSsid: string; // ex: AlternIA-Box-WiFi-001
  elevesConnectes: number; // Apprenants connectés en local simultanément
  modeFonctionnement: '100% Offline Edge' | 'Hybride Sync Cloud' | 'Point d\'Accès Local';
  temperatureCpu?: number; // ex: 42°C
  derniereMiseAJourOta?: string;
  packDonneesInstalle: string;
}

export interface CampagneOtaDTO {
  id: string;
  nom: string;
  versionCible: string;
  typeContenu: 'Firmware Système' | 'Pack Cours Pédagogiques' | 'Pack Culture & Contes' | 'Voix TTS';
  tailleMo: number;
  totalCibles: number;
  totalAppliques: number;
  totalEnAttente: number;
  statut: 'En cours' | 'Planifiée' | 'Terminée';
  dateLancement: string;
}

@Injectable({
  providedIn: 'root'
})
export class BoitierRepository {
  private readonly clientApi = inject(ClientApiService);
  private readonly endpoint = '/boitiers';

  recupererTous(): Observable<BoitierDTO[]> {
    return this.clientApi.get<BoitierDTO[]>(this.endpoint);
  }

  recupererCampagnesOta(): Observable<CampagneOtaDTO[]> {
    return this.clientApi.get<CampagneOtaDTO[]>(`${this.endpoint}/campagnes-ota`);
  }

  creer(nouveau: Omit<BoitierDTO, 'id' | 'derniereConnexion' | 'batterie' | 'stockageUtiliseGo' | 'elevesConnectes' | 'temperatureCpu'>): Observable<BoitierDTO> {
    return this.clientApi.post<BoitierDTO>(this.endpoint, nouveau);
  }

  changerStatut(id: string, statut: BoitierDTO['statut']): Observable<BoitierDTO | null> {
    return this.clientApi.patch<BoitierDTO>(`${this.endpoint}/${id}/statut`, { statut });
  }

  supprimer(id: string): Observable<boolean> {
    return this.clientApi.delete<void>(`${this.endpoint}/${id}`).pipe(
      map(() => true)
    );
  }
}
