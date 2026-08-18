import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FenetreModaleComponent } from '@partage/composants/fenetre-modale/fenetre-modale.component';
import { AbonnementDTO } from '../../modeles/abonnement.model';

@Component({
  selector: 'app-modal-abonnement',
  standalone: true,
  imports: [CommonModule, FormsModule, FenetreModaleComponent],
  templateUrl: './modal-abonnement.component.html',
  styleUrls: ['./modal-abonnement.component.scss']
})
export class ModalAbonnementComponent {
  @Input() ouvert: boolean = false;
  @Output() fermer = new EventEmitter<void>();
  @Output() soumettre = new EventEmitter<Omit<AbonnementDTO, 'id' | 'dateDebut'>>();

  parentNom: string = '';
  parentEmail: string = '';
  type: 'Premium Annuel' | 'Standard Mensuel' | 'Découverte' = 'Premium Annuel';
  montant: number = 45000;
  dateRenouvellement: string = '15/01/2026';
  statut: 'Actif' | 'Résilié' | 'En attente de paiement' | 'Suspendu' = 'Actif';
  autoRenouvellement: boolean = true;

  onTypeChange(type: 'Premium Annuel' | 'Standard Mensuel' | 'Découverte'): void {
    this.type = type;
    if (type === 'Premium Annuel') this.montant = 45000;
    else if (type === 'Standard Mensuel') this.montant = 5000;
    else this.montant = 0;
  }

  valider(): void {
    if (!this.parentNom.trim() || !this.parentEmail.trim()) return;

    this.soumettre.emit({
      parentNom: this.parentNom,
      parentEmail: this.parentEmail,
      type: this.type,
      montant: this.montant,
      dateRenouvellement: this.dateRenouvellement,
      statut: this.statut,
      autoRenouvellement: this.autoRenouvellement
    });

    this.reinitialiser();
  }

  reinitialiser(): void {
    this.parentNom = '';
    this.parentEmail = '';
    this.montant = 45000;
  }
}
