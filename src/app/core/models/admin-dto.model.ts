// ================================================================
// ALTERNIA ADMIN — MODÈLES MÉTIER EDTECH
// Tous les modèles sont orientés métier pédagogique.
// Aucune donnée technique (CPU, RAM, bande passante) n'est présente.
// ================================================================

// ── BOÎTIER ALTERNIA ─────────────────────────────────────────────
export interface BoitierDTO {
  id: string;
  serialNumber: string;
  etablissementId: string;
  etablissementNom: string;
  statut: 'Actif' | 'Hors ligne' | 'Maintenance';
  versionFirmware: string;
  derniereConnexion: string;
  ville: string;
}

// ── ÉTABLISSEMENT ────────────────────────────────────────────────
export interface EtablissementDTO {
  id: string;
  nom: string;
  codeRegion: string;
  ville: string;
  pays: string;
  boitiersCount: number;
  profilsCount: number;
  licencesCount: number;
  dateInscription: string;
  statut: 'Actif' | 'En attente' | 'Suspendu';
  directeurEmail: string;
  offre: 'Enterprise' | 'Institutionnel' | 'Standard';
  contactPhone: string;
}

// ── COMPTE PARENT ────────────────────────────────────────────────
export interface ParentAccountDTO {
  id: string;
  nomFamille: string;
  tuteur: string;
  email: string;
  telephone: string;
  etablissementNom: string;
  statut: 'Actif' | 'Inactif' | 'Suspendu';
  derniereActivite: string;
  abonnementType: 'Premium Annuel' | 'Standard Mensuel' | 'Découverte';
  nbProfilsLies: number;
}

// ── PROFIL PÉDAGOGIQUE ───────────────────────────────────────────
export interface ProfilPedagogiqueDTO {
  id: string;
  nom: string;
  prenom: string;
  matiere: string;
  niveaux: string[];          // Ex: ['Primaire', 'Collège']
  photoUrl: string;
  audioUrl: string;
  statut: 'Actif' | 'Inactif';
  dateCreation: string;
}

// ── LICENCE ──────────────────────────────────────────────────────
export interface LicenceDTO {
  id: string;
  code: string;
  type: 'Établissement Bulk' | 'Parent Solo' | 'Institutionnel Pack';
  titulaire: string;
  etablissementId?: string;
  dateActivation: string;
  dateExpiration: string;
  statut: 'Active' | 'Expirée' | 'En attente' | 'Renouvelée';
  prixAnnuel: number;
  dureeMois: number;
}

// ── ABONNEMENT ───────────────────────────────────────────────────
export interface AbonnementDTO {
  id: string;
  parentId: string;
  parentNom: string;
  type: 'Premium Annuel' | 'Standard Mensuel' | 'Découverte';
  dateDebut: string;
  dateRenouvellement: string;
  montant: number;
  statut: 'Actif' | 'Résilié' | 'En attente de paiement' | 'Suspendu';
  autoRenouvellement: boolean;
}

// ── MOTEUR IA PÉDAGOGIQUE ────────────────────────────────────────
// Uniquement des métriques compréhensibles par un responsable pédagogique.
export interface MoteurIADTO {
  id: string;
  nom: string;
  matiereCiblee: string;
  niveauxCibles: string[];
  statut: 'Actif' | 'En formation' | 'Maintenance';
  questionsTraiteesJour: number;
  questionsTraiteesTotal: number;
  langues: string[];
  dateDeploiement: string;
}

// ── STATISTIQUES GLOBALES ─────────────────────────────────────────
// Uniquement des données agrégées et anonymisées — aucune donnée individuelle.
export interface StatistiquesGlobalesDTO {
  tempsUtilisationTotalHeures: number;
  volumeQuestionsMois: number;
  matieresPlusConsultees: Array<{
    matiere: string;
    pourcentage: number;
    heuresTotal: number;
  }>;
  sujetsFrequents: Array<{
    sujet: string;
    matiere: string;
    occurrences: number;
    tendance: 'hausse' | 'baisse' | 'stable';
  }>;
  evolutionMensuelle: Array<{
    mois: string;
    questions: number;
    boitiersActifs: number;
  }>;
}

// ── ALERTE PRIORITAIRE ───────────────────────────────────────────
export interface AlertePrioritaireDTO {
  id: string;
  type: 'renouvellement' | 'boitier_hors_ligne' | 'nouvel_etablissement' | 'info';
  message: string;
  dateCreation: string;
  urgence: 'haute' | 'normale' | 'basse';
  actionRequise: boolean;
}
