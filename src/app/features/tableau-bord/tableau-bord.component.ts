import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { ToastService } from '../../shared/components/toast/toast.service';

interface KpiPrincipal {
  label: string;
  valeur: string;
  sousTexte: string;
  tendance: number;
  tendanceLabel: string;
  couleur: string;
  icon: string;
}

interface AlertePrioritaire {
  id: string;
  type: 'renouvellement' | 'boitier' | 'etablissement' | 'info';
  message: string;
  detail: string;
  urgence: 'haute' | 'normale' | 'basse';
  actionLabel: string;
}

interface PointGraphique {
  mois: string;
  etablissements: number;
  parents: number;
  boitiers: number;
}

@Component({
  selector: 'app-tableau-bord',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeHtmlPipe],
  template: `
    <div class="tdb">

      <!-- ── EN-TÊTE ──────────────────────────────────────────── -->
      <div class="tdb__header">
        <div class="tdb__header-left">
          <div class="tdb__eyebrow">
            <span class="status-dot status-dot--online"></span>
            Plateforme Alternia — Active
          </div>
          <h1 class="tdb__title">Tableau de Bord</h1>
          <p class="tdb__subtitle">Pilotage global de l'écosystème éducatif Alternia</p>
        </div>
        <div class="tdb__header-right">
          <div class="tdb__date">
            <div class="tdb__date-label">Mis à jour</div>
            <div class="tdb__date-value">13 août 2026 — 10h34</div>
          </div>
          <button class="btn btn--secondary btn--sm" (click)="refreshData()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            Actualiser
          </button>
          <button class="btn btn--primary btn--sm" (click)="downloadReport()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Rapport
          </button>
        </div>
      </div>

      <!-- ── ZONE 1 — VISION GLOBALE ────────────────────────── -->
      <div class="tdb__section-label">Vision globale</div>
      <div class="tdb__kpi-grid">
        @for (kpi of kpisPrincipaux; track kpi.label) {
          <div class="tdb__kpi-card" [style.--kpi-color]="kpi.couleur">
            <div class="tdb__kpi-top">
              <div class="tdb__kpi-icon" [innerHTML]="kpi.icon | safeHtml"></div>
              <div
                class="tdb__kpi-tendance"
                [class.tdb__kpi-tendance--hausse]="kpi.tendance > 0"
                [class.tdb__kpi-tendance--baisse]="kpi.tendance < 0"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  @if (kpi.tendance > 0) {
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                  } @else {
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
                  }
                </svg>
                {{ kpi.tendanceLabel }}
              </div>
            </div>
            <div class="tdb__kpi-valeur">{{ kpi.valeur }}</div>
            <div class="tdb__kpi-label">{{ kpi.label }}</div>
            <div class="tdb__kpi-sous">{{ kpi.sousTexte }}</div>
          </div>
        }
      </div>

      <!-- ── ZONE 2 + 3 — CROISSANCE & ACTIVITÉ ─────────────── -->
      <div class="tdb__middle-row">

        <!-- ZONE 2 — Croissance plateforme -->
        <div class="tdb__chart-card tdb__chart-card--large">
          <div class="tdb__chart-header">
            <div>
              <div class="tdb__chart-title">Croissance de la plateforme</div>
              <div class="tdb__chart-subtitle">Établissements et parents inscrits — 6 derniers mois</div>
            </div>
            <div class="tdb__chart-legend">
              <span class="tdb__legend-item tdb__legend-item--brand">Établissements</span>
              <span class="tdb__legend-item tdb__legend-item--cyan">Parents</span>
            </div>
          </div>

          <!-- Graphique en barres groupées -->
          <div class="tdb__bar-chart">
            @for (point of pointsGraphique; track point.mois; let i = $index) {
              <div class="tdb__bar-group">
                <div class="tdb__bar-values">
                  <div
                    class="tdb__bar tdb__bar--brand"
                    [style.height.%]="(point.etablissements / 1500) * 100"
                    [attr.data-tooltip]="point.etablissements + ' établissements'"
                  ></div>
                  <div
                    class="tdb__bar tdb__bar--cyan"
                    [style.height.%]="(point.parents / 60000) * 100"
                    [attr.data-tooltip]="(point.parents | number) + ' parents'"
                  ></div>
                </div>
                <div class="tdb__bar-label">{{ point.mois }}</div>
              </div>
            }
          </div>
        </div>

        <!-- ZONE 3 — Activité pédagogique -->
        <div class="tdb__activity-card">
          <div class="tdb__chart-header">
            <div>
              <div class="tdb__chart-title">Activité pédagogique</div>
              <div class="tdb__chart-subtitle">Matières les plus consultées ce mois</div>
            </div>
          </div>

          <div class="tdb__activity-kpi">
            <div class="tdb__activity-kpi-item">
              <div class="tdb__activity-kpi-value">54,2M</div>
              <div class="tdb__activity-kpi-label">Questions traitées ce mois</div>
            </div>
            <div class="tdb__activity-kpi-item">
              <div class="tdb__activity-kpi-value">4,2h/j</div>
              <div class="tdb__activity-kpi-label">Utilisation moyenne / boîtier</div>
            </div>
          </div>

          <div class="tdb__matieres">
            @for (m of matieres; track m.nom) {
              <div class="tdb__matiere-item">
                <div class="tdb__matiere-header">
                  <span class="tdb__matiere-nom">{{ m.nom }}</span>
                  <span class="tdb__matiere-pct">{{ m.pct }}%</span>
                </div>
                <div class="progress">
                  <div
                    class="progress__bar"
                    [class.progress__bar--cyan]="m.nom === 'Mathématiques'"
                    [class.progress__bar--brand]="m.nom !== 'Mathématiques'"
                    [style.width.%]="m.pct"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- ── ZONE 4 — ALERTES & ACTIONS PRIORITAIRES ────────── -->
      <div class="tdb__section-label">Alertes et actions prioritaires</div>
      <div class="tdb__alertes-grid">
        @for (alerte of alertesPrioritaires; track alerte.id) {
          <div
            class="tdb__alerte"
            [class.tdb__alerte--haute]="alerte.urgence === 'haute'"
            [class.tdb__alerte--normale]="alerte.urgence === 'normale'"
            [class.tdb__alerte--basse]="alerte.urgence === 'basse'"
          >
            <div class="tdb__alerte-icon" [innerHTML]="getAlerteIcon(alerte.type) | safeHtml"></div>
            <div class="tdb__alerte-body">
              <div class="tdb__alerte-message">{{ alerte.message }}</div>
              <div class="tdb__alerte-detail">{{ alerte.detail }}</div>
            </div>
            <button class="tdb__alerte-action btn btn--sm"
              [class.btn--danger]="alerte.urgence === 'haute'"
              [class.btn--secondary]="alerte.urgence !== 'haute'"
              (click)="onAlerteAction(alerte)"
            >
              {{ alerte.actionLabel }}
            </button>
          </div>
        }
      </div>

      <!-- ── RENOUVELLEMENTS RÉCENTS ──────────────────────────── -->
      <div class="tdb__bottom-row">
        <div class="tdb__card">
          <div class="tdb__card-header">
            <div class="tdb__card-title">Licences à renouveler (30 jours)</div>
            <span class="badge badge--warning">3 892 licences</span>
          </div>
          <div class="tdb__renewals">
            @for (r of renouvellements; track r.nom) {
              <div class="tdb__renewal-item">
                <div class="tdb__renewal-dot"
                  [class.tdb__renewal-dot--urgent]="r.joursRestants <= 7"
                  [class.tdb__renewal-dot--normal]="r.joursRestants > 7"
                ></div>
                <div class="tdb__renewal-body">
                  <div class="tdb__renewal-nom">{{ r.nom }}</div>
                  <div class="tdb__renewal-type">{{ r.type }}</div>
                </div>
                <div class="tdb__renewal-meta">
                  <div class="tdb__renewal-jours" [class.text-accent]="r.joursRestants <= 7">{{ r.joursRestants }}j</div>
                  <div class="tdb__renewal-montant">{{ r.montant }}</div>
                </div>
              </div>
            }
          </div>
          <a routerLink="/licences" class="tdb__card-link">Voir toutes les licences à renouveler</a>
        </div>

        <div class="tdb__card">
          <div class="tdb__card-header">
            <div class="tdb__card-title">Nouveaux établissements</div>
            <span class="badge badge--brand">Ce mois</span>
          </div>
          <div class="tdb__etablissements-recents">
            @for (e of etablissementsRecents; track e.nom) {
              <div class="tdb__etab-item" routerLink="/etablissements">
                <div class="tdb__etab-avatar">{{ e.initiales }}</div>
                <div class="tdb__etab-body">
                  <div class="tdb__etab-nom">{{ e.nom }}</div>
                  <div class="tdb__etab-meta">{{ e.ville }} &bull; {{ e.offre }}</div>
                </div>
                <span class="badge" [class.badge--success]="e.statut === 'Actif'" [class.badge--warning]="e.statut === 'En attente'">{{ e.statut }}</span>
              </div>
            }
          </div>
          <a routerLink="/etablissements" class="tdb__card-link">Voir tous les établissements</a>
        </div>

        <div class="tdb__card">
          <div class="tdb__card-header">
            <div class="tdb__card-title">Boîtiers hors ligne</div>
            <span class="badge badge--danger">{{ boitiersHorsLigne }} boîtiers</span>
          </div>
          <div class="tdb__boitiers-hl">
            <div class="tdb__boitiers-hl-visual">
              <svg viewBox="0 0 100 100" class="tdb__donut">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--c-border)" stroke-width="12"/>
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="var(--c-success)"
                  stroke-width="12"
                  stroke-dasharray="218 251"
                  stroke-dashoffset="63"
                  stroke-linecap="round"
                />
              </svg>
              <div class="tdb__donut-center">
                <div class="tdb__donut-pct">87,2%</div>
                <div class="tdb__donut-label">En ligne</div>
              </div>
            </div>
            <div class="tdb__donut-stats">
              <div class="tdb__donut-stat">
                <span class="tdb__donut-stat-dot" style="background: var(--c-success)"></span>
                <span>En ligne</span>
                <strong>11 203</strong>
              </div>
              <div class="tdb__donut-stat">
                <span class="tdb__donut-stat-dot" style="background: var(--c-danger)"></span>
                <span>Hors ligne</span>
                <strong>1 044</strong>
              </div>
              <div class="tdb__donut-stat">
                <span class="tdb__donut-stat-dot" style="background: var(--c-accent)"></span>
                <span>Maintenance</span>
                <strong>600</strong>
              </div>
            </div>
          </div>
          <a routerLink="/boitiers" class="tdb__card-link">Gérer les boîtiers</a>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .tdb {
      padding: 1.75rem 2rem;
      max-width: 1600px;
      animation: fadeIn var(--t-slow) ease;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* ── EN-TÊTE ─────────────────────────────────────────────── */
    .tdb__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .tdb__header-left { flex: 1; }

    .tdb__eyebrow {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      color: var(--c-success);
      letter-spacing: 0.04em;
      margin-bottom: 6px;
    }

    .tdb__title {
      font-family: var(--font-tight);
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--c-text);
      letter-spacing: -0.03em;
      margin-bottom: 4px;
    }

    .tdb__subtitle {
      font-size: 13px;
      color: var(--c-secondary);
    }

    .tdb__header-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .tdb__date {
      text-align: right;
      margin-right: 4px;
    }

    .tdb__date-label {
      font-size: 10px;
      color: var(--c-subtle);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .tdb__date-value {
      font-size: 12px;
      font-weight: 600;
      color: var(--c-secondary);
      margin-top: 2px;
    }

    /* ── SECTION LABEL ───────────────────────────────────────── */
    .tdb__section-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--c-subtle);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: -0.5rem;
    }

    /* ── ZONE 1 — KPI GRID ───────────────────────────────────── */
    .tdb__kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;

      @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 600px)  { grid-template-columns: 1fr; }
    }

    .tdb__kpi-card {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 1.25rem;
      box-shadow: var(--s-xs);
      transition: box-shadow var(--t-base), transform var(--t-base);
      cursor: default;

      &:hover {
        box-shadow: var(--s-md);
        transform: translateY(-1px);
      }
    }

    .tdb__kpi-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.875rem;
    }

    .tdb__kpi-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--r-md);
      background: color-mix(in srgb, var(--kpi-color) 10%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--kpi-color);

      ::ng-deep svg {
        width: 18px;
        height: 18px;
        stroke-width: 1.75;
      }
    }

    .tdb__kpi-tendance {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 7px;
      border-radius: var(--r-full);

      &--hausse {
        background: var(--c-success-bg);
        color: var(--c-success);
        border: 1px solid var(--c-success-border);
      }

      &--baisse {
        background: var(--c-danger-bg);
        color: var(--c-danger);
        border: 1px solid var(--c-danger-border);
      }
    }

    .tdb__kpi-valeur {
      font-family: var(--font-tight);
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--c-text);
      letter-spacing: -0.04em;
      line-height: 1;
      margin-bottom: 4px;
    }

    .tdb__kpi-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--c-text);
      margin-bottom: 2px;
    }

    .tdb__kpi-sous {
      font-size: 11px;
      color: var(--c-subtle);
    }

    /* ── ZONE 2 + 3 — MIDDLE ROW ─────────────────────────────── */
    .tdb__middle-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1rem;

      @media (max-width: 1000px) { grid-template-columns: 1fr; }
    }

    .tdb__chart-card {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 1.25rem;
      box-shadow: var(--s-xs);
    }

    .tdb__activity-card {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 1.25rem;
      box-shadow: var(--s-xs);
    }

    .tdb__chart-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .tdb__chart-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--c-text);
    }

    .tdb__chart-subtitle {
      font-size: 12px;
      color: var(--c-subtle);
      margin-top: 2px;
    }

    .tdb__chart-legend {
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }

    .tdb__legend-item {
      font-size: 11px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;

      &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 2px;
      }

      &--brand::before { background: var(--c-brand); }
      &--cyan::before  { background: var(--c-cyan); }
    }

    /* Graphique en barres */
    .tdb__bar-chart {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      height: 180px;
      padding-bottom: 24px;
      position: relative;
    }

    .tdb__bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }

    .tdb__bar-values {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      flex: 1;
      width: 100%;
    }

    .tdb__bar {
      flex: 1;
      border-radius: 4px 4px 0 0;
      min-height: 4px;
      transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;

      &--brand {
        background: var(--c-brand);
        opacity: 0.85;
        &:hover { opacity: 1; }
      }

      &--cyan {
        background: var(--c-cyan);
        opacity: 0.75;
        &:hover { opacity: 1; }
      }
    }

    .tdb__bar-label {
      font-size: 11px;
      color: var(--c-subtle);
      font-weight: 500;
      margin-top: 6px;
      white-space: nowrap;
    }

    /* Activité pédagogique */
    .tdb__activity-kpi {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 1.25rem;
    }

    .tdb__activity-kpi-item {
      background: var(--c-surface);
      border: 1px solid var(--c-border-light);
      border-radius: var(--r-md);
      padding: 10px 12px;
    }

    .tdb__activity-kpi-value {
      font-family: var(--font-tight);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--c-brand);
      letter-spacing: -0.03em;
    }

    .tdb__activity-kpi-label {
      font-size: 11px;
      color: var(--c-subtle);
      margin-top: 2px;
    }

    .tdb__matieres {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .tdb__matiere-item { display: flex; flex-direction: column; gap: 5px; }

    .tdb__matiere-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tdb__matiere-nom { font-size: 12px; font-weight: 500; color: var(--c-text); }
    .tdb__matiere-pct { font-size: 12px; font-weight: 700; color: var(--c-secondary); font-family: var(--font-tight); }

    /* ── ZONE 4 — ALERTES ─────────────────────────────────────── */
    .tdb__alertes-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tdb__alerte {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--r-lg);
      border: 1px solid;
      background: var(--c-white);

      @media (max-width: 550px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;

        .tdb__alerte-action {
          width: 100%;
        }
      }

      &--haute {
        border-color: var(--c-danger-border);
        background: var(--c-danger-bg);
      }

      &--normale {
        border-color: var(--c-accent-border);
        background: var(--c-accent-bg);
      }

      &--basse {
        border-color: var(--c-brand-border);
        background: var(--c-brand-bg);
      }
    }

    .tdb__alerte-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--r-md);
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      ::ng-deep svg {
        width: 18px;
        height: 18px;
        stroke-width: 1.75;
      }
    }

    .tdb__alerte-body { flex: 1; min-width: 0; }

    .tdb__alerte-message {
      font-size: 13px;
      font-weight: 600;
      color: var(--c-text);
    }

    .tdb__alerte-detail {
      font-size: 12px;
      color: var(--c-secondary);
      margin-top: 2px;
    }

    .tdb__alerte-action { flex-shrink: 0; }

    /* ── BOTTOM ROW — 3 CARTES ─────────────────────────────────── */
    .tdb__bottom-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;

      @media (max-width: 1000px) { grid-template-columns: 1fr 1fr; }
      @media (max-width: 650px)  { grid-template-columns: 1fr; }
    }

    .tdb__card {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 1.25rem;
      box-shadow: var(--s-xs);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .tdb__card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .tdb__card-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--c-text);
    }

    .tdb__card-link {
      font-size: 12px;
      color: var(--c-brand);
      font-weight: 500;
      text-decoration: none;
      margin-top: auto;

      &:hover { text-decoration: underline; }
    }

    /* Renouvellements */
    .tdb__renewals {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tdb__renewal-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid var(--c-border-light);

      &:last-child { border-bottom: none; }
    }

    .tdb__renewal-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;

      &--urgent { background: var(--c-accent); animation: pulse-dot 2s infinite; box-shadow: 0 0 0 3px var(--c-accent-bg); }
      &--normal { background: var(--c-brand); }
    }

    .tdb__renewal-body { flex: 1; min-width: 0; }

    .tdb__renewal-nom {
      font-size: 12px;
      font-weight: 600;
      color: var(--c-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tdb__renewal-type {
      font-size: 11px;
      color: var(--c-subtle);
    }

    .tdb__renewal-meta { text-align: right; flex-shrink: 0; }

    .tdb__renewal-jours {
      font-size: 12px;
      font-weight: 700;
      color: var(--c-secondary);
    }

    .tdb__renewal-montant {
      font-size: 11px;
      color: var(--c-subtle);
    }

    /* Établissements récents */
    .tdb__etablissements-recents {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tdb__etab-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      border-radius: var(--r-md);
      transition: background var(--t-fast);
      cursor: pointer;

      &:hover { background: var(--c-surface); }
    }

    .tdb__etab-avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--r-md);
      background: var(--c-brand-bg);
      border: 1px solid var(--c-brand-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: var(--c-brand);
      flex-shrink: 0;
    }

    .tdb__etab-body { flex: 1; min-width: 0; }

    .tdb__etab-nom {
      font-size: 12px;
      font-weight: 600;
      color: var(--c-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tdb__etab-meta { font-size: 11px; color: var(--c-subtle); }

    /* Donut boîtiers */
    .tdb__boitiers-hl {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .tdb__boitiers-hl-visual {
      position: relative;
      width: 80px;
      height: 80px;
      flex-shrink: 0;
    }

    .tdb__donut {
      width: 80px;
      height: 80px;
      transform: rotate(-90deg);
    }

    .tdb__donut-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .tdb__donut-pct {
      font-family: var(--font-tight);
      font-size: 14px;
      font-weight: 700;
      color: var(--c-success);
      letter-spacing: -0.02em;
    }

    .tdb__donut-label { font-size: 9px; color: var(--c-subtle); text-transform: uppercase; }

    .tdb__donut-stats {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
    }

    .tdb__donut-stat {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--c-secondary);

      strong {
        font-weight: 700;
        color: var(--c-text);
        margin-left: auto;
        font-family: var(--font-tight);
      }
    }

    .tdb__donut-stat-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
  `]
})
export class TableauBordComponent implements OnInit {

  readonly boitiersHorsLigne = 1_044;

  readonly kpisPrincipaux: KpiPrincipal[] = [
    {
      label: 'Établissements partenaires',
      valeur: '1 247',
      sousTexte: '17 en cours d\'intégration',
      tendance: 8.3,
      tendanceLabel: '+8,3% ce trimestre',
      couleur: '#314999',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    },
    {
      label: 'Parents inscrits',
      valeur: '48 391',
      sousTexte: '+1 247 nouveaux ce mois',
      tendance: 12.4,
      tendanceLabel: '+12,4% ce mois',
      couleur: '#40BBCC',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    },
    {
      label: 'Boîtiers déployés',
      valeur: '12 847',
      sousTexte: '87,2% connectés actuellement',
      tendance: 4.7,
      tendanceLabel: '+4,7% ce mois',
      couleur: '#314999',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="4" rx="2" ry="2"/><line x1="2" x2="22" y1="20" y2="20"/></svg>`
    },
    {
      label: 'Licences actives',
      valeur: '52 104',
      sousTexte: '3 892 à renouveler ce mois',
      tendance: 6.9,
      tendanceLabel: '+6,9% vs M-1',
      couleur: '#F1851F',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>`
    }
  ];

  readonly pointsGraphique: PointGraphique[] = [
    { mois: 'Mar', etablissements: 980,  parents: 35400, boitiers: 9800 },
    { mois: 'Avr', etablissements: 1050, parents: 38200, boitiers: 10500 },
    { mois: 'Mai', etablissements: 1100, parents: 40100, boitiers: 11000 },
    { mois: 'Juin',etablissements: 1170, parents: 43500, boitiers: 11700 },
    { mois: 'Juil',etablissements: 1210, parents: 46000, boitiers: 12100 },
    { mois: 'Août',etablissements: 1247, parents: 48391, boitiers: 12847 },
  ];

  readonly matieres = [
    { nom: 'Mathématiques', pct: 34.8 },
    { nom: 'Sciences & SVT', pct: 22.1 },
    { nom: 'Français & Langues', pct: 19.4 },
    { nom: 'Histoire-Géographie', pct: 14.7 },
    { nom: 'Autres', pct: 9.0 },
  ];

  readonly alertesPrioritaires: AlertePrioritaire[] = [
    {
      id: 'a1',
      type: 'renouvellement',
      urgence: 'haute',
      message: '847 licences expirent dans les 7 prochains jours',
      detail: 'Valeur à risque : 6 000 000 FCFA — Contacter les établissements concernés',
      actionLabel: 'Voir les licences'
    },
    {
      id: 'a2',
      type: 'boitier',
      urgence: 'normale',
      message: '210 boîtiers en attente de mise à jour',
      detail: 'Firmware v3.2.1 disponible — Déploiement automatique programmé pour demain',
      actionLabel: 'Gérer les boîtiers'
    },
    {
      id: 'a3',
      type: 'etablissement',
      urgence: 'basse',
      message: '3 nouveaux établissements en attente de validation',
      detail: 'Lycée Amadou Hampâté Bâ (Bamako), CEM Korofina Nord (Bamako), École Privée Laïque de Ségou',
      actionLabel: 'Valider'
    }
  ];

  readonly renouvellements = [
    { nom: 'Groupe Scolaire Arc-en-Ciel', type: 'Établissement Bulk', joursRestants: 3, montant: '1 570 000 FCFA' },
    { nom: 'École Fondamentale Banconi', type: 'Établissement Bulk', joursRestants: 5, montant: '1 180 000 FCFA' },
    { nom: 'Diallo Ibrahim', type: 'Parent Solo', joursRestants: 6, montant: '60 000 FCFA' },
    { nom: 'Coulibaly Fatou', type: 'Parent Solo', joursRestants: 12, montant: '60 000 FCFA' },
    { nom: 'Lycée Français Bamako', type: 'Institutionnel Pack', joursRestants: 18, montant: '2 750 000 FCFA' },
  ];

  readonly etablissementsRecents = [
    { nom: 'Lycée Mamadou Konaté', ville: 'Bamako', offre: 'Enterprise', statut: 'Actif', initiales: 'LM' },
    { nom: 'CEM Hamdallaye', ville: 'Bamako', offre: 'Standard', statut: 'Actif', initiales: 'CH' },
    { nom: 'École Privée Excellence', ville: 'Mopti', offre: 'Standard', statut: 'En attente', initiales: 'EP' },
    { nom: 'Groupe Scolaire Lumière', ville: 'Ségou', offre: 'Institutionnel', statut: 'En attente', initiales: 'GL' },
  ];

  getAlerteIcon(type: AlertePrioritaire['type']): string {
    const icons: Record<string, string> = {
      renouvellement: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F1851F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
      boitier: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="4" rx="2" ry="2"/><line x1="2" x2="22" y1="20" y2="20"/></svg>`,
      etablissement: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#314999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
      info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#314999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    };
    return icons[type] ?? icons['info'];
  }

  private router = inject(Router);
  private toastService = inject(ToastService);

  refreshData() {
    this.toastService.show('Données du tableau de bord actualisées avec succès.', 'success');
  }

  downloadReport() {
    this.toastService.show('Génération du rapport d\'activité en cours...', 'info');
  }

  onAlerteAction(alerte: AlertePrioritaire) {
    if (alerte.type === 'renouvellement') {
      this.router.navigate(['/licences']);
    } else if (alerte.type === 'boitier') {
      this.router.navigate(['/boitiers']);
    } else if (alerte.type === 'etablissement') {
      this.router.navigate(['/etablissements']);
    } else {
      this.toastService.show(alerte.message, 'info');
    }
  }

  ngOnInit() {}
}
