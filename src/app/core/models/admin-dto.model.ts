export interface BoitierDTO {
  id: string;
  serialNumber: string;
  etablissementId: string;
  etablissementNom: string;
  status: 'En ligne' | 'Hors ligne' | 'Synchronisation' | 'Maintenance';
  firmwareVersion: string;
  batteryLevel: number;
  lastSync: string;
  ipAddress: string;
  operatingMode: 'Autonome' | 'Classe Connectée' | 'Examen' | 'Mise à jour';
  storageUsedPercent: number;
  hardwareRevision: string;
  cpuTemperature: number;
}

export interface EtablissementDTO {
  id: string;
  nom: string;
  codeRegion: string;
  ville: string;
  pays: string;
  boitiersCount: number;
  licencesCount: number;
  dateInscription: string;
  statut: 'Actif' | 'En attente' | 'Suspendu';
  directeurEmail: string;
  offre: 'Enterprise' | 'Institutionnel' | 'Standard';
  contactPhone: string;
}

export interface ParentAccountDTO {
  id: string;
  nomFamille: string;
  tuteur: string;
  email: string;
  telephone: string;
  etablissementNom: string;
  licencesAssocies: number;
  statut: 'Actif' | 'Inactif' | 'Suspendu';
  derniereActivite: string;
  abonnementsType: 'Premium Annuel' | 'Standard Mensuel' | 'Découverte';
}

export interface LicenceDTO {
  id: string;
  code: string;
  type: 'Établissement Bulk' | 'Parent Solo' | 'Institutionnel Pack';
  titulaire: string;
  dateActivation: string;
  dateExpiration: string;
  statut: 'Active' | 'Expirée' | 'En attente' | 'Renouvelée';
  prixAnnuel: number;
  dureeMois: number;
}

export interface IaModelDTO {
  id: string;
  nom: string;
  version: string;
  domaine: string;
  statut: 'Actif' | 'Entraînement' | 'Maintenance' | 'Dégradé';
  tempsReponseMoyenMs: number;
  tauxErreurPercent: number;
  consommationJourReq: number;
  disponibilitePercent: number;
  tokensPerMinute: number;
}

export interface ServerNodeDTO {
  id: string;
  region: string;
  provider: string;
  cpuLoadPercent: number;
  ramUsedGb: number;
  ramTotalGb: number;
  bandwidthMbps: number;
  status: 'Opérationnel' | 'Charge élevée' | 'Maintenance';
}

export interface DeploymentDTO {
  id: string;
  version: string;
  canal: 'Canari (10%)' | 'Flotte Globale (100%)' | 'Bêta Établissements';
  date: string;
  statut: 'Succès' | 'En cours' | 'Rollback';
  boitiersImpactes: string;
  auteur: string;
  changelog: string[];
}

export interface MaintenanceTicketDTO {
  id: string;
  sujet: string;
  etablissementNom: string;
  priorite: 'Urgent' | 'Haute' | 'Normale' | 'Basse';
  statut: 'Ouvert' | 'En cours' | 'Résolu';
  dateCreation: string;
  assigneA: string;
}

export interface GlobalAnalyticsDTO {
  tempsUtilisationTotalHeures: number;
  volumeQuestionsMonthMillions: number;
  disciplinePlusConsultee: string;
  disciplinePlusConsulteePercent: number;
  subjects: Array<{ matiere: string; pourcentage: number; heuresTotal: string }>;
  topics: Array<{ sujet: string; matiere: string; occurrences: string; tendance: string }>;
}
