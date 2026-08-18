import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FenetreModaleComponent } from '@partage/composants/fenetre-modale/fenetre-modale.component';
import { LicenceDTO } from '../../modeles/licence.model';

@Component({
  selector: 'app-modal-licence',
  standalone: true,
  imports: [CommonModule, FormsModule, FenetreModaleComponent],
  templateUrl: './modal-licence.component.html',
  styleUrls: ['./modal-licence.component.scss']
})
export class ModalLicenceComponent {
  @Input() ouvert: boolean = false;
  @Output() fermer = new EventEmitter<void>();
  @Output() soumettre = new EventEmitter<Omit<LicenceDTO, 'id' | 'code' | 'dateActivation'>>();

  titulaire: string = '';
  type: 'Établissement Bulk' | 'Parent Solo' | 'Institutionnel Pack' = 'Établissement Bulk';
  dureeMois: number = 12;
  prix: number = 18000000;
  dateExpiration: string = '15/01/2026';
  statut: 'Active' | 'Expirée' | 'En attente' | 'Renouvelée' = 'Active';

  valider(): void {
    if (!this.titulaire.trim()) return;

    this.soumettre.emit({
      titulaire: this.titulaire,
      type: this.type,
      dureeMois: this.dureeMois,
      prix: this.prix,
      dateExpiration: this.dateExpiration,
      statut: this.statut
    });

    this.reinitialiser();
  }

  reinitialiser(): void {
    this.titulaire = '';
    this.prix = 18000000;
  }
}
