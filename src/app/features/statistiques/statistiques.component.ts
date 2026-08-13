import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content">

      <!-- EN-TÊTE -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow text-cyan">Données Agrégées & Anonymisées</div>
          <h1 class="page-header__title">Statistiques Pédagogiques</h1>
          <p class="page-header__subtitle">
            Métriques d'utilisation agrégées à l'échelle de l'écosystème Alternia — Aucune donnée individuelle collectée
          </p>
        </div>
        <div class="flex gap-2">
          <div style="display:flex; gap: 4px;">
            @for (p of periodes; track p) {
              <button
                class="btn btn--sm"
                [class.btn--primary]="periode() === p"
                [class.btn--ghost]="periode() !== p"
                (click)="periode.set(p)"
              >{{ p }}</button>
            }
          </div>
          <button class="btn btn--secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Exporter rapport
          </button>
        </div>
      </div>

      <!-- BANNIÈRE CONFIDENTIALITÉ -->
      <div class="confidentialite-banner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-brand)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
        <span class="text-xs text-secondary">
          <strong>Confidentialité garantie :</strong> Alternia ne collecte aucune donnée individuelle sur les apprenants. Toutes les statistiques ci-dessous sont des métriques agrégées et anonymisées conformément aux principes de protection des données.
        </span>
      </div>

      <!-- KPIs GLOBAUX -->
      <div class="kpi-grid mb-6">
        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>TEMPS D'UTILISATION GLOBAL</span>
            <span class="badge badge--success">+14,2%</span>
          </div>
          <div class="metric-value text-brand mt-2">1,43M h</div>
          <div class="text-xs text-secondary mt-1">Cumulé sur les boîtiers actifs ce mois</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>QUESTIONS IA TRAITÉES</span>
            <span class="badge badge--info">+18,5%</span>
          </div>
          <div class="metric-value text-cyan mt-2">54,2M</div>
          <div class="text-xs text-secondary mt-1">Requêtes pédagogiques ce mois</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>DISCIPLINE PHARE</span>
            <span class="badge badge--cyan">Mathématiques</span>
          </div>
          <div class="metric-value text-text mt-2">34,8%</div>
          <div class="text-xs text-secondary mt-1">Des sessions pédagogiques</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>UTILISATION QUOTIDIENNE</span>
            <span class="badge badge--brand">Intensive</span>
          </div>
          <div class="metric-value text-success mt-2">4,2 h/j</div>
          <div class="text-xs text-secondary mt-1">Par boîtier actif en moyenne</div>
        </div>
      </div>

      <!-- GRAPHIQUES -->
      <div class="chart-grid mb-6">

        <!-- Matières les plus consultées -->
        <div class="card">
          <div class="font-bold text-base text-text mb-1">Matières les plus consultées</div>
          <div class="text-xs text-subtle mb-4">Volume horaire agrégé par discipline — {{ periode() }}</div>

          <div class="matieres-chart">
            @for (m of matieres; track m.nom) {
              <div class="matiere-row">
                <div class="matiere-row__header">
                  <span class="matiere-row__nom">{{ m.nom }}</span>
                  <span class="matiere-row__stats">
                    <span class="font-bold text-text" style="font-family: var(--font-tight);">{{ m.pct }}%</span>
                    <span class="text-subtle ml-2">{{ m.heures }}</span>
                  </span>
                </div>
                <div class="progress">
                  <div
                    class="progress__bar"
                    [class.progress__bar--cyan]="m.isPrimary"
                    [class.progress__bar--brand]="!m.isPrimary"
                    [style.width.%]="m.pct"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Sujets fréquents -->
        <div class="card">
          <div class="font-bold text-base text-text mb-1">Sujets les plus demandés</div>
          <div class="text-xs text-subtle mb-4">Questions les plus posées aux moteurs IA — {{ periode() }}</div>

          <div class="sujets-list">
            @for (s of sujets; track s.sujet; let i = $index) {
              <div class="sujet-item">
                <div class="sujet-item__rang">{{ i + 1 }}</div>
                <div class="sujet-item__body">
                  <div class="sujet-item__nom">{{ s.sujet }}</div>
                  <div class="sujet-item__matiere">{{ s.matiere }}</div>
                </div>
                <div class="sujet-item__meta">
                  <div class="font-semibold text-text" style="font-size: 12px;">{{ s.occurrences }}</div>
                  <span class="badge"
                    [class.badge--success]="s.tendance === 'hausse'"
                    [class.badge--neutral]="s.tendance === 'stable'"
                    [class.badge--warning]="s.tendance === 'baisse'"
                    style="font-size: 9px; padding: 1px 6px;"
                  >
                    {{ s.tendance === 'hausse' ? 'En hausse' : s.tendance === 'baisse' ? 'En baisse' : 'Stable' }}
                  </span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- ÉVOLUTION MENSUELLE -->
      <div class="card mb-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="font-bold text-base text-text">Évolution de l'utilisation</div>
            <div class="text-xs text-subtle">Questions traitées par les moteurs IA — 6 derniers mois</div>
          </div>
        </div>
        <div class="evolution-chart">
          @for (p of evolutionMensuelle; track p.mois) {
            <div class="evolution-bar-group">
              <div class="evolution-bar-wrap">
                <div
                  class="evolution-bar"
                  [style.height.%]="(p.questions / 60) * 100"
                  [attr.data-tooltip]="p.questions + 'M questions'"
                ></div>
              </div>
              <div class="evolution-bar-label">{{ p.mois }}</div>
              <div class="evolution-bar-value">{{ p.questions }}M</div>
            </div>
          }
        </div>
      </div>

    </div>
  `,
  styles: [`
    .confidentialite-banner {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 16px;
      background: var(--c-brand-bg);
      border: 1px solid var(--c-brand-border);
      border-radius: var(--r-lg);
      margin-bottom: 1.5rem;
    }

    .matieres-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .matiere-row { display: flex; flex-direction: column; gap: 5px; }

    .matiere-row__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .matiere-row__nom { font-size: 13px; font-weight: 500; color: var(--c-text); }
    .matiere-row__stats { display: flex; align-items: center; gap: 4px; font-size: 12px; }

    .sujets-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .sujet-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      border-radius: var(--r-md);
      transition: background var(--t-fast);

      &:hover { background: var(--c-surface); }
    }

    .sujet-item__rang {
      width: 22px;
      height: 22px;
      border-radius: var(--r-sm);
      background: var(--c-brand-bg);
      color: var(--c-brand);
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .sujet-item__body { flex: 1; min-width: 0; }
    .sujet-item__nom { font-size: 12px; font-weight: 600; color: var(--c-text); }
    .sujet-item__matiere { font-size: 11px; color: var(--c-subtle); }

    .sujet-item__meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      flex-shrink: 0;
    }

    /* Graphique évolution */
    .evolution-chart {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      height: 160px;
    }

    .evolution-bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }

    .evolution-bar-wrap {
      flex: 1;
      width: 100%;
      display: flex;
      align-items: flex-end;
    }

    .evolution-bar {
      width: 100%;
      background: linear-gradient(180deg, var(--c-cyan) 0%, var(--c-brand) 100%);
      border-radius: 4px 4px 0 0;
      min-height: 4px;
      opacity: 0.8;
      transition: opacity var(--t-fast);
      cursor: pointer;

      &:hover { opacity: 1; }
    }

    .evolution-bar-label {
      font-size: 11px;
      color: var(--c-subtle);
      margin-top: 4px;
    }

    .evolution-bar-value {
      font-size: 10px;
      font-weight: 700;
      color: var(--c-secondary);
      font-family: var(--font-tight);
    }
  `]
})
export class StatistiquesComponent {

  periode = signal('Mensuel');
  readonly periodes = ['Quotidien', 'Mensuel', 'Annuel'];

  readonly matieres = [
    { nom: 'Mathématiques', pct: 34.8, heures: '497 250 h', isPrimary: true },
    { nom: 'Sciences & SVT', pct: 22.1, heures: '315 800 h', isPrimary: false },
    { nom: 'Français & Langues', pct: 19.4, heures: '277 000 h', isPrimary: false },
    { nom: 'Histoire-Géographie', pct: 14.7, heures: '209 900 h', isPrimary: false },
    { nom: 'Autres matières', pct: 9.0,  heures: '128 600 h', isPrimary: false },
  ];

  readonly sujets = [
    { sujet: 'Théorème de Pythagore', matiere: 'Mathématiques', occurrences: '842 300', tendance: 'hausse' },
    { sujet: 'Équations du 1er degré', matiere: 'Mathématiques', occurrences: '720 100', tendance: 'stable' },
    { sujet: 'Photosynthèse', matiere: 'Sciences & SVT', occurrences: '612 400', tendance: 'hausse' },
    { sujet: 'Accord du participe passé', matiere: 'Français', occurrences: '589 200', tendance: 'stable' },
    { sujet: 'Fractions et décimaux', matiere: 'Mathématiques', occurrences: '541 700', tendance: 'baisse' },
    { sujet: 'L\'Empire du Mali', matiere: 'Histoire-Géo', occurrences: '498 100', tendance: 'hausse' },
  ];

  readonly evolutionMensuelle = [
    { mois: 'Mars',  questions: 38 },
    { mois: 'Avril', questions: 42 },
    { mois: 'Mai',   questions: 45 },
    { mois: 'Juin',  questions: 48 },
    { mois: 'Juil.', questions: 51 },
    { mois: 'Août',  questions: 54 },
  ];
}
