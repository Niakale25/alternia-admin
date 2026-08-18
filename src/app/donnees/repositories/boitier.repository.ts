import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';

export interface BoitierDTO {
  id: string;
  serialNumber: string;
  etablissementId: string;
  etablissementNom: string;
  statut: 'Actif' | 'Hors ligne' | 'Maintenance';
  versionFirmware: string;
  derniereConnexion: string;
  ville: string;
}

@Injectable({
  providedIn: 'root'
})
export class BoitierRepository {
  private readonly clientApi = inject(ClientApiService);
  private readonly endpoint = '/boitiers';

  private donneesLocales: BoitierDTO[] = [
    {
      id: 'BOX-2024-001', serialNumber: 'ALT-ED-9941-ML',
      etablissementId: 'ETAB-101', etablissementNom: 'Lycée Excellence Saint-Louis',
      statut: 'Actif', versionFirmware: 'v3.4.2-LTS',
      derniereConnexion: 'Il y a 2 min', ville: 'Bamako'
    },
    {
      id: 'BOX-2024-002', serialNumber: 'ALT-ED-8812-ML',
      etablissementId: 'ETAB-101', etablissementNom: 'Lycée Excellence Saint-Louis',
      statut: 'Actif', versionFirmware: 'v3.4.2-LTS',
      derniereConnexion: 'Il y a 5 min', ville: 'Bamako'
    },
    {
      id: 'BOX-2024-003', serialNumber: 'ALT-ED-4419-ML',
      etablissementId: 'ETAB-102', etablissementNom: 'Collège International Marie Curie',
      statut: 'Actif', versionFirmware: 'v3.4.1',
      derniereConnexion: 'Il y a 12 min', ville: 'Sikasso'
    },
    {
      id: 'BOX-2024-004', serialNumber: 'ALT-ED-7703-ML',
      etablissementId: 'ETAB-103', etablissementNom: 'Complexe Scolaire La Renaissance',
      statut: 'Hors ligne', versionFirmware: 'v3.3.9',
      derniereConnexion: 'Il y a 2 jours', ville: 'Ségou'
    },
    {
      id: 'BOX-2024-005', serialNumber: 'ALT-ED-1150-ML',
      etablissementId: 'ETAB-104', etablissementNom: 'Lycée Technique Alternia Bamako',
      statut: 'Maintenance', versionFirmware: 'v3.4.2-LTS',
      derniereConnexion: 'Hier à 16:30', ville: 'Bamako'
    },
    {
      id: 'BOX-2024-006', serialNumber: 'ALT-ED-3398-ML',
      etablissementId: 'ETAB-106', etablissementNom: 'Académie Régionale de Kayes',
      statut: 'Actif', versionFirmware: 'v3.4.2-LTS',
      derniereConnexion: 'Il y a 1 min', ville: 'Kayes'
    }
  ];

  recupererTous(): Observable<BoitierDTO[]> {
    return of([...this.donneesLocales]);
  }

  creer(nouveau: Omit<BoitierDTO, 'id' | 'derniereConnexion'>): Observable<BoitierDTO> {
    const boitier: BoitierDTO = {
      ...nouveau,
      id: `BOX-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      derniereConnexion: 'À l\'instant'
    };
    this.donneesLocales = [boitier, ...this.donneesLocales];
    return of(boitier);
  }

  changerStatut(id: string, statut: 'Actif' | 'Hors ligne' | 'Maintenance'): Observable<BoitierDTO | null> {
    const item = this.donneesLocales.find(b => b.id === id);
    if (item) {
      item.statut = statut;
      return of({ ...item });
    }
    return of(null);
  }

  supprimer(id: string): Observable<boolean> {
    this.donneesLocales = this.donneesLocales.filter(b => b.id !== id);
    return of(true);
  }
}
