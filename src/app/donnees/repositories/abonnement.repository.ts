import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  private donneesLocales: AbonnementDTO[] = [
    {
      id: 'ABO-2024-001', parentNom: 'Amadou Traoré (Famille Traoré)', parentEmail: 'amadou.traore@gmail.com',
      type: 'Premium Famille', montant: 45000, dateDebut: '15/01/2024',
      dateRenouvellement: '15/01/2025', statut: 'Actif', autoRenouvellement: true
    },
    {
      id: 'ABO-2024-002', parentNom: 'Fatoumata Coulibaly', parentEmail: 'fatou.coulibaly@orange.ml',
      type: 'Premium Famille', montant: 5000, dateDebut: '01/02/2024',
      dateRenouvellement: '01/03/2025', statut: 'Actif', autoRenouvellement: true
    },
    {
      id: 'ABO-2024-003', parentNom: 'Lycée Excellence Saint-Louis', parentEmail: 'direction@saintlouis-bamako.edu.ml',
      type: 'Premium Établissement', montant: 350000, dateDebut: '10/11/2023',
      dateRenouvellement: '10/11/2024', statut: 'Actif', autoRenouvellement: true
    },
    {
      id: 'ABO-2024-004', parentNom: 'Mariam Keita (Boîtier Standalone)', parentEmail: 'mariam.k@malitel.ml',
      type: 'Accès Général (Inclus Boîtier)', montant: 0, dateDebut: '05/05/2024',
      dateRenouvellement: 'À vie (Matériel)', statut: 'Actif', autoRenouvellement: false
    },
    {
      id: 'ABO-2024-005', parentNom: 'Ibrahim Koné', parentEmail: 'ibrahim.kone@yahoo.fr',
      type: 'Premium Famille', montant: 5000, dateDebut: '20/03/2024',
      dateRenouvellement: '20/04/2024', statut: 'Suspendu', autoRenouvellement: false
    },
    {
      id: 'ABO-2024-006', parentNom: 'Collège International Marie Curie', parentEmail: 'admin@curie-ecole.org',
      type: 'Premium Établissement', montant: 250000, dateDebut: '01/09/2024',
      dateRenouvellement: '01/09/2025', statut: 'Actif', autoRenouvellement: true
    }
  ];

  recupererTous(): Observable<AbonnementDTO[]> {
    return of([...this.donneesLocales]);
  }

  creer(nouveau: Omit<AbonnementDTO, 'id' | 'dateDebut'>): Observable<AbonnementDTO> {
    const abonnement: AbonnementDTO = {
      ...nouveau,
      id: `ABO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      dateDebut: new Date().toLocaleDateString('fr-FR')
    };
    this.donneesLocales = [abonnement, ...this.donneesLocales];
    return of(abonnement);
  }

  changerStatut(id: string, statut: 'Actif' | 'Résilié' | 'En attente de paiement' | 'Suspendu'): Observable<AbonnementDTO | null> {
    const item = this.donneesLocales.find(a => a.id === id);
    if (item) {
      item.statut = statut;
      return of({ ...item });
    }
    return of(null);
  }

  supprimer(id: string): Observable<boolean> {
    this.donneesLocales = this.donneesLocales.filter(a => a.id !== id);
    return of(true);
  }
}
