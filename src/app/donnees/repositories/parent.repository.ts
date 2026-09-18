import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  private donneesLocales: ParentDTO[] = [
    {
      id: 'PAR-8821', nomFamille: 'Traoré', tuteur: 'Amadou Traoré',
      email: 'amadou.traore@gmail.com', telephone: '+223 76 12 34 56',
      etablissement: 'Lycée Excellence Saint-Louis', enfantsRattaches: 2,
      statut: 'Actif', derniereActivite: 'Aujourd\'hui 09:15', abonnementsType: 'Premium Famille'
    },
    {
      id: 'PAR-8822', nomFamille: 'Coulibaly', tuteur: 'Fatoumata Coulibaly',
      email: 'fatou.coulibaly@orange.ml', telephone: '+223 66 98 74 12',
      etablissement: 'Collège International Marie Curie', enfantsRattaches: 1,
      statut: 'Actif', derniereActivite: 'Hier 18:40', abonnementsType: 'Premium Famille'
    },
    {
      id: 'PAR-8823', nomFamille: 'Diarra', tuteur: 'Oumar Diarra',
      email: 'o.diarra@sotelma.ml', telephone: '+223 75 45 89 20',
      etablissement: 'Complexe Scolaire La Renaissance', enfantsRattaches: 3,
      statut: 'Actif', derniereActivite: 'Il y a 3 jours', abonnementsType: 'Premium Établissement'
    },
    {
      id: 'PAR-8824', nomFamille: 'Keita', tuteur: 'Mariam Keita',
      email: 'mariam.k@malitel.ml', telephone: '+223 60 11 22 33',
      etablissement: 'Lycée Technique Alternia Bamako', enfantsRattaches: 1,
      statut: 'Inactif', derniereActivite: 'Il y a 14 jours', abonnementsType: 'Accès Général (Inclus Boîtier)'
    },
    {
      id: 'PAR-8825', nomFamille: 'Koné', tuteur: 'Ibrahim Koné',
      email: 'ibrahim.kone@yahoo.fr', telephone: '+223 78 56 12 90',
      etablissement: 'École Pilote InnovEd Koulikoro', enfantsRattaches: 1,
      statut: 'Suspendu', derniereActivite: 'Il y a 1 mois', abonnementsType: 'Premium Famille'
    },
    {
      id: 'PAR-8826', nomFamille: 'Cissé', tuteur: 'Awa Cissé',
      email: 'awa.cisse@afribone.net.ml', telephone: '+223 79 33 44 55',
      etablissement: 'Académie Régionale de Kayes', enfantsRattaches: 2,
      statut: 'Actif', derniereActivite: 'Aujourd\'hui 07:30', abonnementsType: 'Premium Établissement'
    }
  ];

  recupererTous(): Observable<ParentDTO[]> {
    return of([...this.donneesLocales]);
  }

  creer(nouveau: Omit<ParentDTO, 'id' | 'derniereActivite'>): Observable<ParentDTO> {
    const parent: ParentDTO = {
      ...nouveau,
      id: `PAR-${Math.floor(1000 + Math.random() * 9000)}`,
      derniereActivite: 'À l\'instant'
    };
    this.donneesLocales = [parent, ...this.donneesLocales];
    return of(parent);
  }

  changerStatut(id: string): Observable<ParentDTO | null> {
    const item = this.donneesLocales.find(p => p.id === id);
    if (item) {
      item.statut = item.statut === 'Actif' ? 'Suspendu' : 'Actif';
      return of({ ...item });
    }
    return of(null);
  }

  supprimer(id: string): Observable<boolean> {
    this.donneesLocales = this.donneesLocales.filter(p => p.id !== id);
    return of(true);
  }
}
