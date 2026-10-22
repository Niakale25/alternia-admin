import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CultureService } from '../services/culture.service';
import {
  ContenuCulturelDTO,
  CultureContributionDTO,
  RegionCode,
  TypeContenuCulturel
} from '../modeles/culture.modele';
import { CarteCultureComponent } from '../composants/carte-culture/carte-culture.component';
import { TableauCultureComponent } from '../composants/tableau-culture/tableau-culture.component';
import { TiroirDetailCultureComponent } from '../composants/tiroir-detail-culture/tiroir-detail-culture.component';
import { ModalFormulaireCultureComponent } from '../composants/modal-formulaire-culture/modal-formulaire-culture.component';
import { ModalSuppressionCultureComponent } from '../composants/modal-suppression-culture/modal-suppression-culture.component';
import { EtatVideComponent } from '@partage/composants/etat-vide/etat-vide.component';
import { CarteStatistiqueComponent } from '@partage/composants/carte-statistique/carte-statistique.component';
import { ExportService } from '@partage/services/export.service';
import { NotificationService } from '@partage/services/notification.service';
import { PasseportCulturelComponent } from '../composants/passeport-culturel/passeport-culturel.component';

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
    EtatVideComponent,
    CarteStatistiqueComponent,
    PasseportCulturelComponent
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

  private readonly exportService = inject(ExportService);
  private readonly notificationService = inject(NotificationService);

  exporterCatalogueCsv(): void {
    let donnees = this.service.contenusFiltres();
    if (!donnees || donnees.length === 0) {
      donnees = this.service.contenus();
    }
    if (!donnees || donnees.length === 0) {
      this.notificationService.avertissement('Aucun contenu culturel disponible dans le catalogue à exporter.');
      return;
    }

    this.exportService.exporterCsv(
      [
        { cle: 'id', entete: 'Identifiant' },
        { cle: 'type', entete: 'Type de Contenu' },
        { cle: 'titre', entete: 'Titre / Nom', formater: (val, item: any) => item.titre || item.nom || item.question || item.enigmeTexte || val },
        { cle: 'sousTitre', entete: 'Sous-Titre / Épithète', formater: (val, item: any) => item.sousTitre || item.titreHonorifique || val || '' },
        { cle: 'regionNom', entete: 'Région / Territoire' },
        { cle: 'tag', entete: 'Étiquette / Catégorie', formater: (val, item: any) => item.tag || item.categorie || val || '' },
        { cle: 'info', entete: 'Repère / Spécificité', formater: (val, item: any) => item.info || item.periode || item.ere || item.dureeAudio || val || '' },
        { cle: 'publie', entete: 'Statut', formater: (val) => val ? 'Publié' : 'Brouillon' }
      ],
      donnees,
      'catalogue_culture_mali'
    );
  }

  getRegionColor(regionId: RegionCode): string {
    const reg = this.service.getRegionInfo(regionId);
    return reg ? reg.couleur : 'var(--c-brand)';
  }

  // ── Modération des Contributions Citoyennes ──────────────────────
  readonly filtreStatutModeration = signal<'TOUS' | 'EN_ATTENTE' | 'APPROUVE' | 'REJETE'>('EN_ATTENTE');
  readonly filtreTypeModeration = signal<string>('TOUS');

  readonly contributionsFiltrees = computed(() => {
    let list = this.service.contributions();
    const stat = this.filtreStatutModeration();
    const type = this.filtreTypeModeration();
    if (stat !== 'TOUS') {
      list = list.filter(c => c.statut === stat);
    }
    if (type !== 'TOUS') {
      list = list.filter(c => (c.typeContenu || '').toLowerCase() === type.toLowerCase());
    }
    return list;
  });

  readonly contributionSelectionnee = signal<CultureContributionDTO | null>(null);
  readonly modalDecisionOuverte = signal<boolean>(false);
  readonly decisionModeration = signal<'APPROUVE' | 'REJETE'>('APPROUVE');
  readonly motifDecision = signal<string>('');

  ouvrirDecision(c: CultureContributionDTO, decision: 'APPROUVE' | 'REJETE'): void {
    this.contributionSelectionnee.set(c);
    this.decisionModeration.set(decision);
    this.motifDecision.set(
      decision === 'APPROUVE'
        ? 'Contribution certifiée conforme au patrimoine oral malien et promue dans le catalogue éditorial.'
        : 'Proposition incomplète ou non conforme aux critères du patrimoine.'
    );
    this.modalDecisionOuverte.set(true);
  }

  confirmerDecision(): void {
    const c = this.contributionSelectionnee();
    if (!c) return;

    const dec = this.decisionModeration();
    const motif = this.motifDecision();

    this.service.modererContribution(c.id, dec, motif);
    this.modalDecisionOuverte.set(false);
    this.contributionSelectionnee.set(null);

    if (dec === 'APPROUVE') {
      this.notificationService.succes(
        `Contribution validée avec succès ! ${c.piecesAttribuees} pièces et ${c.xpAttribues} XP ont été crédités à ${c.auteurNom}.`,
        'Contribution Approuvée'
      );
    } else {
      this.notificationService.avertissement(
        `Contribution refusée : ${motif}`,
        'Contribution Rejetée'
      );
    }
  }

  annulerDecision(): void {
    this.modalDecisionOuverte.set(false);
    this.contributionSelectionnee.set(null);
  }
}

