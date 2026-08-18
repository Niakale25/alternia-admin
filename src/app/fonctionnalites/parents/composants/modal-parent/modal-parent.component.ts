import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FenetreModaleComponent } from '@partage/composants/fenetre-modale/fenetre-modale.component';
import { ParentDTO } from '../../modeles/parent.model';

@Component({
  selector: 'app-modal-parent',
  standalone: true,
  imports: [CommonModule, FormsModule, FenetreModaleComponent],
  templateUrl: './modal-parent.component.html',
  styleUrls: ['./modal-parent.component.scss']
})
export class ModalParentComponent {
  @Input() ouvert: boolean = false;
  @Output() fermer = new EventEmitter<void>();
  @Output() soumettre = new EventEmitter<Omit<ParentDTO, 'id' | 'derniereActivite'>>();

  nomFamille: string = '';
  tuteur: string = '';
  email: string = '';
  telephone: string = '';
  etablissement: string = 'Lycée Excellence Saint-Louis';
  abonnementsType: 'Premium Annuel' | 'Standard Mensuel' | 'Découverte' = 'Premium Annuel';
  licencesAssocies: number = 1;

  valider(): void {
    if (!this.nomFamille.trim() || !this.email.trim()) return;

    this.soumettre.emit({
      nomFamille: this.nomFamille,
      tuteur: this.tuteur || this.nomFamille,
      email: this.email,
      telephone: this.telephone || '+223 -- -- -- --',
      etablissement: this.etablissement,
      abonnementsType: this.abonnementsType,
      licencesAssocies: this.licencesAssocies,
      statut: 'Actif'
    });

    this.reinitialiser();
  }

  reinitialiser(): void {
    this.nomFamille = '';
    this.tuteur = '';
    this.email = '';
    this.telephone = '';
    this.licencesAssocies = 1;
  }
}
