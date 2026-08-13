import { Injectable, signal, computed } from '@angular/core';
import { EtablissementDTO } from '../models/admin-dto.model';

@Injectable({
  providedIn: 'root'
})
export class EtablissementService {
  private readonly _etablissements = signal<EtablissementDTO[]>([
    {
      id: 'ETAB-101', nom: 'Lycée Excellence Saint-Louis',
      codeRegion: 'CI-ABJ', ville: 'Abidjan', pays: 'Côte d\'Ivoire',
      boitiersCount: 24, profilsCount: 18, licencesCount: 1200,
      dateInscription: '14/01/2024', statut: 'Actif',
      directeurEmail: 'direction@stlouis-abidjan.ci',
      offre: 'Enterprise', contactPhone: '+225 27 22 44 11 00'
    },
    {
      id: 'ETAB-102', nom: 'Collège International Marie Curie',
      codeRegion: 'SN-DKR', ville: 'Dakar', pays: 'Sénégal',
      boitiersCount: 18, profilsCount: 12, licencesCount: 850,
      dateInscription: '02/03/2024', statut: 'Actif',
      directeurEmail: 'admin@curie-dakar.sn',
      offre: 'Institutionnel', contactPhone: '+221 33 821 00 99'
    },
    {
      id: 'ETAB-103', nom: 'Complexe Scolaire La Renaissance',
      codeRegion: 'CM-DLA', ville: 'Douala', pays: 'Cameroun',
      boitiersCount: 30, profilsCount: 22, licencesCount: 1500,
      dateInscription: '19/11/2023', statut: 'Actif',
      directeurEmail: 'contact@renaissance-douala.cm',
      offre: 'Enterprise', contactPhone: '+237 233 42 11 55'
    },
    {
      id: 'ETAB-104', nom: 'Lycée Technique Alternia Abidjan',
      codeRegion: 'CI-ABJ', ville: 'Abidjan', pays: 'Côte d\'Ivoire',
      boitiersCount: 12, profilsCount: 8, licencesCount: 450,
      dateInscription: '05/05/2024', statut: 'Actif',
      directeurEmail: 'proviseur@lta-abidjan.ci',
      offre: 'Standard', contactPhone: '+225 27 21 00 44 22'
    },
    {
      id: 'ETAB-105', nom: 'École Pilote InnovEd Dakar',
      codeRegion: 'SN-DKR', ville: 'Dakar', pays: 'Sénégal',
      boitiersCount: 8, profilsCount: 6, licencesCount: 300,
      dateInscription: '12/06/2026', statut: 'En attente',
      directeurEmail: 'direction@innoved-dakar.sn',
      offre: 'Standard', contactPhone: '+221 33 860 11 22'
    },
    {
      id: 'ETAB-106', nom: 'Académie Royale de Rabat',
      codeRegion: 'MA-RAB', ville: 'Rabat', pays: 'Maroc',
      boitiersCount: 42, profilsCount: 34, licencesCount: 2100,
      dateInscription: '10/09/2023', statut: 'Actif',
      directeurEmail: 'secretariat@academie-rabat.ma',
      offre: 'Enterprise', contactPhone: '+212 537 77 88 99'
    },
    {
      id: 'ETAB-107', nom: 'Institut Supérieur Yaoundé',
      codeRegion: 'CM-YAO', ville: 'Yaoundé', pays: 'Cameroun',
      boitiersCount: 15, profilsCount: 10, licencesCount: 780,
      dateInscription: '22/02/2024', statut: 'Suspendu',
      directeurEmail: 'admin@isy-yaounde.cm',
      offre: 'Institutionnel', contactPhone: '+237 222 23 00 11'
    },
  ]);

  readonly etablissements = computed(() => this._etablissements());
  readonly activeCount = computed(() => 1247);
  readonly pendingCount = computed(() => 17);
  readonly enterpriseCount = computed(() => 972);

  toggleStatus(id: string) {
    this._etablissements.update(list =>
      list.map(e => e.id === id ? { ...e, statut: e.statut === 'Actif' ? 'Suspendu' : 'Actif' } : e)
    );
  }
}
