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
          <div class="tdb__eyebrow">Bonjour Super Admin 👋</div>
          <h1 class="tdb__title">Tableau de Bord</h1>
          <p class="tdb__subtitle">Pilotage global de l'écosystème éducatif Alternia</p>
        </div>
        <div class="tdb__header-right">
          <div class="tdb__date">
            <div class="tdb__date-label">Mis à jour</div>
            <div class="tdb__date-value">13 août 2026 - 10h34</div>
          </div>
          <button class="btn btn--secondary btn--sm" (click)="refreshData()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            Actualiser
          </button>
          <button class="btn btn--secondary btn--sm" (click)="downloadReport()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Rapport
          </button>
        </div>
      </div>

      <!-- ── ZONE 1 — 4 KPIs ──────────────────────────────────── -->
      <div class="tdb__kpi-grid">
        @for (kpi of kpisPrincipaux; track kpi.label) {
          <div class="card tdb__kpi-card" [style.--kpi-color]="kpi.couleur">
            <div class="tdb__kpi-top">
              <div class="tdb__kpi-icon" [innerHTML]="kpi.icon | safeHtml"></div>
              <div class="tdb__kpi-label">{{ kpi.label }}</div>
            </div>
            <div class="tdb__kpi-valeur">{{ kpi.valeur }}</div>
            <div class="tdb__kpi-sous">{{ kpi.sousTexte }}</div>
            <div class="tdb__kpi-tendance" [class.tdb__kpi-tendance--hausse]="kpi.tendance > 0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
              </svg>
              {{ kpi.tendanceLabel }}
            </div>
          </div>
        }
      </div>

      <!-- ── ZONE 2 — MIDDLE ROW ──────────────────────────────── -->
      <div class="tdb__middle-row">

        <!-- LEFT: Area Chart with Donut Overlay -->
        <div class="card tdb__chart-card">
          <div class="tdb__chart-header">
            <div>
              <div class="tdb__chart-title">Croissance de la plateforme</div>
              <div class="tdb__chart-subtitle">Établissements et parents inscrits — 6 derniers mois</div>
            </div>
            <button class="btn btn--ghost btn--icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
          </div>

          <div class="tdb__chart-visual">
            <div class="tdb__chart-legend-top">
              <span class="tdb__legend-item"><span class="dot" style="background: var(--c-cyan)"></span> Établissements</span>
              <span class="tdb__legend-item"><span class="dot" style="background: var(--c-accent)"></span> Parents</span>
              <span class="tdb__legend-item"><span class="dot" style="background: var(--c-brand)"></span> Boîtiers</span>
            </div>

            <div class="tdb__area-chart-container">
              <div class="tdb__grid-lines">
                 <span>60K</span><span>50K</span><span>40K</span><span>30K</span><span>20K</span><span>10K</span><span>0</span>
              </div>
              <div class="tdb__area-svg-wrapper">
                 <svg viewBox="0 0 600 250" preserveAspectRatio="none" class="tdb__area-svg">
                   <defs>
                     <linearGradient id="gradBrand" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stop-color="var(--c-brand)" stop-opacity="0.3"/>
                       <stop offset="100%" stop-color="var(--c-brand)" stop-opacity="0"/>
                     </linearGradient>
                     <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stop-color="var(--c-cyan)" stop-opacity="0.3"/>
                       <stop offset="100%" stop-color="var(--c-cyan)" stop-opacity="0"/>
                     </linearGradient>
                     <linearGradient id="gradAccent" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stop-color="var(--c-accent)" stop-opacity="0.3"/>
                       <stop offset="100%" stop-color="var(--c-accent)" stop-opacity="0"/>
                     </linearGradient>
                   </defs>

                   <!-- Cyan Curve (Etablissements) -->
                   <path d="M0,250 L0,180 C100,100 200,200 300,140 C400,60 500,100 600,40 L600,250 Z" fill="url(#gradCyan)"/>
                   <path d="M0,180 C100,100 200,200 300,140 C400,60 500,100 600,40" fill="none" stroke="var(--c-cyan)" stroke-width="3" vector-effect="non-scaling-stroke"/>

                   <!-- Accent Curve (Parents) -->
                   <path d="M0,250 L0,200 C100,150 200,220 300,180 C400,120 500,160 600,100 L600,250 Z" fill="url(#gradAccent)"/>
                   <path d="M0,200 C100,150 200,220 300,180 C400,120 500,160 600,100" fill="none" stroke="var(--c-accent)" stroke-width="3" vector-effect="non-scaling-stroke"/>

                   <!-- Brand Curve (Boitiers) -->
                   <path d="M0,250 L0,220 C100,180 200,240 300,200 C400,160 500,180 600,140 L600,250 Z" fill="url(#gradBrand)"/>
                   <path d="M0,220 C100,180 200,240 300,200 C400,160 500,180 600,140" fill="none" stroke="var(--c-brand)" stroke-width="3" vector-effect="non-scaling-stroke"/>
                 </svg>
                 
                 <!-- Glassmorphism Donut Overlay -->
                 <div class="tdb__donut-overlay">
                   <div class="glass-donut">
                     <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="20"/>
                        <circle cx="50" cy="50" r="32" fill="none" stroke="var(--c-cyan)" stroke-width="20" stroke-dasharray="70 201" stroke-dashoffset="0" stroke-linecap="round"/>
                        <circle cx="50" cy="50" r="32" fill="none" stroke="var(--c-accent)" stroke-width="20" stroke-dasharray="50 201" stroke-dashoffset="-80" stroke-linecap="round"/>
                        <circle cx="50" cy="50" r="32" fill="none" stroke="var(--c-brand)" stroke-width="20" stroke-dasharray="40 201" stroke-dashoffset="-140" stroke-linecap="round"/>
                     </svg>
                     <div class="glass-donut-center"></div>
                   </div>
                 </div>
              </div>
            </div>

            <div class="tdb__area-x-axis">
              <span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span><span>Juil</span><span>Août</span>
            </div>
          </div>

          <div class="tdb__chart-bottom-kpis">
             <div class="tdb__cb-kpi">
               <div class="tdb__cb-label">Établissements</div>
               <div class="tdb__cb-main">
                 <span class="tdb__cb-val">1 247</span>
                 <svg class="tdb__cb-sparkline" viewBox="0 0 50 15" preserveAspectRatio="none"><path d="M0,10 L10,12 L20,5 L30,8 L40,2 L50,0" fill="none" stroke="var(--c-brand)" stroke-width="2" stroke-linecap="round"/></svg>
               </div>
               <div class="tdb__cb-trend tdb__cb-trend--up">+ 0,3% au trimestre</div>
             </div>
             
             <div class="tdb__cb-kpi">
               <div class="tdb__cb-label">Parents</div>
               <div class="tdb__cb-main">
                 <span class="tdb__cb-val">48 391</span>
                 <svg class="tdb__cb-sparkline" viewBox="0 0 50 15" preserveAspectRatio="none"><path d="M0,12 L10,8 L20,10 L30,4 L40,6 L50,0" fill="none" stroke="var(--c-cyan)" stroke-width="2" stroke-linecap="round"/></svg>
               </div>
               <div class="tdb__cb-trend tdb__cb-trend--up">+ 12,4% ce mois</div>
             </div>

             <div class="tdb__cb-kpi">
               <div class="tdb__cb-label">Écart</div>
               <div class="tdb__cb-main">
                 <span class="tdb__cb-val">47 144</span>
                 <svg class="tdb__cb-sparkline" viewBox="0 0 50 15" preserveAspectRatio="none"><path d="M0,8 L10,10 L20,4 L30,6 L40,0 L50,2" fill="none" stroke="var(--c-brand)" stroke-width="2" stroke-linecap="round"/></svg>
               </div>
               <div class="tdb__cb-trend tdb__cb-trend--up">+ 11,1% vs le mois dernier</div>
             </div>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="tdb__right-col">
          
          <!-- Activity Card -->
          <div class="card tdb__activity-card">
            <div class="tdb__chart-header">
              <div>
                <div class="tdb__chart-title">Activité pédagogique</div>
                <div class="tdb__chart-subtitle">Matières les plus consultées ce mois</div>
              </div>
            </div>
            
            <div class="tdb__activity-content">
              <div class="tdb__activity-donut">
                <svg viewBox="0 0 100 100" class="tdb__donut-svg">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--c-border-light)" stroke-width="10"/>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--c-brand)" stroke-width="10" stroke-dasharray="142 264" stroke-dashoffset="0" stroke-linecap="round"/>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--c-cyan)" stroke-width="10" stroke-dasharray="58 264" stroke-dashoffset="-150" stroke-linecap="round"/>
                </svg>
                <div class="tdb__donut-center-text">
                  <strong>54,2%</strong>
                  <span>Questions traitées de maths</span>
                </div>
              </div>
              
              <div class="tdb__matieres-list">
                @for (m of matieres; track m.nom) {
                  <div class="tdb__matiere-item">
                    <div class="tdb__matiere-header">
                      <span class="tdb__matiere-nom">{{ m.nom }}</span>
                      <span class="tdb__matiere-pct">{{ m.pct }}%</span>
                    </div>
                    <div class="progress">
                      <div class="progress__bar"
                           [class.progress__bar--brand]="m.nom === 'Mathématiques'"
                           [class.progress__bar--cyan]="m.nom !== 'Mathématiques'"
                           [style.width.%]="m.pct"></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
          
          <!-- Mini Cards Row -->
          <div class="tdb__mini-cards-row">
            <div class="card tdb__mini-card">
              <div class="tdb__mini-icon" style="color: var(--c-brand); background: var(--c-brand-bg);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div class="tdb__mini-label">Utilisation moyenne / boîtier</div>
              <div class="tdb__mini-val">4.2h/j</div>
              <div class="tdb__cb-trend tdb__cb-trend--up">+0,5% vs M-1</div>
            </div>
            
            <div class="card tdb__mini-card">
              <div class="tdb__mini-icon" style="color: var(--c-cyan); background: var(--c-cyan-bg);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div class="tdb__mini-label">Questions traitées ce mois</div>
              <div class="tdb__mini-val">54.2M</div>
              <div class="tdb__cb-trend tdb__cb-trend--up">+5,5% vs M-1</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tdb {
      padding: 2rem;
      max-width: 1600px;
      margin: 0 auto;
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

    .tdb__eyebrow {
      font-size: 13px;
      font-weight: 600;
      color: var(--c-text);
      margin-bottom: 4px;
    }

    .tdb__title {
      font-family: var(--font-tight);
      font-size: 2rem;
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
      gap: 12px;
      flex-shrink: 0;
    }

    .tdb__date {
      text-align: right;
      margin-right: 8px;
    }

    .tdb__date-label {
      font-size: 10px;
      color: var(--c-subtle);
    }
    
    .tdb__date-value {
      font-size: 12px;
      font-weight: 600;
      color: var(--c-secondary);
      margin-top: 2px;
    }

    /* ── ZONE 1 — KPI GRID ───────────────────────────────────── */
    .tdb__kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;

      @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 600px)  { grid-template-columns: 1fr; }
    }

    .tdb__kpi-card {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
    }

    .tdb__kpi-top {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 1rem;
    }

    .tdb__kpi-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--r-md);
      background: color-mix(in srgb, var(--kpi-color) 12%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--kpi-color);

      ::ng-deep svg {
        width: 20px;
        height: 20px;
        stroke-width: 1.75;
      }
    }

    .tdb__kpi-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--c-text);
      line-height: 1.3;
    }

    .tdb__kpi-valeur {
      font-family: var(--font-tight);
      font-size: 2rem;
      font-weight: 700;
      color: var(--c-text);
      letter-spacing: -0.04em;
      line-height: 1;
      margin-bottom: 6px;
      text-align: center;
    }

    .tdb__kpi-sous {
      font-size: 12px;
      color: var(--c-secondary);
      text-align: center;
      margin-bottom: 1rem;
    }

    .tdb__kpi-tendance {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      align-self: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: var(--r-full);
      background: var(--c-surface-alt);
      color: var(--c-secondary);

      &--hausse {
        background: var(--c-success-bg);
        color: var(--c-success);
      }
    }

    /* ── ZONE 2 — MIDDLE ROW ─────────────────────────────────── */
    .tdb__middle-row {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: 1.5rem;

      @media (max-width: 1100px) { grid-template-columns: 1fr; }
    }

    .tdb__chart-card {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
    }

    .tdb__chart-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .tdb__chart-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--c-text);
    }

    .tdb__chart-subtitle {
      font-size: 12px;
      color: var(--c-subtle);
      margin-top: 4px;
    }

    .tdb__chart-visual {
      display: flex;
      flex-direction: column;
      flex: 1;
      position: relative;
    }

    .tdb__chart-legend-top {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .tdb__legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      color: var(--c-secondary);

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
    }

    .tdb__area-chart-container {
      position: relative;
      height: 250px;
      margin-bottom: 10px;
    }

    .tdb__grid-lines {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      pointer-events: none;

      span {
        font-size: 10px;
        color: var(--c-subtle);
        transform: translateY(-50%);
        border-bottom: 1px dashed var(--c-border-light);
        width: 100%;
        text-align: left;
        line-height: 0;
        padding-bottom: 1px;
      }
    }

    .tdb__area-svg-wrapper {
      position: absolute;
      left: 30px; 
      right: 0;
      top: 0;
      bottom: 0;
      overflow: hidden;
    }

    .tdb__area-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .tdb__donut-overlay {
      position: absolute;
      left: 15%;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }

    .glass-donut {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
        position: absolute;
        inset: 0;
      }
    }

    .glass-donut-center {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: radial-gradient(circle at top left, rgba(255,255,255,0.9), rgba(255,255,255,0.4));
      box-shadow: inset 0 2px 4px rgba(255,255,255,0.8), 0 4px 8px rgba(0,0,0,0.05);
      z-index: 2;
    }

    .tdb__area-x-axis {
      display: flex;
      justify-content: space-between;
      margin-left: 30px;
      padding-top: 8px;
      border-top: 1px solid var(--c-border);
      
      span {
        font-size: 11px;
        color: var(--c-subtle);
        font-weight: 500;
      }
    }

    .tdb__chart-bottom-kpis {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--c-border-light);
    }

    .tdb__cb-kpi {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .tdb__cb-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--c-text);
    }

    .tdb__cb-main {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .tdb__cb-val {
      font-family: var(--font-tight);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--c-text);
    }

    .tdb__cb-sparkline {
      width: 50px;
      height: 20px;
      overflow: visible;
    }

    .tdb__cb-trend {
      font-size: 11px;
      font-weight: 600;
      color: var(--c-success);

      &::before {
        content: '↗ ';
        margin-right: 2px;
      }
    }

    /* ── RIGHT COLUMN ────────────────────────────────────────── */
    .tdb__right-col {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .tdb__activity-card {
      padding: 1.5rem;
      flex: 1;
    }

    .tdb__activity-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1.5rem;
      margin-top: 1rem;

      @media (max-width: 600px) {
        flex-direction: column;
      }
    }

    .tdb__activity-donut {
      position: relative;
      width: 130px;
      height: 130px;
      flex-shrink: 0;

      .tdb__donut-svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }
    }

    .tdb__donut-center-text {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 10px;

      strong {
        font-family: var(--font-tight);
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--c-text);
        line-height: 1.1;
      }
      span {
        font-size: 9px;
        color: var(--c-subtle);
        line-height: 1.1;
        margin-top: 2px;
      }
    }

    .tdb__matieres-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
      min-width: 0;
    }

    .tdb__matiere-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .tdb__matiere-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tdb__matiere-nom { font-size: 12px; font-weight: 600; color: var(--c-text); }
    .tdb__matiere-pct { font-size: 12px; font-weight: 700; color: var(--c-secondary); font-family: var(--font-tight); }

    .tdb__mini-cards-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }

    .tdb__mini-card {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tdb__mini-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--r-md);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2px;
    }

    .tdb__mini-label {
      font-size: 12px;
      color: var(--c-secondary);
      line-height: 1.3;
    }

    .tdb__mini-val {
      font-family: var(--font-tight);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--c-text);
      line-height: 1;
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
