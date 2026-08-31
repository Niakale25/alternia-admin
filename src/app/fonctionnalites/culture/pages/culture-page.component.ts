import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CultureService } from '../services/culture.service';
import {
  ContenuCulturelDTO,
  RegionCode,
  TypeContenuCulturel
} from '../modeles/culture.modele';
import { CarteCultureComponent } from '../composants/carte-culture/carte-culture.component';
import { TableauCultureComponent } from '../composants/tableau-culture/tableau-culture.component';
import { TiroirDetailCultureComponent } from '../composants/tiroir-detail-culture/tiroir-detail-culture.component';
import { ModalFormulaireCultureComponent } from '../composants/modal-formulaire-culture/modal-formulaire-culture.component';
import { ModalSuppressionCultureComponent } from '../composants/modal-suppression-culture/modal-suppression-culture.component';
import { EtatVideComponent } from '@partage/composants/etat-vide/etat-vide.component';

@Component({
  selector: 'app-culture-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CarteCultureComponent,
    TableauCultureComponent,
    TiroirDetailCultureComponent,
    ModalFormulaireCultureComponent,
    ModalSuppressionCultureComponent,
    EtatVideComponent
  ],
  templateUrl: './culture-page.component.html',
  styleUrls: ['./culture-page.component.scss']
})
export class CulturePageComponent {
  readonly service = inject(CultureService);

  // Mode d'affichage
  readonly modeAffichage = signal<'cartes' | 'tableau'>('cartes');

  // Modales
  readonly modalFormulaireOuvert = signal<boolean>(false);
  readonly elementEnEdition = signal<ContenuCulturelDTO | null>(null);
  readonly typeNouveauContenu = signal<TypeContenuCulturel>('figure');

  readonly elementASupprimer = signal<ContenuCulturelDTO | null>(null);

  // Onglets par type de contenu (Sans emojis)
  readonly ongletsTypes: { type: TypeContenuCulturel | 'tous'; label: string }[] = [
    { type: 'tous', label: 'Tous les contenus' },
    { type: 'figure', label: 'Figures Historiques' },
    { type: 'monument', label: 'Monuments' },
    { type: 'ville', label: 'Cités & Villes' },
    { type: 'conte', label: 'Contes Interactifs' },
    { type: 'devinette', label: 'Devinettes Traditionnelles' },
    { type: 'quiz', label: 'Quiz Culturels' },
    { type: 'temoignage', label: 'Récits & Mémoires' }
  ];

  changerMode(mode: 'cartes' | 'tableau'): void {
    this.modeAffichage.set(mode);
  }

  filtrerParType(type: TypeContenuCulturel | 'tous'): void {
    this.service.filtreType.set(type);
  }

  filtrerParRegion(regionId: RegionCode): void {
    this.service.filtreRegion.set(regionId);
  }

  ouvrirModalCreation(type: TypeContenuCulturel = 'figure'): void {
    this.elementEnEdition.set(null);
    this.typeNouveauContenu.set(type);
    this.modalFormulaireOuvert.set(true);
  }

  ouvrirModalEdition(item: ContenuCulturelDTO): void {
    this.elementEnEdition.set(item);
    this.typeNouveauContenu.set(item.type);
    this.modalFormulaireOuvert.set(true);
  }

  fermerModalFormulaire(): void {
    this.modalFormulaireOuvert.set(false);
    this.elementEnEdition.set(null);
  }

  sauvegarderContenu(donnees: ContenuCulturelDTO): void {
    if (this.elementEnEdition()) {
      this.service.mettreAJourContenu(donnees);
    } else {
      this.service.ajouterContenu(donnees);
    }
    this.fermerModalFormulaire();
  }

  demanderSuppression(item: ContenuCulturelDTO): void {
    this.elementASupprimer.set(item);
  }

  confirmerSuppression(id: string): void {
    this.service.supprimerContenu(id);
    this.elementASupprimer.set(null);
  }

  annulerSuppression(): void {
    this.elementASupprimer.set(null);
  }

  ouvrirDetail(item: ContenuCulturelDTO): void {
    this.service.ouvrirDetail(item);
  }

  fermerDetail(): void {
    this.service.fermerDetail();
  }

  getRegionColor(regionId: RegionCode): string {
    const reg = this.service.getRegionInfo(regionId);
    return reg ? reg.couleur : 'var(--c-brand)';
  }
}
