import { Injectable, signal, computed } from '@angular/core';
import { LicenceDTO } from '../models/admin-dto.model';

@Injectable({
  providedIn: 'root'
})
export class LicenceService {
  private readonly _licences = signal<LicenceDTO[]>([
    { id: 'LIC-9901', code: 'ALT-2026-BULK-9901-X', type: 'Établissement Bulk', titulaire: 'Lycée Excellence Saint-Louis', dateActivation: '14/01/2024', dateExpiration: '14/01/2027', statut: 'Active', prixAnnuel: 14400, dureeMois: 36 },
    { id: 'LIC-9902', code: 'ALT-2026-BULK-9902-X', type: 'Établissement Bulk', titulaire: 'Collège International Marie Curie', dateActivation: '02/03/2024', dateExpiration: '02/03/2027', statut: 'Active', prixAnnuel: 10200, dureeMois: 36 },
    { id: 'LIC-9903', code: 'ALT-2026-PACK-7710-P', type: 'Institutionnel Pack', titulaire: 'Ministère de l\'Éducation CI', dateActivation: '01/09/2025', dateExpiration: '01/09/2026', statut: 'Renouvelée', prixAnnuel: 45000, dureeMois: 12 },
    { id: 'LIC-9904', code: 'ALT-2026-SOLO-1092-F', type: 'Parent Solo', titulaire: 'Famille Kouassi', dateActivation: '10/10/2025', dateExpiration: '10/10/2026', statut: 'Active', prixAnnuel: 120, dureeMois: 12 },
    { id: 'LIC-9905', code: 'ALT-2025-SOLO-0044-F', type: 'Parent Solo', titulaire: 'Famille Ndao', dateActivation: '05/05/2025', dateExpiration: '05/05/2026', statut: 'Expirée', prixAnnuel: 120, dureeMois: 12 },
  ]);

  readonly licences = computed(() => this._licences());
  readonly mrrAmountEur = computed(() => 186540);
  readonly arrAmountEur = computed(() => 2238480);
  readonly activeLicencesCount = computed(() => 52104);
  readonly expiringIn30DaysCount = computed(() => 3892);
}
