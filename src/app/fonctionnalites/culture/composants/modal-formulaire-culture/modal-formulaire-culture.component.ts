import { Component, Input, Output, EventEmitter, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ContenuCulturelDTO,
  FicheFigureHistoriqueDTO,
  FicheMonumentDTO,
  FicheVilleDTO,
  ConteInteractifDTO,
  DevinetteTraditionnelleDTO,
  QuizCulturelDTO,
  TemoignageOralDTO,
  TypeContenuCulturel,
  RegionCode,
  RegionMalienne,
  SceneConteDTO,
  ChoixSceneDTO,
  FaitHistorique,
  ChapitreEditorial
} from '../../modeles/culture.modele';
import { REGIONS_MALI } from '../../services/culture-donnees.mock';

export interface TypeDefinition {
  type: TypeContenuCulturel;
  label: string;
  description: string;
  badgeClass: string;
}

@Component({
  selector: 'app-modal-formulaire-culture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-formulaire-culture.component.html',
  styleUrls: ['./modal-formulaire-culture.component.scss']
})
export class ModalFormulaireCultureComponent implements OnInit {
  @Input() elementAEditer: ContenuCulturelDTO | null = null;
  @Input() typeParDefaut: TypeContenuCulturel = 'figure';

  @Output() fermer = new EventEmitter<void>();
  @Output() sauvegarder = new EventEmitter<ContenuCulturelDTO>();

  readonly regions: RegionMalienne[] = REGIONS_MALI;

  // Définition des 7 types de contenus culturels avec descriptions professionnelles
  readonly typesDisponibles: TypeDefinition[] = [
    {
      type: 'figure',
      label: 'Grande Figure',
      description: 'Souverains, héros, figures historiques et fondateurs.',
      badgeClass: 'badge--brand'
    },
    {
      type: 'monument',
      label: 'Monument',
      description: 'Édifices historiques, architectures soudano-sahéliennes et sites.',
      badgeClass: 'badge--info'
    },
    {
      type: 'ville',
      label: 'Cité & Village',
      description: 'Cités millénaires, carrefours culturels et villages réputés.',
      badgeClass: 'badge--warning'
    },
    {
      type: 'conte',
      label: 'Conte Interactif',
      description: 'Récits traditionnels par étapes avec choix narratifs et morales.',
      badgeClass: 'badge--accent'
    },
    {
      type: 'devinette',
      label: 'Devinette « N\'Da »',
      description: 'Énigmes ancestrales avec 3 indices progressifs et maximes.',
      badgeClass: 'badge--info'
    },
    {
      type: 'quiz',
      label: 'Quiz Culturel',
      description: 'Questions à choix multiples avec récompenses XP.',
      badgeClass: 'badge--success'
    },
    {
      type: 'temoignage',
      label: 'Récit & Mémoire',
      description: 'Paroles d\'anciens, maîtres artisans et dépositaires de savoirs.',
      badgeClass: 'badge--neutral'
    }
  ];

  // Étape du Studio (1: Type & Région, 2: Identité & Visuel, 3: Contenu Éducatif, 4: Approfondissement)
  readonly etapeCourante = signal<number>(1);

  // Champs de formulaire
  typeChoisi: TypeContenuCulturel = 'figure';
  regionId: RegionCode = 'koulikoro';
  publie: boolean = true;
  nomOuTitre: string = '';
  sousTitre: string = '';
  tag: string = '';
  photoUrl: string = '';
  photoCredits: string = '';
  resume: string = '';

  // Spécifique Figure
  periode: string = '';
  citationHistorique: string = '';

  // Spécifique Monument
  ere: string = '';
  localisationDetails: string = '';
  presentation: string = '';
  architectureEtMateriaux: string = '';
  pourquoiCestImportant: string = '';

  // Spécifique Ville
  fondation: string = '';
  identiteCulturelle: string = '';
  traditionsEtPatrimoine: string = '';

  // Spécifique Conte
  origineConte: string = 'Tradition Orale Mandingue';
  narrateur: string = 'Griot du Manden';
  dureeAudio: string = '5 min 00';
  dureeLecture: string = '4 min';
  morale: string = '';
  enVedette: boolean = false;
  scenes: SceneConteDTO[] = [];

  // Spécifique Devinette
  formuleIntro: string = 'N\'Da ! — N\'Da n\'sira !';
  enigmeTexte: string = '';
  indices: string[] = ['', '', ''];
  optionsDevinette: string[] = ['', '', '', ''];
  bonneReponseDevinette: string = '';
  explicationCulturelle: string = '';
  proverbe: string = '';
  difficulteDevinette: 'Initié' | 'Apprenti' | 'Maître Dozo' = 'Initié';
  xpDevinette: number = 50;

  // Spécifique Quiz
  questionQuiz: string = '';
  optionsQuiz: string[] = ['', '', '', ''];
  indexCorrectQuiz: number = 0;
  explicationQuiz: string = '';
  categorieQuiz: string = 'Histoire';
  xpQuiz: number = 30;

  // Spécifique Témoignage
  conteur: string = '';
  qualiteConteur: string = '';
  lieuConteur: string = '';
  titreHistoire: string = '';
  dureeTemoignage: string = '3 min 30';
  extraitTemoignage: string = '';
  epoqueOuAnnee: string = '';

  // Faits & Chapitres
  faitsCles: FaitHistorique[] = [];
  chapitres: ChapitreEditorial[] = [];

  // Informations sur la région sélectionnée
  readonly regionSelectionnee = computed(() => {
    return this.regions.find(r => r.id === this.regionId) || this.regions[0];
  });

  // Type actuellement sélectionné
  readonly typeSelectionne = computed(() => {
    return this.typesDisponibles.find(t => t.type === this.typeChoisi) || this.typesDisponibles[0];
  });

  ngOnInit(): void {
    if (this.elementAEditer) {
      this.initialiserPourEdition(this.elementAEditer);
      // En édition, aller directement à l'étape 2
      this.etapeCourante.set(2);
    } else {
      this.typeChoisi = this.typeParDefaut;
      this.initialiserPourCreation();
    }
  }

  private initialiserPourCreation(): void {
    this.regionId = 'koulikoro';
    this.publie = true;
    this.photoUrl = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&auto=format&fit=crop&q=60';
    this.indices = ['Premier indice subtil...', 'Deuxième indice d\'orientation...', 'Indice clé décisif...'];
    this.optionsDevinette = ['Option A', 'Option B', 'Option C', 'Option D'];
    this.bonneReponseDevinette = 'Option A';
    this.optionsQuiz = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
    this.scenes = [
      {
        id: `sc-1`,
        numeroScene: 1,
        titre: 'La Rencontre Initiale',
        texteNarratif: 'Sous l\'arbre à palabres, les aînés se réunissent au crépuscule...',
        atmosphere: 'Veillée sereine au son de la Kora',
        insightCulturel: 'Le respect des anciens est la clé de la sagesse.',
        estEpilogue: false,
        choix: [
          {
            id: 'ch-1',
            libelle: 'Écouter avec humilité',
            description: 'Tu prêtes l\'oreille aux récits d\'autrefois.',
            sceneSuivanteId: 'sc-2',
            traitSagesse: 'Voie de la Sagesse'
          }
        ]
      },
      {
        id: 'sc-2',
        numeroScene: 2,
        titre: 'La Transmission du Savoir',
        texteNarratif: 'L\'aîné te confie le proverbe protecteur qui guide les voyageurs.',
        estEpilogue: true,
        choix: []
      }
    ];
  }

  private initialiserPourEdition(item: ContenuCulturelDTO): void {
    this.typeChoisi = item.type;
    this.regionId = item.regionId;
    this.publie = item.publie;

    if ('nom' in item) this.nomOuTitre = item.nom;
    else if ('titre' in item) this.nomOuTitre = item.titre;
    else if ('question' in item) this.nomOuTitre = item.question;
    else if ('titreHistoire' in item) this.nomOuTitre = item.titreHistoire;

    if ('titreHonorifique' in item) this.sousTitre = item.titreHonorifique;
    else if ('sousTitre' in item) this.sousTitre = item.sousTitre;

    if ('tag' in item) this.tag = item.tag;
    if ('photoUrl' in item && item.photoUrl) this.photoUrl = item.photoUrl;
    if ('photoCredits' in item && item.photoCredits) this.photoCredits = item.photoCredits;
    if ('resume' in item) this.resume = item.resume;

    // Figure
    if (item.type === 'figure') {
      this.periode = item.periode;
      this.citationHistorique = item.citationHistorique || '';
      this.faitsCles = item.faitsCles ? [...item.faitsCles] : [];
      this.chapitres = item.chapitres ? [...item.chapitres] : [];
    }

    // Monument
    if (item.type === 'monument') {
      this.ere = item.ere;
      this.localisationDetails = item.localisationDetails;
      this.presentation = item.presentation;
      this.architectureEtMateriaux = item.architectureEtMateriaux;
      this.pourquoiCestImportant = item.pourquoiCestImportant;
      this.faitsCles = item.faitsCles ? [...item.faitsCles] : [];
      this.chapitres = item.chapitres ? [...item.chapitres] : [];
    }

    // Ville
    if (item.type === 'ville') {
      this.fondation = item.fondation;
      this.identiteCulturelle = item.identiteCulturelle;
      this.traditionsEtPatrimoine = item.traditionsEtPatrimoine;
      this.faitsCles = item.faitsCles ? [...item.faitsCles] : [];
      this.chapitres = item.chapitres ? [...item.chapitres] : [];
    }

    // Conte
    if (item.type === 'conte') {
      this.origineConte = item.origine;
      this.narrateur = item.narrateur;
      this.dureeAudio = item.dureeAudio;
      this.dureeLecture = item.dureeLecture;
      this.morale = item.morale;
      this.enVedette = item.enVedette;
      this.scenes = item.scenes ? JSON.parse(JSON.stringify(item.scenes)) : [];
    }

    // Devinette
    if (item.type === 'devinette') {
      this.formuleIntro = item.formuleIntro;
      this.enigmeTexte = item.enigmeTexte;
      this.indices = item.indices ? [...item.indices] : ['', '', ''];
      this.optionsDevinette = item.options ? [...item.options] : ['', '', '', ''];
      this.bonneReponseDevinette = item.bonneReponse;
      this.explicationCulturelle = item.explicationCulturelle;
      this.proverbe = item.proverbe || '';
      this.difficulteDevinette = item.difficulte;
      this.xpDevinette = item.recompenseXp;
    }

    // Quiz
    if (item.type === 'quiz') {
      this.questionQuiz = item.question;
      this.optionsQuiz = item.options ? [...item.options] : ['', '', '', ''];
      this.indexCorrectQuiz = item.indexCorrect;
      this.explicationQuiz = item.explication;
      this.categorieQuiz = item.categorie;
      this.xpQuiz = item.recompenseXp;
    }

    // Témoignage
    if (item.type === 'temoignage') {
      this.conteur = item.conteur;
      this.qualiteConteur = item.qualiteConteur;
      this.lieuConteur = item.lieu;
      this.titreHistoire = item.titreHistoire;
      this.dureeTemoignage = item.duree;
      this.extraitTemoignage = item.extrait;
      this.epoqueOuAnnee = item.epoqueOuAnnee || '';
    }
  }

  get totalEtapes(): number {
    if (this.typeChoisi === 'figure' || this.typeChoisi === 'monument' || this.typeChoisi === 'ville' || this.typeChoisi === 'conte') {
      return 4;
    }
    return 3;
  }

  naviguerVers(etape: number): void {
    if (etape >= 1 && etape <= this.totalEtapes) {
      this.etapeCourante.set(etape);
    }
  }

  etapeSuivante(): void {
    if (this.etapeCourante() < this.totalEtapes) {
      this.etapeCourante.update(v => v + 1);
    } else {
      this.soumettre();
    }
  }

  etapePrecedente(): void {
    if (this.etapeCourante() > 1) {
      this.etapeCourante.update(v => v - 1);
    }
  }

  selectionnerType(type: TypeContenuCulturel): void {
    this.typeChoisi = type;
  }

  // ── Gestion dynamique Faits Clés ─────────────────────────────────
  ajouterFaitCle(): void {
    this.faitsCles.push({ titre: 'Nouveau fait marquant', description: '' });
  }

  supprimerFaitCle(index: number): void {
    this.faitsCles.splice(index, 1);
  }

  // ── Gestion dynamique Chapitres ──────────────────────────────────
  ajouterChapitre(): void {
    this.chapitres.push({ titre: `Chapitre ${this.chapitres.length + 1}`, contenu: '' });
  }

  supprimerChapitre(index: number): void {
    this.chapitres.splice(index, 1);
  }

  // ── Gestion dynamique Scènes de Conte ────────────────────────────
  ajouterScene(): void {
    const num = this.scenes.length + 1;
    this.scenes.push({
      id: `sc-${Date.now()}`,
      numeroScene: num,
      titre: `Scène ${num}`,
      texteNarratif: '',
      estEpilogue: false,
      choix: []
    });
  }

  supprimerScene(index: number): void {
    this.scenes.splice(index, 1);
    this.scenes.forEach((s, idx) => s.numeroScene = idx + 1);
  }

  ajouterChoixScene(scene: SceneConteDTO): void {
    if (!scene.choix) scene.choix = [];
    scene.choix.push({
      id: `ch-${Date.now()}`,
      libelle: 'Nouveau choix',
      description: '',
      sceneSuivanteId: ''
    });
  }

  supprimerChoixScene(scene: SceneConteDTO, index: number): void {
    scene.choix.splice(index, 1);
  }

  // ── Soumission finale ────────────────────────────────────────────
  soumettre(): void {
    const id = this.elementAEditer ? this.elementAEditer.id : `${this.typeChoisi}-${Date.now()}`;
    const dateCreation = this.elementAEditer ? this.elementAEditer.dateCreation : new Date().toISOString();
    const dateModification = new Date().toISOString();
    const regionNom = this.regionSelectionnee().nom;

    let resultat: ContenuCulturelDTO;

    switch (this.typeChoisi) {
      case 'figure':
        resultat = {
          id,
          type: 'figure',
          nom: this.nomOuTitre || 'Grande Figure',
          titreHonorifique: this.sousTitre || '',
          periode: this.periode || 'Période historique',
          regionId: this.regionId,
          regionNom,
          tag: this.tag || 'Figure Historique',
          photoUrl: this.photoUrl,
          photoCredits: this.photoCredits,
          resume: this.resume || '',
          citationHistorique: this.citationHistorique,
          faitsCles: this.faitsCles,
          chapitres: this.chapitres,
          elementsConnexes: [],
          publie: this.publie,
          dateCreation,
          dateModification
        } as FicheFigureHistoriqueDTO;
        break;

      case 'monument':
        resultat = {
          id,
          type: 'monument',
          nom: this.nomOuTitre || 'Monument Historique',
          sousTitre: this.sousTitre || '',
          ere: this.ere || 'Médiévale',
          regionId: this.regionId,
          regionNom,
          tag: this.tag || 'Patrimoine',
          photoUrl: this.photoUrl,
          photoCredits: this.photoCredits,
          localisationDetails: this.localisationDetails,
          presentation: this.presentation || this.resume,
          architectureEtMateriaux: this.architectureEtMateriaux,
          pourquoiCestImportant: this.pourquoiCestImportant,
          faitsCles: this.faitsCles,
          chapitres: this.chapitres,
          elementsConnexes: [],
          publie: this.publie,
          dateCreation,
          dateModification
        } as FicheMonumentDTO;
        break;

      case 'ville':
        resultat = {
          id,
          type: 'ville',
          nom: this.nomOuTitre || 'Cité Historique',
          sousTitre: this.sousTitre || '',
          regionId: this.regionId,
          regionNom,
          tag: this.tag || 'Cité Millénaire',
          photoUrl: this.photoUrl,
          photoCredits: this.photoCredits,
          fondation: this.fondation || '',
          resume: this.resume,
          identiteCulturelle: this.identiteCulturelle,
          traditionsEtPatrimoine: this.traditionsEtPatrimoine,
          faitsCles: this.faitsCles,
          chapitres: this.chapitres,
          elementsConnexes: [],
          publie: this.publie,
          dateCreation,
          dateModification
        } as FicheVilleDTO;
        break;

      case 'conte':
        resultat = {
          id,
          type: 'conte',
          titre: this.nomOuTitre || 'Conte Traditionnel',
          sousTitre: this.sousTitre || '',
          origine: this.origineConte,
          regionId: this.regionId,
          regionNom,
          tag: this.tag || 'Conte Initiatique',
          photoUrl: this.photoUrl,
          photoCredits: this.photoCredits,
          resume: this.resume,
          narrateur: this.narrateur,
          dureeAudio: this.dureeAudio,
          dureeLecture: this.dureeLecture,
          enVedette: this.enVedette,
          morale: this.morale,
          scenes: this.scenes,
          elementsConnexes: [],
          publie: this.publie,
          dateCreation,
          dateModification
        } as ConteInteractifDTO;
        break;

      case 'devinette':
        resultat = {
          id,
          type: 'devinette',
          formuleIntro: this.formuleIntro,
          enigmeTexte: this.enigmeTexte || this.nomOuTitre,
          indices: this.indices,
          options: this.optionsDevinette,
          bonneReponse: this.bonneReponseDevinette || this.optionsDevinette[0],
          explicationCulturelle: this.explicationCulturelle || this.resume,
          proverbe: this.proverbe,
          regionId: this.regionId,
          regionNom,
          categorie: this.tag || 'Sagesse & Nature',
          difficulte: this.difficulteDevinette,
          recompenseXp: Number(this.xpDevinette) || 50,
          photoUrl: this.photoUrl,
          publie: this.publie,
          dateCreation,
          dateModification
        } as DevinetteTraditionnelleDTO;
        break;

      case 'quiz':
        resultat = {
          id,
          type: 'quiz',
          question: this.questionQuiz || this.nomOuTitre,
          options: this.optionsQuiz,
          indexCorrect: Number(this.indexCorrectQuiz) || 0,
          explication: this.explicationQuiz || this.resume,
          categorie: this.categorieQuiz,
          regionId: this.regionId,
          regionNom,
          recompenseXp: Number(this.xpQuiz) || 30,
          publie: this.publie,
          dateCreation,
          dateModification
        } as QuizCulturelDTO;
        break;

      case 'temoignage':
        resultat = {
          id,
          type: 'temoignage',
          conteur: this.conteur || this.nomOuTitre,
          qualiteConteur: this.qualiteConteur || this.sousTitre,
          lieu: this.lieuConteur,
          titreHistoire: this.titreHistoire || this.nomOuTitre,
          duree: this.dureeTemoignage,
          extrait: this.extraitTemoignage || this.resume,
          avatarUrl: this.photoUrl,
          epoqueOuAnnee: this.epoqueOuAnnee,
          regionId: this.regionId,
          regionNom,
          publie: this.publie,
          dateCreation,
          dateModification
        } as TemoignageOralDTO;
        break;
    }

    this.sauvegarder.emit(resultat);
  }
}
