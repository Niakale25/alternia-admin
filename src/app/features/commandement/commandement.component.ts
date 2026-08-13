import { Component, signal, OnInit } from '@angular/core';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'incident' | 'maintenance';
  uptime: string;
  latency?: string;
}

interface KpiMetric {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
  trendLabel?: string;
  color?: string;
  icon: string;
}

interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
  service: string;
}

interface ActivityPoint {
  label: string;
  requetes: number;
  connexions: number;
}

@Component({
  selector: 'app-commandement',
  standalone: true,
  imports: [],
  template: `
    <div class="commandement">

      <!-- PAGE HEADER -->
      <div class="cmd-header">
        <div class="cmd-header__left">
          <div class="cmd-header__eyebrow">
            <span class="status-dot status-dot--online"></span>
            Plateforme opérationnelle
          </div>
          <h1 class="cmd-header__title">Centre de Commandement</h1>
          <p class="cmd-header__subtitle">
            Supervision globale de l'infrastructure Alternia &mdash; Mise à jour il y a 24 secondes
          </p>
        </div>
        <div class="cmd-header__right">
          <div class="cmd-header__time">
            <div class="cmd-header__time-label">Aujourd'hui</div>
            <div class="cmd-header__time-value">12 août 2026 &mdash; 17:51 UTC+1</div>
          </div>
          <button class="btn btn--secondary btn--sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            Actualiser
          </button>
          <button class="btn btn--primary btn--sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Rapport
          </button>
        </div>
      </div>

      <!-- SERVICE STATUS BAR (Cloudflare-inspired) -->
      <div class="service-bar">
        <div class="service-bar__header">
          <span class="service-bar__title">État des services</span>
          <a href="#" class="service-bar__link">Voir la page de statut</a>
        </div>
        <div class="service-bar__grid">
          @for (svc of services; track svc.name) {
            <div class="service-item" [attr.data-status]="svc.status">
              <div class="service-item__dot" [class]="'service-item__dot--' + svc.status"></div>
              <div class="service-item__info">
                <div class="service-item__name">{{ svc.name }}</div>
                <div class="service-item__meta">
                  <span class="service-item__uptime">{{ svc.uptime }}</span>
                  @if (svc.latency) {
                    <span class="service-item__latency">{{ svc.latency }}</span>
                  }
                </div>
              </div>
              <div class="service-item__status-label" [class]="'service-item__status-label--' + svc.status">
                {{ svc.status === 'operational' ? 'Opérationnel' : svc.status === 'degraded' ? 'Dégradé' : svc.status === 'incident' ? 'Incident' : 'Maintenance' }}
              </div>
            </div>
          }
        </div>
      </div>

      <!-- KPI GRID -->
      <div class="kpi-section">
        <div class="kpi-grid--cmd">
          @for (kpi of kpis; track kpi.label) {
            <div class="kpi-card">
              <div class="kpi-card__header">
                <div class="kpi-card__icon" [style.background]="kpi.color + '15'">
                  <span [innerHTML]="kpi.icon" [style.color]="kpi.color"></span>
                </div>
                @if (kpi.trend !== undefined) {
                  <div class="kpi-card__trend" [class.kpi-card__trend--up]="kpi.trend! >= 0" [class.kpi-card__trend--down]="kpi.trend! < 0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      @if (kpi.trend! >= 0) {
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                      } @else {
                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
                      }
                    </svg>
                    {{ kpi.trendLabel }}
                  </div>
                }
              </div>
              <div class="kpi-card__value">{{ kpi.value }}</div>
              <div class="kpi-card__label">{{ kpi.label }}</div>
              @if (kpi.sub) {
                <div class="kpi-card__sub">{{ kpi.sub }}</div>
              }
            </div>
          }
        </div>
      </div>

      <!-- CHARTS ROW -->
      <div class="charts-row">

        <!-- Activity Chart -->
        <div class="chart-card chart-card--large">
          <div class="chart-card__header">
            <div>
              <div class="chart-card__title">Activité de la plateforme</div>
              <div class="chart-card__subtitle">Requêtes IA et connexions — 7 derniers jours</div>
            </div>
            <div class="chart-card__tabs">
              <button class="chart-tab chart-tab--active">7j</button>
              <button class="chart-tab">30j</button>
              <button class="chart-tab">90j</button>
            </div>
          </div>

          <!-- SVG Chart -->
          <div class="chart-area">
            <svg width="100%" height="220" viewBox="0 0 800 220" preserveAspectRatio="none" class="activity-chart">
              <defs>
                <linearGradient id="grad-brand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#314999" stop-opacity="0.15"/>
                  <stop offset="100%" stop-color="#314999" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="grad-cyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#40BBCC" stop-opacity="0.15"/>
                  <stop offset="100%" stop-color="#40BBCC" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <!-- Grid lines -->
              <line x1="0" y1="55" x2="800" y2="55" stroke="#E2E8F0" stroke-width="1"/>
              <line x1="0" y1="110" x2="800" y2="110" stroke="#E2E8F0" stroke-width="1"/>
              <line x1="0" y1="165" x2="800" y2="165" stroke="#E2E8F0" stroke-width="1"/>
              <!-- Requêtes area -->
              <path d="M0,160 C57,150 114,80 171,90 C228,100 285,50 342,40 C399,30 456,70 513,55 C570,40 627,20 684,30 C741,40 770,45 800,35 L800,220 L0,220 Z" fill="url(#grad-brand)"/>
              <!-- Requêtes line -->
              <path d="M0,160 C57,150 114,80 171,90 C228,100 285,50 342,40 C399,30 456,70 513,55 C570,40 627,20 684,30 C741,40 770,45 800,35" fill="none" stroke="#314999" stroke-width="2.5" stroke-linecap="round"/>
              <!-- Connexions area -->
              <path d="M0,180 C57,175 114,145 171,150 C228,155 285,120 342,115 C399,110 456,130 513,125 C570,120 627,100 684,108 C741,116 770,112 800,105 L800,220 L0,220 Z" fill="url(#grad-cyan)"/>
              <!-- Connexions line -->
              <path d="M0,180 C57,175 114,145 171,150 C228,155 285,120 342,115 C399,110 456,130 513,125 C570,120 627,100 684,108 C741,116 770,112 800,105" fill="none" stroke="#40BBCC" stroke-width="2" stroke-linecap="round"/>
              <!-- X-axis labels -->
              <text x="0" y="215" fill="#94A3B8" font-size="10" font-family="Inter">Lun</text>
              <text x="110" y="215" fill="#94A3B8" font-size="10" font-family="Inter">Mar</text>
              <text x="225" y="215" fill="#94A3B8" font-size="10" font-family="Inter">Mer</text>
              <text x="340" y="215" fill="#94A3B8" font-size="10" font-family="Inter">Jeu</text>
              <text x="455" y="215" fill="#94A3B8" font-size="10" font-family="Inter">Ven</text>
              <text x="570" y="215" fill="#94A3B8" font-size="10" font-family="Inter">Sam</text>
              <text x="685" y="215" fill="#94A3B8" font-size="10" font-family="Inter">Dim</text>
            </svg>
            <div class="chart-legend">
              <div class="chart-legend__item">
                <span class="chart-legend__dot" style="background:#314999"></span>
                Requêtes IA
              </div>
              <div class="chart-legend__item">
                <span class="chart-legend__dot" style="background:#40BBCC"></span>
                Connexions boîtiers
              </div>
            </div>
          </div>
        </div>

        <!-- Donut: Boîtiers -->
        <div class="chart-card">
          <div class="chart-card__header">
            <div>
              <div class="chart-card__title">Boîtiers</div>
              <div class="chart-card__subtitle">Répartition par statut</div>
            </div>
          </div>
          <div class="donut-wrap">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="58" fill="none" stroke="#E2E8F0" stroke-width="18"/>
              <circle cx="80" cy="80" r="58" fill="none" stroke="#22c55e" stroke-width="18"
                stroke-dasharray="230 134" stroke-dashoffset="0" stroke-linecap="round"
                transform="rotate(-90 80 80)"/>
              <circle cx="80" cy="80" r="58" fill="none" stroke="#ef4444" stroke-width="18"
                stroke-dasharray="44 320" stroke-dashoffset="-230" stroke-linecap="round"
                transform="rotate(-90 80 80)"/>
              <circle cx="80" cy="80" r="58" fill="none" stroke="#40BBCC" stroke-width="18"
                stroke-dasharray="27 337" stroke-dashoffset="-274" stroke-linecap="round"
                transform="rotate(-90 80 80)"/>
              <circle cx="80" cy="80" r="58" fill="none" stroke="#F1851F" stroke-width="18"
                stroke-dasharray="13 351" stroke-dashoffset="-301" stroke-linecap="round"
                transform="rotate(-90 80 80)"/>
              <text x="80" y="76" text-anchor="middle" font-size="22" font-weight="700" fill="#1E293B" font-family="Inter Tight">12 847</text>
              <text x="80" y="92" text-anchor="middle" font-size="10" fill="#64748B" font-family="Inter">total déployés</text>
            </svg>
            <div class="donut-legend">
              <div class="donut-legend__item">
                <span style="background:#22c55e"></span>
                <span>En ligne <strong>11 203</strong></span>
              </div>
              <div class="donut-legend__item">
                <span style="background:#ef4444"></span>
                <span>Hors ligne <strong>892</strong></span>
              </div>
              <div class="donut-legend__item">
                <span style="background:#40BBCC"></span>
                <span>Sync. <strong>542</strong></span>
              </div>
              <div class="donut-legend__item">
                <span style="background:#F1851F"></span>
                <span>Maintenance <strong>210</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BOTTOM ROW: Alerts + Regions + Deployments -->
      <div class="bottom-row">

        <!-- Critical Alerts -->
        <div class="alerts-card">
          <div class="section-card-header">
            <div>
              <div class="section-card-title">Alertes actives</div>
              <div class="section-card-subtitle">3 alertes requièrent votre attention</div>
            </div>
            <span class="badge badge--warning">3 actives</span>
          </div>
          <div class="alerts-list">
            @for (alert of alerts; track alert.id) {
              <div class="alert-item" [class]="'alert-item--' + alert.type">
                <div class="alert-item__dot" [class]="'alert-item__dot--' + alert.type"></div>
                <div class="alert-item__body">
                  <div class="alert-item__message">{{ alert.message }}</div>
                  <div class="alert-item__meta">
                    <span class="tag">{{ alert.service }}</span>
                    <span class="text-subtle text-xs">{{ alert.time }}</span>
                  </div>
                </div>
                <button class="btn btn--ghost btn--sm">Voir</button>
              </div>
            }
          </div>
        </div>

        <!-- Recent Deployments -->
        <div class="deploys-card">
          <div class="section-card-header">
            <div>
              <div class="section-card-title">Déploiements récents</div>
              <div class="section-card-subtitle">Historique des 5 dernières opérations</div>
            </div>
            <button class="btn btn--ghost btn--sm">Voir tout</button>
          </div>
          <div class="deploy-list">
            @for (deploy of deployments; track deploy.version) {
              <div class="deploy-item">
                <div class="deploy-item__icon" [class]="'deploy-item__icon--' + deploy.status">
                  @if (deploy.status === 'success') {
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  } @else if (deploy.status === 'running') {
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin-anim"><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/><line x1="2" x2="6" y1="12" y2="12"/><line x1="18" x2="22" y1="12" y2="12"/><line x1="4.93" x2="7.76" y1="19.07" y2="16.24"/><line x1="16.24" x2="19.07" y1="7.76" y2="4.93"/></svg>
                  } @else {
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                  }
                </div>
                <div class="deploy-item__body">
                  <div class="deploy-item__name">{{ deploy.name }}</div>
                  <div class="deploy-item__meta">
                    <code class="deploy-item__version">{{ deploy.version }}</code>
                    <span class="text-subtle text-xs">{{ deploy.time }}</span>
                  </div>
                </div>
                @if (deploy.devices) {
                  <div class="deploy-item__devices">{{ deploy.devices }} appareils</div>
                }
              </div>
            }
          </div>
        </div>

        <!-- IA Performance -->
        <div class="ia-card">
          <div class="section-card-header">
            <div>
              <div class="section-card-title">Performance IA</div>
              <div class="section-card-subtitle">Modèles actifs en temps réel</div>
            </div>
            <span class="badge badge--info">4 modèles actifs</span>
          </div>
          <div class="ia-list">
            @for (model of iaModels; track model.name) {
              <div class="ia-item">
                <div class="ia-item__header">
                  <div class="ia-item__name">{{ model.name }}</div>
                  <div class="ia-item__uptime" [class.ia-item__uptime--ok]="model.uptime >= 99">{{ model.uptime }}%</div>
                </div>
                <div class="ia-item__metrics">
                  <div class="ia-item__metric">
                    <span class="ia-item__metric-label">Latence</span>
                    <span class="ia-item__metric-value text-cyan">{{ model.latency }}ms</span>
                  </div>
                  <div class="ia-item__metric">
                    <span class="ia-item__metric-label">Erreurs</span>
                    <span class="ia-item__metric-value" [class.text-danger]="model.errors > 1">{{ model.errors }}%</span>
                  </div>
                  <div class="ia-item__metric">
                    <span class="ia-item__metric-label">Req/min</span>
                    <span class="ia-item__metric-value">{{ model.rpm }}</span>
                  </div>
                </div>
                <div class="progress" style="margin-top:6px">
                  <div class="progress__bar progress__bar--cyan" [style.width.%]="model.uptime"></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .commandement {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      animation: fadeIn 0.3s ease;
      max-width: 1600px;
    }

    /* ── HEADER ──────────────────────────────────────────────── */
    .cmd-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .cmd-header__eyebrow {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--c-success);
      margin-bottom: 6px;
    }

    .cmd-header__title {
      font-family: var(--font-tight);
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--c-text);
      letter-spacing: -0.04em;
      margin-bottom: 4px;
    }

    .cmd-header__subtitle {
      font-size: 13px;
      color: var(--c-secondary);
    }

    .cmd-header__right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .cmd-header__time {
      text-align: right;
      margin-right: 4px;
    }

    .cmd-header__time-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--c-subtle);
    }

    .cmd-header__time-value {
      font-size: 12px;
      font-weight: 500;
      color: var(--c-text);
    }

    /* ── SERVICE STATUS BAR ──────────────────────────────────── */
    .service-bar {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 1rem 1.25rem;
    }

    .service-bar__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.875rem;
    }

    .service-bar__title {
      font-size: 12px;
      font-weight: 600;
      color: var(--c-text);
    }

    .service-bar__link {
      font-size: 12px;
      color: var(--c-brand);
      font-weight: 500;
      text-decoration: none;

      &:hover { text-decoration: underline; }
    }

    .service-bar__grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.75rem;

      @media (max-width: 1200px) { grid-template-columns: repeat(3, 1fr); }
      @media (max-width: 700px)  { grid-template-columns: repeat(2, 1fr); }
    }

    .service-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: var(--r-md);
      border: 1px solid var(--c-border-light);
      background: var(--c-surface);
    }

    .service-item__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;

      &--operational { background: var(--c-success); animation: pulse-dot 3s infinite; }
      &--degraded    { background: var(--c-accent); animation: pulse-dot 1.5s infinite; }
      &--incident    { background: var(--c-danger); animation: pulse-dot 1s infinite; }
      &--maintenance { background: var(--c-muted); }
    }

    .service-item__info { flex: 1; min-width: 0; }

    .service-item__name {
      font-size: 11px;
      font-weight: 600;
      color: var(--c-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .service-item__meta {
      display: flex;
      gap: 6px;
      align-items: center;
      margin-top: 1px;
    }

    .service-item__uptime {
      font-size: 10px;
      color: var(--c-subtle);
    }

    .service-item__latency {
      font-size: 10px;
      color: var(--c-cyan);
      font-family: var(--font-mono);
    }

    .service-item__status-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      flex-shrink: 0;

      &--operational { color: var(--c-success); }
      &--degraded    { color: var(--c-accent); }
      &--incident    { color: var(--c-danger); }
      &--maintenance { color: var(--c-subtle); }
    }

    /* ── KPI GRID ─────────────────────────────────────────────── */
    .kpi-grid--cmd {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(195px, 1fr));
      gap: 0.875rem;
    }

    .kpi-card {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 1.125rem;
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: box-shadow var(--t-base), transform var(--t-base);
      animation: scaleIn 0.3s ease;

      &:hover {
        box-shadow: var(--s-md);
        transform: translateY(-1px);
      }
    }

    .kpi-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .kpi-card__icon {
      width: 34px;
      height: 34px;
      border-radius: var(--r-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      ::ng-deep svg {
        width: 16px;
        height: 16px;
        stroke-width: 2;
      }
    }

    .kpi-card__trend {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: var(--r-full);

      &--up   { color: var(--c-success); background: var(--c-success-bg); }
      &--down { color: var(--c-danger);  background: var(--c-danger-bg); }
    }

    .kpi-card__value {
      font-family: var(--font-tight);
      font-size: 1.625rem;
      font-weight: 800;
      color: var(--c-text);
      letter-spacing: -0.04em;
      line-height: 1;
    }

    .kpi-card__label {
      font-size: 12px;
      font-weight: 500;
      color: var(--c-secondary);
    }

    .kpi-card__sub {
      font-size: 11px;
      color: var(--c-subtle);
      margin-top: 1px;
    }

    /* ── CHARTS ROW ──────────────────────────────────────────── */
    .charts-row {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 1rem;

      @media (max-width: 1100px) { grid-template-columns: 1fr; }
    }

    .chart-card {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 1.25rem;
    }

    .chart-card--large { /* no extra styles needed */ }

    .chart-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .chart-card__title {
      font-size: 14px;
      font-weight: 600;
      color: var(--c-text);
    }

    .chart-card__subtitle {
      font-size: 12px;
      color: var(--c-subtle);
      margin-top: 2px;
    }

    .chart-card__tabs {
      display: flex;
      gap: 2px;
      background: var(--c-surface);
      padding: 3px;
      border-radius: var(--r-md);
      border: 1px solid var(--c-border);
    }

    .chart-tab {
      padding: 4px 10px;
      border: none;
      background: transparent;
      border-radius: var(--r-sm);
      font-size: 11px;
      font-weight: 600;
      color: var(--c-subtle);
      cursor: pointer;
      font-family: var(--font-sans);
      transition: all var(--t-fast);

      &:hover { color: var(--c-text); }

      &--active {
        background: var(--c-white);
        color: var(--c-text);
        box-shadow: var(--s-xs);
      }
    }

    .chart-area {
      overflow: hidden;

      .activity-chart {
        display: block;
        border-radius: var(--r-md);
        overflow: hidden;
      }
    }

    .chart-legend {
      display: flex;
      gap: 1rem;
      margin-top: 0.75rem;
    }

    .chart-legend__item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--c-secondary);
    }

    .chart-legend__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    /* ── DONUT ──────────────────────────────────────────────── */
    .donut-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .donut-legend {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .donut-legend__item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--c-secondary);

      span:first-child {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
        display: inline-block;
      }

      strong {
        font-weight: 600;
        color: var(--c-text);
        margin-left: auto;
        font-family: var(--font-tight);
        font-size: 13px;
      }
    }

    /* ── BOTTOM ROW ──────────────────────────────────────────── */
    .bottom-row {
      display: grid;
      grid-template-columns: 1.2fr 1fr 1fr;
      gap: 1rem;

      @media (max-width: 1100px) { grid-template-columns: 1fr 1fr; }
      @media (max-width: 700px)  { grid-template-columns: 1fr; }
    }

    .alerts-card,
    .deploys-card,
    .ia-card {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 1.25rem;
    }

    .section-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .section-card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--c-text);
    }

    .section-card-subtitle {
      font-size: 12px;
      color: var(--c-subtle);
      margin-top: 2px;
    }

    /* Alerts */
    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .alert-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 12px;
      border-radius: var(--r-md);
      border: 1px solid;

      &--critical {
        background: var(--c-danger-bg);
        border-color: var(--c-danger-border);
      }
      &--warning {
        background: var(--c-accent-bg);
        border-color: var(--c-accent-border);
      }
      &--info {
        background: var(--c-brand-bg);
        border-color: var(--c-brand-border);
      }
    }

    .alert-item__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-top: 5px;
      flex-shrink: 0;

      &--critical { background: var(--c-danger); }
      &--warning  { background: var(--c-accent); }
      &--info     { background: var(--c-brand); }
    }

    .alert-item__body { flex: 1; min-width: 0; }

    .alert-item__message {
      font-size: 12px;
      font-weight: 500;
      color: var(--c-text);
      margin-bottom: 4px;
    }

    .alert-item__meta {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Deployments */
    .deploy-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .deploy-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: var(--r-md);
      transition: background var(--t-fast);

      &:hover { background: var(--c-surface); }
    }

    .deploy-item__icon {
      width: 26px;
      height: 26px;
      border-radius: var(--r-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &--success  { background: var(--c-success-bg);  color: var(--c-success); }
      &--running  { background: var(--c-brand-bg);    color: var(--c-brand); }
      &--failed   { background: var(--c-danger-bg);   color: var(--c-danger); }
    }

    .deploy-item__body { flex: 1; min-width: 0; }

    .deploy-item__name {
      font-size: 12px;
      font-weight: 500;
      color: var(--c-text);
    }

    .deploy-item__meta {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 2px;
    }

    .deploy-item__version {
      font-family: var(--font-mono);
      font-size: 10px;
      background: var(--c-surface-alt);
      padding: 1px 5px;
      border-radius: var(--r-xs);
      color: var(--c-brand);
    }

    .deploy-item__devices {
      font-size: 11px;
      color: var(--c-subtle);
      flex-shrink: 0;
    }

    /* IA Models */
    .ia-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .ia-item {
      padding: 10px;
      background: var(--c-surface);
      border-radius: var(--r-md);
      border: 1px solid var(--c-border-light);
    }

    .ia-item__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .ia-item__name {
      font-size: 12px;
      font-weight: 600;
      color: var(--c-text);
    }

    .ia-item__uptime {
      font-size: 11px;
      font-weight: 700;
      color: var(--c-subtle);

      &--ok { color: var(--c-success); }
    }

    .ia-item__metrics {
      display: flex;
      gap: 12px;
    }

    .ia-item__metric {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .ia-item__metric-label {
      font-size: 10px;
      color: var(--c-subtle);
    }

    .ia-item__metric-value {
      font-size: 12px;
      font-weight: 600;
      color: var(--c-text);
      font-family: var(--font-mono);
    }

    .spin-anim {
      animation: spin 1.5s linear infinite;
    }

    .text-cyan { color: var(--c-cyan); }
    .text-danger { color: var(--c-danger); }
  `]
})
export class CommandementComponent implements OnInit {
  readonly services: ServiceStatus[] = [
    { name: 'API Alternia Gateway', status: 'operational', uptime: '99.98%', latency: '24ms' },
    { name: 'Service IA', status: 'operational', uptime: '99.95%', latency: '89ms' },
    { name: 'Synchronisation OTA', status: 'operational', uptime: '100%', latency: '12ms' },
    { name: 'CDN Média Alternia', status: 'degraded', uptime: '97.2%', latency: '340ms' },
    { name: 'Base de données', status: 'operational', uptime: '99.99%', latency: '4ms' },
    { name: 'Portail Parents', status: 'operational', uptime: '99.97%', latency: '67ms' },
  ];

  readonly kpis: KpiMetric[] = [
    {
      label: 'Boîtiers déployés',
      value: '12 847',
      sub: '87,2% connectés actuellement',
      trend: 4.7,
      trendLabel: '+4,7% ce mois',
      color: '#314999',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
    },
    {
      label: 'Boîtiers connectés',
      value: '11 203',
      sub: 'En ligne en ce moment',
      trend: 2.1,
      trendLabel: '+2,1% vs hier',
      color: '#22c55e',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>`
    },
    {
      label: 'Établissements actifs',
      value: '1 247',
      sub: "17 en cours d'intégration",
      trend: 8.3,
      trendLabel: '+8,3% ce trimestre',
      color: '#314999',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    },
    {
      label: 'Parents actifs',
      value: '48 391',
      sub: 'Connexions ce mois',
      trend: 12.4,
      trendLabel: '+12,4% ce mois',
      color: '#40BBCC',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    },
    {
      label: 'Licences actives',
      value: '52 104',
      sub: '3 892 expirées ce mois',
      trend: 6.9,
      trendLabel: '+6,9% vs M-1',
      color: '#F1851F',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`
    },
    {
      label: 'Requêtes IA aujourd\'hui',
      value: '1 847 293',
      sub: 'Pic à 14h32 : 3 241/min',
      trend: 18.7,
      trendLabel: '+18,7% vs hier',
      color: '#40BBCC',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5 5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z"/><path d="M9 13v1a3 3 0 0 0 6 0v-1"/></svg>`
    },
    {
      label: 'Temps de réponse moyen',
      value: '124ms',
      sub: 'SLA cible : &lt; 200ms',
      trend: -8.2,
      trendLabel: '-8,2% vs hier',
      color: '#22c55e',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
    },
    {
      label: 'Disponibilité plateforme',
      value: '99,97%',
      sub: 'Sur les 30 derniers jours',
      color: '#22c55e',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
    },
    {
      label: 'Revenu mensuel',
      value: '186 540 €',
      sub: 'MRR — Objectif 200k€',
      trend: 9.3,
      trendLabel: '+9,3% vs M-1',
      color: '#314999',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="1" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
    },
  ];

  readonly alerts: AlertItem[] = [
    {
      id: '1',
      type: 'warning',
      message: 'CDN Média Alternia — Latence élevée détectée sur la région EU-West',
      time: 'il y a 12 min',
      service: 'CDN'
    },
    {
      id: '2',
      type: 'critical',
      message: '210 boîtiers en mode maintenance — Firmware v3.1.8 incompatible détecté',
      time: 'il y a 1h 24min',
      service: 'OTA'
    },
    {
      id: '3',
      type: 'info',
      message: 'Renouvellement de 847 licences prévu dans les 7 prochains jours',
      time: 'il y a 3h',
      service: 'Licences'
    }
  ];

  readonly deployments = [
    { name: 'Firmware Boîtiers', version: 'v3.2.1', time: 'il y a 2h', status: 'success', devices: '11 203' },
    { name: 'API Backend', version: 'v2.8.0', time: 'il y a 1 jour', status: 'success', devices: null },
    { name: 'Modèle IA AlterniaMath', version: 'v4.0.1', time: 'il y a 2 jours', status: 'success', devices: null },
    { name: 'Déploiement OTA Batch #47', version: 'v3.2.1', time: 'En cours...', status: 'running', devices: '1 644' },
    { name: 'SDK Parental v1.5.0', version: 'v1.5.0', time: 'il y a 4 jours', status: 'success', devices: null },
  ];

  readonly iaModels = [
    { name: 'GPT-Alternia 4.0', uptime: 99.2, latency: 89, errors: 0.1, rpm: '4 847' },
    { name: 'AlterniaMath Pro', uptime: 99.5, latency: 67, errors: 0.5, rpm: '2 134' },
    { name: 'GPT-Alternia 3.5', uptime: 98.7, latency: 124, errors: 0.3, rpm: '6 291' },
    { name: 'AlterniaSVT', uptime: 97.8, latency: 71, errors: 2.1, rpm: '1 047' },
  ];

  ngOnInit() {}
}
