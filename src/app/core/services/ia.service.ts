import { Injectable, signal, computed } from '@angular/core';
import { MoteurIADTO } from '../models/admin-dto.model';

// ── SERVICE MOTEURS IA PÉDAGOGIQUES ──────────────────────────────
// Ce service remplace l'ancien IaService/InfrastructureService.
// Aucune donnée technique (tokens, latence serveur, RAM) n'est exposée.
// Uniquement des métriques pédagogiques compréhensibles par un directeur.
@Injectable({
  providedIn: 'root'
})
export class MoteurIAService {
  private readonly _moteurs = signal<MoteurIADTO[]>([
    {
      id: 'ia-01',
      nom: 'AlterniaMath',
      matiereCiblee: 'Mathématiques',
      niveauxCibles: ['Primaire', 'Collège', 'Lycée'],
      statut: 'Actif',
      questionsTraiteesJour: 840_200,
      questionsTraiteesTotal: 12_400_000,
      langues: ['Français', 'Bambara'],
      dateDeploiement: '15 jan. 2026',
    },
    {
      id: 'ia-02',
      nom: 'AlterniaSciences',
      matiereCiblee: 'Sciences & SVT',
      niveauxCibles: ['Collège', 'Lycée'],
      statut: 'Actif',
      questionsTraiteesJour: 512_400,
      questionsTraiteesTotal: 7_800_000,
      langues: ['Français'],
      dateDeploiement: '20 jan. 2026',
    },
    {
      id: 'ia-03',
      nom: 'AlterniaLangues',
      matiereCiblee: 'Français & Langues',
      niveauxCibles: ['Primaire', 'Collège'],
      statut: 'Actif',
      questionsTraiteesJour: 310_100,
      questionsTraiteesTotal: 5_200_000,
      langues: ['Français', 'Bambara', 'Peulh'],
      dateDeploiement: '1er fév. 2026',
    },
    {
      id: 'ia-04',
      nom: 'AlterniaHistoire',
      matiereCiblee: 'Histoire-Géographie',
      niveauxCibles: ['Collège', 'Lycée'],
      statut: 'En formation',
      questionsTraiteesJour: 184_593,
      questionsTraiteesTotal: 2_100_000,
      langues: ['Français'],
      dateDeploiement: '10 mars 2026',
    },
  ]);

  readonly moteurs = computed(() => this._moteurs());
  readonly totalQuestionsAujourdhui = computed(() => 1_847_293);
  readonly moteursActifs = computed(() => this._moteurs().filter(m => m.statut === 'Actif').length);
}
