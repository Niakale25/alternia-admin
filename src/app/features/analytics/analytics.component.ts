import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SubjectStat {
  matiere: string;
  pourcentage: number;
  heuresTotal: string;
  volumeQuestions: string;
}

export interface FrequentTopic {
  sujet: string;
  matiere: string;
  occurrences: string;
  tendance: string;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content">

      <!-- HEADER -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow text-cyan">Agrégation Globales & Macro-données</div>
          <h1 class="page-header__title">Analytics & Métriques d'Utilisation</h1>
          <p class="page-header__subtitle">Statistiques agrégées à l'échelle de l'écosystème Alternia (Strict respect de la confidentialité)</p>
        </div>
        <div class="flex gap-2">
          <div class="chart-card__tabs" style="display:flex;">
            <button class="chart-tab" [class.chart-tab--active]="period() === 'Quotidien'" (click)="period.set('Quotidien')">Quotidien</button>
            <button class="chart-tab" [class.chart-tab--active]="period() === 'Mensuel'" (click)="period.set('Mensuel')">Mensuel</button>
            <button class="chart-tab" [class.chart-tab--active]="period() === 'Annuel'" (click)="period.set('Annuel')">Annuel</button>
          </div>
          <button class="btn btn--primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Exporter Rapport Aggregé
          </button>
        </div>
      </div>

      <!-- PRIVACY MANDATE BANNER -->
      <div class="card mb-6 p-3 flex items-center gap-3 bg-surface border border-border">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#314999" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span class="text-xs text-secondary">
          <strong>Confidentialité & Anonymisation :</strong> Conformément à l'architecture Alternia, aucune donnée d'apprenant individuel n'est collectée ou analysée. Les métriques ci-dessous reposent sur des volumes télémétriques anonymes agrégés.
        </span>
      </div>

      <!-- KPI METRICS -->
      <div class="kpi-grid mb-6">
        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>TEMPS D'UTILISATION GLOBAL</span>
            <span class="badge badge--success">+14.2%</span>
          </div>
          <div class="metric-value text-brand mt-2">1 428 900 h</div>
          <div class="text-xs text-secondary mt-1">Cumulé sur les boîtiers actifs</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>DISCIPLINE LA PLUS CONSULTÉE</span>
            <span class="badge badge--cyan">Mathématiques</span>
          </div>
          <div class="metric-value text-cyan mt-2">34,8%</div>
          <div class="text-xs text-secondary mt-1">497 250 heures de sessions</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>VOLUME DE QUESTIONS IA / MOIS</span>
            <span class="badge badge--brand">+18.5%</span>
          </div>
          <div class="metric-value text-text mt-2">54.2M</div>
          <div class="text-xs text-secondary mt-1">Requêtes interactives soumises</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>INTERACTION MOYENNE / BOÎTIER</span>
            <span class="badge badge--brand">4.2h / jour</span>
          </div>
          <div class="metric-value text-success mt-2">4,2h/j</div>
          <div class="text-xs text-secondary mt-1">Utilisation pédagogique intensive</div>
        </div>
      </div>

      <!-- SUBJECTS BREAKDOWN & FREQUENT TOPICS -->
      <div class="chart-grid mb-6">

        <!-- Top Consulted Subjects -->
        <div class="card flex flex-col justify-between">
          <div>
            <div class="font-bold text-base text-text mb-1">Matières les plus consultées</div>
            <div class="text-xs text-subtle mb-4">Volume horaire agrégé par discipline</div>

            <div class="flex flex-col gap-3">
              @for (sub of subjectsList; track sub.matiere) {
                <div>
                  <div class="flex justify-between text-xs font-semibold mb-1">
                    <span>{{ sub.matiere }}</span>
                    <span class="font-mono text-brand">{{ sub.pourcentage }}% ({{ sub.heuresTotal }})</span>
                  </div>
                  <div class="progress">
                    <div class="progress__bar" [class.progress__bar--cyan]="sub.pourcentage < 30 && sub.pourcentage >= 20" [class.progress__bar--accent]="sub.pourcentage < 20" [style.width.%]="sub.pourcentage"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Most Frequent Topics -->
        <div class="card">
          <div class="font-bold text-base text-text mb-1">Thématiques les plus questionnées</div>
          <div class="text-xs text-subtle mb-4">Concepts pédagogiques nécessitant le plus de réexplications IA</div>

          <div class="table-wrap bg-surface">
            <table>
              <thead>
                <tr>
                  <th>Concept / Thématique</th>
                  <th>Matière</th>
                  <th>Occurrences</th>
                  <th>Tendance</th>
                </tr>
              </thead>
              <tbody>
                @for (t of topicsList; track t.sujet) {
                  <tr>
                    <td class="font-medium text-text text-xs">{{ t.sujet }}</td>
                    <td>
                      <span class="tag text-xs">{{ t.matiere }}</span>
                    </td>
                    <td class="font-mono text-xs font-semibold text-brand">{{ t.occurrences }}</td>
                    <td>
                      <span class="text-xs text-success font-semibold">{{ t.tendance }}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  `
})
export class AnalyticsComponent {
  period = signal<'Quotidien' | 'Mensuel' | 'Annuel'>('Mensuel');

  readonly subjectsList: SubjectStat[] = [
    { matiere: 'Mathématiques & Algèbre', pourcentage: 34.8, heuresTotal: '497 250 h', volumeQuestions: '18.8M' },
    { matiere: 'Physique - Chimie', pourcentage: 24.2, heuresTotal: '345 790 h', volumeQuestions: '13.1M' },
    { matiere: 'Sciences de la Vie & de la Terre', pourcentage: 18.5, heuresTotal: '264 340 h', volumeQuestions: '10.0M' },
    { matiere: 'Français & Littérature', pourcentage: 12.5, heuresTotal: '178 610 h', volumeQuestions: '6.7M' },
    { matiere: 'Histoire - Géographie', pourcentage: 10.0, heuresTotal: '142 890 h', volumeQuestions: '5.6M' },
  ];

  readonly topicsList: FrequentTopic[] = [
    { sujet: 'Équations du 2nd degré & Discriminant Δ', matiere: 'Mathématiques', occurrences: '1 240 500', tendance: '+24%' },
    { sujet: 'Lois de Newton & Mécanique céleste', matiere: 'Physique', occurrences: '984 100', tendance: '+18%' },
    { sujet: 'Synthèse des protéines & Transcription ADN', matiere: 'SVT', occurrences: '840 200', tendance: '+12%' },
    { sujet: 'Reconstitution de texte & Règles d\'accord', matiere: 'Français', occurrences: '620 900', tendance: '+8%' },
    { sujet: 'Intégration par parties & Calcul d\'aires', matiere: 'Mathématiques', occurrences: '512 000', tendance: '+15%' },
  ];
}
