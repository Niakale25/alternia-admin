import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';

export interface AbonnementDTO {
  id: string;
  parentNom: string;
  parentEmail: string;
  type: 'Premium Annuel' | 'Standard Mensuel' | 'Découverte';
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
      id: 'ABO-2024-001', parentNom: 'Amadou Traoré', parentEmail: 'amadou.traore@gmail.com',
      type: 'Premium Annuel', montant: 45000, dateDebut: '15/01/2024',
      dateRenouvellement: '15/01/2025', statut: 'Actif', autoRenouvellement: true
    },
    {
      id: 'ABO-2024-002', parentNom: 'Fatoumata Coulibaly', parentEmail: 'fatou.coulibaly@orange.ml',
      type: 'Standard Mensuel', montant: 5000, dateDebut: '01/02/2024',
      dateRenouvellement: '01/03/2025', statut: 'Actif', autoRenouvellement: true
    },
    {
      id: 'ABO-2024-003', parentNom: 'Oumar Diarra', parentEmail: 'o.diarra@sotelma.ml',
      type: 'Premium Annuel', montant: 45000, dateDebut: '10/11/2023',
      dateRenouvellement: '10/11/2024', statut: 'En attente de paiement', autoRenouvellement: false
    },
    {
      id: 'ABO-2024-004', parentNom: 'Mariam Keita', parentEmail: 'mariam.k@malitel.ml',
      type: 'Découverte', montant: 0, dateDebut: '05/05/2024',
      dateRenouvellement: '05/06/2024', statut: 'Résilié', autoRenouvellement: false
    },
    {
      id: 'ABO-2024-005', parentNom: 'Ibrahim Koné', parentEmail: 'ibrahim.kone@yahoo.fr',
      type: 'Standard Mensuel', montant: 5000, dateDebut: '20/03/2024',
      dateRenouvellement: '20/04/2024', statut: 'Suspendu', autoRenouvellement: false
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
