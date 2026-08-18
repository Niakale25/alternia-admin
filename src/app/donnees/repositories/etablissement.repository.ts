import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';

export interface EtablissementDTO {
  id: string;
  nom: string;
  ville: string;
  region: string;
  boitiersCount: number;
  profilsCount: number;
  licencesCount: number;
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

  private donneesLocales: EtablissementDTO[] = [
    {
      id: 'ETAB-101', nom: 'Lycée Excellence Saint-Louis',
      ville: 'Bamako', region: 'District de Bamako',
      boitiersCount: 24, profilsCount: 18, licencesCount: 1200,
      dateInscription: '14/01/2024', statut: 'Actif',
      directeurEmail: 'direction@stlouis-bamako.ml',
      offre: 'Enterprise', contactPhone: '+223 20 22 44 11'
    },
    {
      id: 'ETAB-102', nom: 'Collège International Marie Curie',
      ville: 'Sikasso', region: 'Sikasso',
      boitiersCount: 18, profilsCount: 12, licencesCount: 850,
      dateInscription: '02/03/2024', statut: 'Actif',
      directeurEmail: 'admin@curie-sikasso.ml',
      offre: 'Institutionnel', contactPhone: '+223 21 62 10 09'
    },
    {
      id: 'ETAB-103', nom: 'Complexe Scolaire La Renaissance',
      ville: 'Ségou', region: 'Ségou',
      boitiersCount: 30, profilsCount: 22, licencesCount: 1500,
      dateInscription: '19/11/2023', statut: 'Actif',
      directeurEmail: 'contact@renaissance-segou.ml',
      offre: 'Enterprise', contactPhone: '+223 21 32 11 55'
    },
    {
      id: 'ETAB-104', nom: 'Lycée Technique Alternia Bamako',
      ville: 'Bamako', region: 'District de Bamako',
      boitiersCount: 12, profilsCount: 8, licencesCount: 450,
      dateInscription: '05/05/2024', statut: 'Actif',
      directeurEmail: 'proviseur@lta-bamako.ml',
      offre: 'Standard', contactPhone: '+223 20 21 00 44'
    },
    {
      id: 'ETAB-105', nom: 'École Pilote InnovEd Koulikoro',
      ville: 'Koulikoro', region: 'Koulikoro',
      boitiersCount: 8, profilsCount: 6, licencesCount: 300,
      dateInscription: '12/06/2026', statut: 'En attente',
      directeurEmail: 'direction@innoved-koulikoro.ml',
      offre: 'Standard', contactPhone: '+223 21 26 11 22'
    },
    {
      id: 'ETAB-106', nom: 'Académie Régionale de Kayes',
      ville: 'Kayes', region: 'Kayes',
      boitiersCount: 42, profilsCount: 34, licencesCount: 2100,
      dateInscription: '10/09/2023', statut: 'Actif',
      directeurEmail: 'secretariat@academie-kayes.ml',
      offre: 'Enterprise', contactPhone: '+223 21 52 77 88'
    },
    {
      id: 'ETAB-107', nom: 'Institut Pédagogique Mopti Venise',
      ville: 'Mopti', region: 'Mopti',
      boitiersCount: 15, profilsCount: 10, licencesCount: 780,
      dateInscription: '22/02/2024', statut: 'Suspendu',
      directeurEmail: 'admin@ip-mopti.ml',
      offre: 'Institutionnel', contactPhone: '+223 21 43 00 11'
    }
  ];

  recupererTous(): Observable<EtablissementDTO[]> {
    return of([...this.donneesLocales]);
  }

  creer(nouveau: Omit<EtablissementDTO, 'id' | 'dateInscription'>): Observable<EtablissementDTO> {
    const etablissement: EtablissementDTO = {
      ...nouveau,
      id: `ETAB-${Math.floor(100 + Math.random() * 900)}`,
      dateInscription: new Date().toLocaleDateString('fr-FR')
    };
    this.donneesLocales = [etablissement, ...this.donneesLocales];
    return of(etablissement);
  }

  changerStatut(id: string): Observable<EtablissementDTO | null> {
    const item = this.donneesLocales.find(e => e.id === id);
    if (item) {
      item.statut = item.statut === 'Actif' ? 'Suspendu' : 'Actif';
      return of({ ...item });
    }
    return of(null);
  }

  supprimer(id: string): Observable<boolean> {
    this.donneesLocales = this.donneesLocales.filter(e => e.id !== id);
    return of(true);
  }
}
