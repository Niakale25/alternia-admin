import { Injectable, signal, computed } from '@angular/core';
import { BoitierDTO } from '../models/admin-dto.model';

@Injectable({
  providedIn: 'root'
})
export class BoitierService {
  private readonly _boitiers = signal<BoitierDTO[]>([
    { id: 'BOX-9011', serialNumber: 'ALT-BOX-8849-X1', etablissementId: 'ETAB-101', etablissementNom: 'Lycée Excellence Saint-Louis', status: 'En ligne', firmwareVersion: 'v3.2.1-prod', batteryLevel: 94, lastSync: 'il y a 2 min', ipAddress: '192.168.10.45', operatingMode: 'Classe Connectée', storageUsedPercent: 42, hardwareRevision: 'Rev 4.1', cpuTemperature: 38.5 },
    { id: 'BOX-9012', serialNumber: 'ALT-BOX-8850-X1', etablissementId: 'ETAB-102', etablissementNom: 'Collège International Marie Curie', status: 'En ligne', firmwareVersion: 'v3.2.1-prod', batteryLevel: 88, lastSync: 'il y a 5 min', ipAddress: '192.168.12.102', operatingMode: 'Autonome', storageUsedPercent: 65, hardwareRevision: 'Rev 4.1', cpuTemperature: 41.2 },
    { id: 'BOX-9013', serialNumber: 'ALT-BOX-8851-X2', etablissementId: 'ETAB-103', etablissementNom: 'Complexe Scolaire La Renaissance', status: 'Synchronisation', firmwareVersion: 'v3.2.0-ota', batteryLevel: 72, lastSync: 'En cours', ipAddress: '10.0.4.19', operatingMode: 'Mise à jour', storageUsedPercent: 88, hardwareRevision: 'Rev 4.0', cpuTemperature: 44.0 },
    { id: 'BOX-9014', serialNumber: 'ALT-BOX-8852-X1', etablissementId: 'ETAB-104', etablissementNom: 'Lycée Technique Alternia Abidjan', status: 'Maintenance', firmwareVersion: 'v3.1.8-legacy', batteryLevel: 14, lastSync: 'il y a 4h', ipAddress: '192.168.1.88', operatingMode: 'Autonome', storageUsedPercent: 95, hardwareRevision: 'Rev 3.8', cpuTemperature: 49.8 },
    { id: 'BOX-9015', serialNumber: 'ALT-BOX-8853-X3', etablissementId: 'ETAB-105', etablissementNom: 'École Pilote InnovEd Dakar', status: 'Hors ligne', firmwareVersion: 'v3.2.1-prod', batteryLevel: 0, lastSync: 'il y a 2 jours', ipAddress: '10.200.1.5', operatingMode: 'Autonome', storageUsedPercent: 30, hardwareRevision: 'Rev 4.1', cpuTemperature: 22.0 },
    { id: 'BOX-9016', serialNumber: 'ALT-BOX-8854-X1', etablissementId: 'ETAB-106', etablissementNom: 'Académie Royale de Rabat', status: 'En ligne', firmwareVersion: 'v3.2.1-prod', batteryLevel: 100, lastSync: 'il y a 1 min', ipAddress: '172.16.0.44', operatingMode: 'Examen', storageUsedPercent: 12, hardwareRevision: 'Rev 4.2', cpuTemperature: 36.1 },
    { id: 'BOX-9017', serialNumber: 'ALT-BOX-8855-X2', etablissementId: 'ETAB-107', etablissementNom: 'Institut Supérieur Yaoundé', status: 'En ligne', firmwareVersion: 'v3.2.1-prod', batteryLevel: 79, lastSync: 'il y a 8 min', ipAddress: '192.168.20.12', operatingMode: 'Classe Connectée', storageUsedPercent: 54, hardwareRevision: 'Rev 4.1', cpuTemperature: 39.4 },
    { id: 'BOX-9018', serialNumber: 'ALT-BOX-8856-X1', etablissementId: 'ETAB-106', etablissementNom: 'Lycée Victor Hugo Casablanca', status: 'En ligne', firmwareVersion: 'v3.2.1-prod', batteryLevel: 91, lastSync: 'il y a 3 min', ipAddress: '10.1.1.20', operatingMode: 'Classe Connectée', storageUsedPercent: 39, hardwareRevision: 'Rev 4.2', cpuTemperature: 37.8 },
  ]);

  readonly boitiers = computed(() => this._boitiers());

  readonly totalDeployedCount = computed(() => 12847);
  readonly onlineCount = computed(() => this._boitiers().filter(b => b.status === 'En ligne').length + 11197);
  readonly syncingCount = computed(() => 542);
  readonly maintenanceCount = computed(() => 210);

  updateStatus(id: string, newStatus: BoitierDTO['status']) {
    this._boitiers.update(items => items.map(b => b.id === id ? { ...b, status: newStatus } : b));
  }

  pingBoitier(id: string): { success: boolean; latencyMs: number } {
    return { success: true, latencyMs: Math.floor(Math.random() * 25) + 10 };
  }
}
