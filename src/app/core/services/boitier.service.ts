import { Injectable, signal, computed } from '@angular/core';
import { BoitierDTO } from '../models/admin-dto.model';

@Injectable({
  providedIn: 'root'
})
export class BoitierService {
  private readonly _boitiers = signal<BoitierDTO[]>([
    { id: 'BOX-9011', serialNumber: 'ALT-BOX-8849-X1', etablissementId: 'ETAB-101', etablissementNom: 'Lycée Excellence Saint-Louis', statut: 'Actif', versionFirmware: 'v3.2.1-prod', derniereConnexion: 'il y a 2 min', ville: 'Saint-Louis' },
    { id: 'BOX-9012', serialNumber: 'ALT-BOX-8850-X1', etablissementId: 'ETAB-102', etablissementNom: 'Collège International Marie Curie', statut: 'Actif', versionFirmware: 'v3.2.1-prod', derniereConnexion: 'il y a 5 min', ville: 'Dakar' },
    { id: 'BOX-9013', serialNumber: 'ALT-BOX-8851-X2', etablissementId: 'ETAB-103', etablissementNom: 'Complexe Scolaire La Renaissance', statut: 'Actif', versionFirmware: 'v3.2.0-ota', derniereConnexion: 'il y a 12 min', ville: 'Abidjan' },
    { id: 'BOX-9014', serialNumber: 'ALT-BOX-8852-X1', etablissementId: 'ETAB-104', etablissementNom: 'Lycée Technique Alternia', statut: 'Maintenance', versionFirmware: 'v3.1.8-legacy', derniereConnexion: 'il y a 4h', ville: 'Abidjan' },
    { id: 'BOX-9015', serialNumber: 'ALT-BOX-8853-X3', etablissementId: 'ETAB-105', etablissementNom: 'École Pilote InnovEd', statut: 'Hors ligne', versionFirmware: 'v3.2.1-prod', derniereConnexion: 'il y a 2 jours', ville: 'Dakar' },
    { id: 'BOX-9016', serialNumber: 'ALT-BOX-8854-X1', etablissementId: 'ETAB-106', etablissementNom: 'Académie Royale', statut: 'Actif', versionFirmware: 'v3.2.1-prod', derniereConnexion: 'il y a 1 min', ville: 'Rabat' },
    { id: 'BOX-9017', serialNumber: 'ALT-BOX-8855-X2', etablissementId: 'ETAB-107', etablissementNom: 'Institut Supérieur', statut: 'Actif', versionFirmware: 'v3.2.1-prod', derniereConnexion: 'il y a 8 min', ville: 'Yaoundé' },
    { id: 'BOX-9018', serialNumber: 'ALT-BOX-8856-X1', etablissementId: 'ETAB-106', etablissementNom: 'Lycée Victor Hugo', statut: 'Actif', versionFirmware: 'v3.2.1-prod', derniereConnexion: 'il y a 3 min', ville: 'Casablanca' },
  ]);

  readonly boitiers = computed(() => this._boitiers());

  readonly totalDeployedCount = computed(() => 12847);
  readonly onlineCount = computed(() => this._boitiers().filter(b => b.statut === 'Actif').length + 11197);
  readonly offlineCount = computed(() => 1044);
  readonly maintenanceCount = computed(() => 600);

  updateStatus(id: string, newStatus: BoitierDTO['statut']) {
    this._boitiers.update(items => items.map(b => b.id === id ? { ...b, statut: newStatus } : b));
  }

  diagnostic(id: string): { success: boolean; detail: string } {
    return { success: true, detail: 'Boîtier synchronisé et prêt pour la classe.' };
  }
}
