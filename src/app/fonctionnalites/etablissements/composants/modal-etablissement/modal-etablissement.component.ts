import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FenetreModaleComponent } from '@partage/composants/fenetre-modale/fenetre-modale.component';
import { EtablissementDTO } from '../../modeles/etablissement.model';

@Component({
  selector: 'app-modal-etablissement',
  standalone: true,
  imports: [CommonModule, FormsModule, FenetreModaleComponent],
  templateUrl: './modal-etablissement.component.html',
  styleUrls: ['./modal-etablissement.component.scss']
})
export class ModalEtablissementComponent {
  @Input() ouvert: boolean = false;
  @Output() fermer = new EventEmitter<void>();
  @Output() soumettre = new EventEmitter<Omit<EtablissementDTO, 'id' | 'dateInscription'>>();

  nouveauNom: string = '';
  nouvelleVille: string = 'Bamako';
  nouvelleRegion: string = 'District de Bamako';
  nouveauDirecteurEmail: string = '';
  nouvelleOffre: 'Enterprise' | 'Institutionnel' | 'Standard' = 'Standard';
  nouveauxBoitiersCount: number = 10;
  nouvellesLicencesCount: number = 500;

  validerFormulaire(): void {
    if (!this.nouveauNom.trim()) return;

    this.soumettre.emit({
      nom: this.nouveauNom,
      ville: this.nouvelleVille,
      region: this.nouvelleRegion,
      directeurEmail: this.nouveauDirecteurEmail || 'direction@etablissement.ml',
      offre: this.nouvelleOffre,
      boitiersCount: this.nouveauxBoitiersCount,
      profilsCount: Math.round(this.nouveauxBoitiersCount * 0.7),
      licencesCount: this.nouvellesLicencesCount,
      statut: 'Actif'
    });

    this.reinitialiser();
  }

  reinitialiser(): void {
    this.nouveauNom = '';
    this.nouveauDirecteurEmail = '';
    this.nouveauxBoitiersCount = 10;
    this.nouvellesLicencesCount = 500;
  }
}
