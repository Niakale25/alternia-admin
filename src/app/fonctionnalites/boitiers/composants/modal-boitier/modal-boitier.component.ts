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
  @Output() soumettre = new EventEmitter<Omit<BoitierDTO, 'id' | 'derniereConnexion'>>();

  serialNumber: string = '';
  etablissementNom: string = 'Lycée Excellence Saint-Louis';
  etablissementId: string = 'ETAB-101';
  ville: string = 'Bamako';
  versionFirmware: string = 'v3.4.2-LTS';
  statut: 'Actif' | 'Hors ligne' | 'Maintenance' = 'Actif';

  valider(): void {
    if (!this.serialNumber.trim()) return;

    this.soumettre.emit({
      serialNumber: this.serialNumber,
      etablissementNom: this.etablissementNom,
      etablissementId: this.etablissementId,
      ville: this.ville,
      versionFirmware: this.versionFirmware,
      statut: this.statut
    });

    this.reinitialiser();
  }

  reinitialiser(): void {
    this.serialNumber = '';
    this.versionFirmware = 'v3.4.2-LTS';
  }
}
