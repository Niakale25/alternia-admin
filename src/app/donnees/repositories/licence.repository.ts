import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';

export interface LicenceDTO {
  id: string;
  code: string;
  type: 'Établissement Bulk' | 'Parent Solo' | 'Institutionnel Pack';
  titulaire: string;
  dateActivation: string;
  dateExpiration: string;
  statut: 'Active' | 'Expirée' | 'En attente' | 'Renouvelée';
  prix: number;
  dureeMois: number;
}

@Injectable({
  providedIn: 'root'
})
export class LicenceRepository {
  private readonly clientApi = inject(ClientApiService);
  private readonly endpoint = '/licences';

  private donneesLocales: LicenceDTO[] = [
    {
      id: 'LIC-2024-001', code: 'ALT-BK-2024-8841-A',
      type: 'Établissement Bulk', titulaire: 'Lycée Excellence Saint-Louis (Bamako)',
      dateActivation: '15/01/2024', dateExpiration: '15/01/2027',
      statut: 'Active', prix: 18000000, dureeMois: 36
    },
    {
      id: 'LIC-2024-002', code: 'ALT-SL-2024-1190-B',
      type: 'Parent Solo', titulaire: 'Amadou Traoré (Famille Traoré)',
      dateActivation: '01/02/2024', dateExpiration: '01/02/2025',
      statut: 'Active', prix: 45000, dureeMois: 12
    },
    {
      id: 'LIC-2024-003', code: 'ALT-IN-2023-7740-C',
      type: 'Institutionnel Pack', titulaire: 'Ministère Éducation Régionale Sikasso',
      dateActivation: '10/11/2023', dateExpiration: '10/11/2026',
      statut: 'Active', prix: 45000000, dureeMois: 36
    },
    {
      id: 'LIC-2024-004', code: 'ALT-BK-2023-0012-D',
      type: 'Établissement Bulk', titulaire: 'Collège International Marie Curie',
      dateActivation: '05/01/2023', dateExpiration: '05/01/2024',
      statut: 'Expirée', prix: 12000000, dureeMois: 12
    },
    {
      id: 'LIC-2024-005', code: 'ALT-SL-2024-3321-E',
      type: 'Parent Solo', titulaire: 'Fatoumata Coulibaly',
      dateActivation: '20/03/2024', dateExpiration: '20/03/2025',
      statut: 'Active', prix: 45000, dureeMois: 12
    },
    {
      id: 'LIC-2024-006', code: 'ALT-BK-2024-9988-F',
      type: 'Établissement Bulk', titulaire: 'École Pilote InnovEd Koulikoro',
      dateActivation: '15/06/2026', dateExpiration: '15/06/2027',
      statut: 'En attente', prix: 8500000, dureeMois: 12
    }
  ];

  recupererTous(): Observable<LicenceDTO[]> {
    return of([...this.donneesLocales]);
  }

  creer(nouveau: Omit<LicenceDTO, 'id' | 'code' | 'dateActivation'>): Observable<LicenceDTO> {
    const licence: LicenceDTO = {
      ...nouveau,
      id: `LIC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      code: `ALT-GEN-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      dateActivation: new Date().toLocaleDateString('fr-FR')
    };
    this.donneesLocales = [licence, ...this.donneesLocales];
    return of(licence);
  }

  changerStatut(id: string, statut: 'Active' | 'Expirée' | 'En attente' | 'Renouvelée'): Observable<LicenceDTO | null> {
    const item = this.donneesLocales.find(l => l.id === id);
    if (item) {
      item.statut = statut;
      return of({ ...item });
    }
    return of(null);
  }

  supprimer(id: string): Observable<boolean> {
    this.donneesLocales = this.donneesLocales.filter(l => l.id !== id);
    return of(true);
  }
}
