import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FenetreModaleComponent } from '@partage/composants/fenetre-modale/fenetre-modale.component';
import { BoitierDTO } from '../../modeles/boitier.model';

@Component({
  selector: 'app-modal-boitier',
  standalone: true,
  imports: [CommonModule, FormsModule, FenetreModaleComponent],
  templateUrl: './modal-boitier.component.html',
  styleUrls: ['./modal-boitier.component.scss']
})
export class ModalBoitierComponent {
  @Input() ouvert: boolean = false;
  @Output() fermer = new EventEmitter<void>();
  @Output() soumettre = new EventEmitter<Omit<BoitierDTO, 'id' | 'derniereConnexion' | 'batterie' | 'stockageUtiliseGo' | 'elevesConnectes' | 'temperatureCpu'>>();

  serialNumber: string = '';
  modele: string = 'AlternIA Box v2.0 Pro';
  etablissementNom: string = 'Lycée Excellence Saint-Louis';
  etablissementId: string = 'ETAB-101';
  ville: string = 'Bamako';
  region: string = 'Bamako';
  versionFirmware: string = 'v2.4.1-LTS';
  statut: BoitierDTO['statut'] = 'Actif';
  stockageGo: number = 64;
  ipLocale: string = '192.168.4.1';
  wifiSsid: string = 'AlternIA-Box-WiFi';
  modeFonctionnement: BoitierDTO['modeFonctionnement'] = 'Point d\'Accès Local';
  packDonneesInstalle: string = 'Curriculum 10e-12e Mali + Pack Culture Complet';

  valider(): void {
    if (!this.serialNumber.trim()) return;

    this.soumettre.emit({
      serialNumber: this.serialNumber,
      modele: this.modele,
      etablissementNom: this.etablissementNom,
      etablissementId: this.etablissementId,
      ville: this.ville,
      region: this.region,
      versionFirmware: this.versionFirmware,
      statut: this.statut,
      stockageGo: this.stockageGo,
      ipLocale: this.ipLocale,
      wifiSsid: this.wifiSsid || `AlternIA-${this.serialNumber}`,
      modeFonctionnement: this.modeFonctionnement,
      packDonneesInstalle: this.packDonneesInstalle
    });

    this.reinitialiser();
  }

  reinitialiser(): void {
    this.serialNumber = '';
    this.versionFirmware = 'v2.4.1-LTS';
  }
}
