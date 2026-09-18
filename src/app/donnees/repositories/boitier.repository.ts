import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  private donneesLocales: BoitierDTO[] = [
    {
      id: 'BOX-2024-001',
      serialNumber: 'ALT-BOX-V2-9941-ML',
      modele: 'AlternIA Box v2.0 Pro',
      etablissementId: 'ETAB-101',
      etablissementNom: 'Lycée Excellence Saint-Louis',
      statut: 'Actif',
      versionFirmware: 'v2.4.1-LTS',
      derniereConnexion: 'Il y a 2 min',
      ville: 'Bamako',
      region: 'Bamako',
      batterie: 94,
      stockageGo: 64,
      stockageUtiliseGo: 18.4,
      ipLocale: '192.168.4.1',
      wifiSsid: 'AlternIA-LycéeStLouis-01',
      elevesConnectes: 18,
      modeFonctionnement: 'Point d\'Accès Local',
      temperatureCpu: 41,
      packDonneesInstalle: 'Curriculum 10e-12e Mali + Pack Culture Complet',
      derniereMiseAJourOta: '15/08/2026'
    },
    {
      id: 'BOX-2024-002',
      serialNumber: 'ALT-BOX-V2-8812-ML',
      modele: 'AlternIA Box v2.0 Pro',
      etablissementId: 'ETAB-101',
      etablissementNom: 'Lycée Excellence Saint-Louis',
      statut: 'Actif',
      versionFirmware: 'v2.4.1-LTS',
      derniereConnexion: 'Il y a 5 min',
      ville: 'Bamako',
      region: 'Bamako',
      batterie: 88,
      stockageGo: 64,
      stockageUtiliseGo: 16.2,
      ipLocale: '192.168.4.2',
      wifiSsid: 'AlternIA-LycéeStLouis-02',
      elevesConnectes: 14,
      modeFonctionnement: 'Point d\'Accès Local',
      temperatureCpu: 39,
      packDonneesInstalle: 'Curriculum 10e-12e Mali + Pack Culture Complet',
      derniereMiseAJourOta: '15/08/2026'
    },
    {
      id: 'BOX-2024-003',
      serialNumber: 'ALT-BOX-V2-4419-ML',
      modele: 'AlternIA Box v2.0 Edge',
      etablissementId: 'ETAB-102',
      etablissementNom: 'Collège International Marie Curie',
      statut: 'Actif',
      versionFirmware: 'v2.4.0',
      derniereConnexion: 'Il y a 12 min',
      ville: 'Sikasso',
      region: 'Sikasso',
      batterie: 76,
      stockageGo: 32,
      stockageUtiliseGo: 12.8,
      ipLocale: '192.168.4.1',
      wifiSsid: 'AlternIA-Sikasso-Curie',
      elevesConnectes: 22,
      modeFonctionnement: '100% Offline Edge',
      temperatureCpu: 44,
      packDonneesInstalle: 'Curriculum 10e-11e + Contes Mandingues',
      derniereMiseAJourOta: '02/08/2026'
    },
    {
      id: 'BOX-2024-004',
      serialNumber: 'ALT-BOX-V2-7703-ML',
      modele: 'AlternIA Box v2.0 Edge',
      etablissementId: 'ETAB-103',
      etablissementNom: 'Complexe Scolaire La Renaissance',
      statut: 'Hors ligne',
      versionFirmware: 'v2.3.9',
      derniereConnexion: 'Il y a 2 jours',
      ville: 'Ségou',
      region: 'Ségou',
      batterie: 21,
      stockageGo: 32,
      stockageUtiliseGo: 14.1,
      ipLocale: '192.168.4.1',
      wifiSsid: 'AlternIA-Segou-Renaissance',
      elevesConnectes: 0,
      modeFonctionnement: '100% Offline Edge',
      temperatureCpu: 36,
      packDonneesInstalle: 'Curriculum Standard + Histoire Ségou',
      derniereMiseAJourOta: '10/07/2026'
    },
    {
      id: 'BOX-2024-005',
      serialNumber: 'ALT-BOX-V2-1150-ML',
      modele: 'AlternIA Box v2.0 Pro',
      etablissementId: 'ETAB-104',
      etablissementNom: 'Lycée Technique Alternia Bamako',
      statut: 'Maintenance',
      versionFirmware: 'v2.4.1-LTS',
      derniereConnexion: 'Hier à 16:30',
      ville: 'Bamako',
      region: 'Bamako',
      batterie: 100,
      stockageGo: 128,
      stockageUtiliseGo: 34.5,
      ipLocale: '192.168.4.1',
      wifiSsid: 'AlternIA-LabTech-BKO',
      elevesConnectes: 0,
      modeFonctionnement: 'Hybride Sync Cloud',
      temperatureCpu: 40,
      packDonneesInstalle: 'Full Curriculum Scientifique 11S/12S + IA Engine',
      derniereMiseAJourOta: '28/08/2026'
    },
    {
      id: 'BOX-2024-006',
      serialNumber: 'ALT-BOX-V2-3398-ML',
      modele: 'AlternIA Box v2.0 Edge',
      etablissementId: 'ETAB-106',
      etablissementNom: 'Académie Régionale de Kayes',
      statut: 'Actif',
      versionFirmware: 'v2.4.1-LTS',
      derniereConnexion: 'Il y a 1 min',
      ville: 'Kayes',
      region: 'Kayes',
      batterie: 82,
      stockageGo: 64,
      stockageUtiliseGo: 19.2,
      ipLocale: '192.168.4.1',
      wifiSsid: 'AlternIA-Kayes-Acad',
      elevesConnectes: 16,
      modeFonctionnement: 'Point d\'Accès Local',
      temperatureCpu: 43,
      packDonneesInstalle: 'Curriculum 10e-12e + Patrimoine Kayes/Khasso',
      derniereMiseAJourOta: '15/08/2026'
    }
  ];

  private campagnesOta: CampagneOtaDTO[] = [
    {
      id: 'OTA-2026-08',
      nom: 'Mise à jour Firmware v2.4.2 & Inférence Edge Haute Performance',
      versionCible: 'v2.4.2-Edge',
      typeContenu: 'Firmware Système',
      tailleMo: 145,
      totalCibles: 1247,
      totalAppliques: 1198,
      totalEnAttente: 49,
      statut: 'En cours',
      dateLancement: '25/08/2026'
    },
    {
      id: 'OTA-2026-07',
      nom: 'Pack Culturel — Contes & Monuments du Mali (Phase 2)',
      versionCible: 'v1.4-CultureData',
      typeContenu: 'Pack Culture & Contes',
      tailleMo: 320,
      totalCibles: 1247,
      totalAppliques: 1247,
      totalEnAttente: 0,
      statut: 'Terminée',
      dateLancement: '10/08/2026'
    }
  ];

  recupererTous(): Observable<BoitierDTO[]> {
    return of([...this.donneesLocales]);
  }

  recupererCampagnesOta(): Observable<CampagneOtaDTO[]> {
    return of([...this.campagnesOta]);
  }

  creer(nouveau: Omit<BoitierDTO, 'id' | 'derniereConnexion' | 'batterie' | 'stockageUtiliseGo' | 'elevesConnectes' | 'temperatureCpu'>): Observable<BoitierDTO> {
    const boitier: BoitierDTO = {
      ...nouveau,
      id: `BOX-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      derniereConnexion: 'À l\'instant',
      batterie: 100,
      stockageUtiliseGo: 8.5,
      elevesConnectes: 0,
      temperatureCpu: 38
    };
    this.donneesLocales = [boitier, ...this.donneesLocales];
    return of(boitier);
  }

  changerStatut(id: string, statut: BoitierDTO['statut']): Observable<BoitierDTO | null> {
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
