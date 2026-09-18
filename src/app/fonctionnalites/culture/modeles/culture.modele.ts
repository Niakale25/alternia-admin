export type TypeContenuCulturel =
  | 'figure'
  | 'monument'
  | 'ville'
  | 'conte'
  | 'devinette'
  | 'quiz'
  | 'temoignage';

export type RegionCode =
  | 'bamako'
  | 'kayes'
  | 'koulikoro'
  | 'sikasso'
  | 'segou'
  | 'mopti'
  | 'tombouctou'
  | 'gao'
  | 'kidal'
  | 'taoudenit'
  | 'menaka'
  | 'all';

export interface RegionMalienne {
  id: RegionCode;
  nom: string;
  surnom: string;
  couleur: string;
  badgeBg: string;
  icone: string;
}

export interface FaitHistorique {
  titre: string;
  description: string;
  anneeOuEpoque?: string;
}

export interface ChapitreEditorial {
  titre: string;
  contenu: string;
  citation?: string;
  auteurCitation?: string;
}

export interface ElementConnexeRef {
  id: string;
  type: TypeContenuCulturel;
  titre: string;
  sousTitre?: string;
  photoUrl?: string;
}

// ── 1. Grande Figure Historique ───────────────────────────────────
export interface FicheFigureHistoriqueDTO {
  id: string;
  type: 'figure';
  nom: string;
  titreHonorifique: string;
  periode: string; // Ex: '1190 – 1255'
  regionId: RegionCode;
  regionNom: string;
  tag: string; // Ex: 'Mansa du Mali', 'Héros National'
  photoUrl: string;
  photoCredits?: string;
  resume: string;
  citationHistorique?: string;
  faitsCles: FaitHistorique[];
  chapitres: ChapitreEditorial[];
  elementsConnexes: ElementConnexeRef[];
  publie: boolean;
  dateCreation: string;
  dateModification: string;
}

// ── 2. Monument Historique ─────────────────────────────────────────
export interface FicheMonumentDTO {
  id: string;
  type: 'monument';
  nom: string;
  sousTitre: string;
  ere: string; // Ex: 'Érigé au XIIIe siècle'
  regionId: RegionCode;
  regionNom: string;
  tag: string; // Ex: 'Patrimoine Mondial UNESCO'
  photoUrl: string;
  photoCredits?: string;
  localisationDetails: string;
  presentation: string;
  architectureEtMateriaux: string;
  pourquoiCestImportant: string;
  faitsCles: FaitHistorique[];
  chapitres: ChapitreEditorial[];
  elementsConnexes: ElementConnexeRef[];
  publie: boolean;
  dateCreation: string;
  dateModification: string;
}

// ── 3. Cité & Village ─────────────────────────────────────────────
export interface FicheVilleDTO {
  id: string;
  type: 'ville';
  nom: string;
  sousTitre: string;
  regionId: RegionCode;
  regionNom: string;
  tag: string; // Ex: 'Cité Millénaire'
  photoUrl: string;
  photoCredits?: string;
  fondation: string; // Ex: 'Fondée au IXe siècle'
  resume: string;
  identiteCulturelle: string;
  traditionsEtPatrimoine: string;
  faitsCles: FaitHistorique[];
  chapitres: ChapitreEditorial[];
  elementsConnexes: ElementConnexeRef[];
  publie: boolean;
  dateCreation: string;
  dateModification: string;
}

// ── 4. Conte Interactif ───────────────────────────────────────────
export interface ChoixSceneDTO {
  id: string;
  libelle: string;
  description: string;
  sceneSuivanteId: string;
  traitSagesse?: string; // Ex: 'Voie de la Sagesse', 'Voie de l\'Audace'
}

export interface SceneConteDTO {
  id: string;
  numeroScene: number;
  titre: string;
  texteNarratif: string;
  atmosphere?: string; // Ex: 'Veillée étoilée au son de la Kora'
  visuelUrl?: string;
  extraitAudioTexte?: string;
  insightCulturel?: string; // Proverbe ou secret de tradition
  estEpilogue: boolean;
  choix: ChoixSceneDTO[];
}

export interface ConteInteractifDTO {
  id: string;
  type: 'conte';
  titre: string;
  sousTitre: string;
  origine: string; // Ex: 'Tradition Mandingue', 'Royaume de Ségou'
  regionId: RegionCode;
  regionNom: string;
  tag: string; // Ex: 'Conte Initiatique', 'Fable des Aînés'
  photoUrl: string;
  photoCredits?: string;
  resume: string;
  narrateur: string; // Ex: 'Griot Mamadou Kouyaté'
  dureeAudio: string; // Ex: '6 min 30'
  dureeLecture: string; // Ex: '4 min'
  enVedette: boolean;
  morale: string; // Enseignement traditionnel
  scenes: SceneConteDTO[];
  elementsConnexes: ElementConnexeRef[];
  publie: boolean;
  dateCreation: string;
  dateModification: string;
}

// ── 5. Devinette Traditionnelle « N'Da ! » ─────────────────────────
export interface DevinetteTraditionnelleDTO {
  id: string;
  type: 'devinette';
  formuleIntro: string; // "« N'Da ! » — « N'Da n'sira ! »"
  enigmeTexte: string;
  indices: string[]; // 3 indices progressifs
  options: string[]; // 4 options possibles
  bonneReponse: string;
  explicationCulturelle: string;
  proverbe?: string;
  regionId: RegionCode;
  regionNom: string;
  categorie: string; // 'Éléments de la Nature', 'Objets Sacrés', 'Sagesse'
  difficulte: 'Initié' | 'Apprenti' | 'Maître Dozo';
  recompenseXp: number;
  photoUrl?: string;
  publie: boolean;
  dateCreation: string;
  dateModification: string;
}

// ── 6. Quiz Culturel ───────────────────────────────────────────────
export interface QuizCulturelDTO {
  id: string;
  type: 'quiz';
  question: string;
  options: string[]; // 4 choix
  indexCorrect: number; // 0..3
  explication: string;
  categorie: string; // 'Histoire', 'Traditions', 'Arts & Musique', 'Géographie'
  regionId: RegionCode;
  regionNom: string;
  recompenseXp: number;
  publie: boolean;
  dateCreation: string;
  dateModification: string;
}

// ── 7. Témoignage / Récit Oral ─────────────────────────────────────
export interface TemoignageOralDTO {
  id: string;
  type: 'temoignage';
  conteur: string;
  qualiteConteur: string; // Ex: 'Doyen des forgerons', 'Potière de Kalabougou'
  lieu: string;
  titreHistoire: string;
  duree: string;
  extrait: string;
  avatarUrl?: string;
  audioUrl?: string;
  epoqueOuAnnee?: string;
  regionId: RegionCode;
  regionNom: string;
  publie: boolean;
  dateCreation: string;
  dateModification: string;
}

// ── Union type pour tous les contenus culturels ───────────────────
export type ContenuCulturelDTO =
  | FicheFigureHistoriqueDTO
  | FicheMonumentDTO
  | FicheVilleDTO
  | ConteInteractifDTO
  | DevinetteTraditionnelleDTO
  | QuizCulturelDTO
  | TemoignageOralDTO;

// ── 8. Tampon du Passeport Culturel (Gamification) ─────────────────
export interface TamponPasseportDTO {
  id: string;
  nom: string;
  regionId: RegionCode;
  regionNom: string;
  monumentOuFigure: string;
  symboleSvg: string;
  conditionDeblocage: string;
  xpRecompense: number;
  rarete: 'Commun' | 'Rare' | 'Épique' | 'Légendaire';
  totalDebloquesParEleves: number;
  tauxDeblocage: number; // en %
  actif: boolean;
  couleurAccent: string;
}

export interface NiveauExplorateurDTO {
  niveau: number;
  titre: string;
  seuilXp: number;
  badgeNom: string;
  couleur: string;
  nombreElevesAtteints: number;
}

// ── Statistiques du Module Culture ────────────────────────────────
export interface StatistiquesCultureDTO {
  totalContenus: number;
  totalFigures: number;
  totalMonuments: number;
  totalVilles: number;
  totalContenusContes: number;
  totalDevinettes: number;
  totalQuiz: number;
  totalTemoignages: number;
  regionsCouvertes: number;
  tauxPublication: number;
  totalTamponsDebloques: number;
  xpTotalDistribue: string;
}
