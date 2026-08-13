import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IaModelInfo {
  id: string;
  nom: string;
  version: string;
  domaine: string;
  statut: 'Actif' | 'Entraînement' | 'Maintenance' | 'Dégradé';
  tempsReponseMoyen: number; // ms
  tauxErreur: number; // %
  consommationJour: string; // token queries
  disponibilite: number; // %
}

@Component({
  selector: 'app-ia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content">

      <!-- HEADER -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow text-cyan">Intelligence Artificielle & LLMs</div>
          <h1 class="page-header__title">Supervision des Modèles IA Alternia</h1>
          <p class="page-header__subtitle">Monitoring des moteurs pédagogiques, du temps de réponse et de la consommation de tokens</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn--secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            Purger la mémoire cache
          </button>
          <button class="btn btn--primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5 5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z"/><path d="M9 13v1a3 3 0 0 0 6 0v-1"/></svg>
            Déployer un nouveau modèle
          </button>
        </div>
      </div>

      <!-- KPI METRICS -->
      <div class="kpi-grid mb-6">
        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>REQUÊTES IA AUJOURD'HUI</span>
            <span class="badge badge--info">+18.7%</span>
          </div>
          <div class="metric-value text-cyan mt-2">1 847 293</div>
          <div class="text-xs text-secondary mt-1">4.2M tokens traités/min</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>TEMPS DE RÉPONSE MOYEN</span>
            <span class="badge badge--success">124 ms</span>
          </div>
          <div class="metric-value text-success mt-2">124ms</div>
          <div class="text-xs text-secondary mt-1">Objectif SLA : &lt; 200ms</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>TAUX D'ERREUR MOYEN</span>
            <span class="badge badge--success">0.24%</span>
          </div>
          <div class="metric-value text-text mt-2">0,24%</div>
          <div class="text-xs text-secondary mt-1">Stabilité haute résilience</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>MODÈLES IA DÉPLOYÉS</span>
            <span class="badge badge--brand">4 Moteurs</span>
          </div>
          <div class="metric-value text-brand mt-2">4</div>
          <div class="text-xs text-secondary mt-1">Fine-tuned pour écosystème EdTech</div>
        </div>
      </div>

      <!-- IA MONITORING CARDS -->
      <div class="grid-3 mb-6" style="grid-template-columns: repeat(2, 1fr);">
        @for (m of modelsList; track m.id) {
          <div class="card">
            <div class="flex justify-between items-start mb-3">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-bold text-text">{{ m.nom }}</h3>
                  <span class="tag text-mono text-cyan">{{ m.version }}</span>
                </div>
                <div class="text-xs text-subtle mt-1">Domaine : {{ m.domaine }}</div>
              </div>
              <span class="badge" [class.badge--success]="m.statut === 'Actif'" [class.badge--warning]="m.statut === 'Entraînement'" [class.badge--danger]="m.statut === 'Dégradé'">
                {{ m.statut }}
              </span>
            </div>

            <div class="grid-3 gap-2 p-3 bg-surface rounded-md mb-3" style="grid-template-columns: repeat(3, 1fr);">
              <div>
                <div class="text-xs text-subtle">Latence Moy.</div>
                <div class="font-mono text-sm font-semibold text-brand mt-1">{{ m.tempsReponseMoyen }}ms</div>
              </div>
              <div>
                <div class="text-xs text-subtle">Taux Erreurs</div>
                <div class="font-mono text-sm font-semibold text-text mt-1" [class.text-danger]="m.tauxErreur > 1">{{ m.tauxErreur }}%</div>
              </div>
              <div>
                <div class="text-xs text-subtle">SLA Uptime</div>
                <div class="font-mono text-sm font-semibold text-success mt-1">{{ m.disponibilite }}%</div>
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <div class="flex justify-between text-xs text-secondary font-medium">
                <span>Charge quotidienne du serveur IA</span>
                <span class="font-mono">{{ m.consommationJour }}</span>
              </div>
              <div class="progress">
                <div class="progress__bar progress__bar--cyan" [style.width.%]="m.disponibilite"></div>
              </div>
            </div>
          </div>
        }
      </div>

    </div>
  `
})
export class IaComponent {
  readonly modelsList: IaModelInfo[] = [
    { id: 'IA-01', nom: 'GPT-Alternia Core', version: 'v4.2.0', domaine: 'Modèle Pédagogique Général', statut: 'Actif', tempsReponseMoyen: 89, tauxErreur: 0.12, consommationJour: '840 200 req/j', disponibilite: 99.98 },
    { id: 'IA-02', nom: 'AlterniaMath Moteur STEM', version: 'v3.1.2', domaine: 'Résolution Mathématiques & Sciences', statut: 'Actif', tempsReponseMoyen: 67, tauxErreur: 0.08, consommationJour: '512 400 req/j', disponibilite: 99.99 },
    { id: 'IA-03', nom: 'AlterniaSVT & Biologie', version: 'v2.0.8', domaine: 'Sciences de la Vie et de la Terre', statut: 'Actif', tempsReponseMoyen: 110, tauxErreur: 0.45, consommationJour: '310 100 req/j', disponibilite: 99.85 },
    { id: 'IA-04', nom: 'AlterniaLangues V2', version: 'v2.0.0-beta', domaine: 'Traduction & Langues Régionales', statut: 'Entraînement', tempsReponseMoyen: 240, tauxErreur: 1.20, consommationJour: '184 593 req/j', disponibilite: 98.40 },
  ];
}
