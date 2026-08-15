import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Etablissement {
  id: string;
  nom: string;
  ville: string;
  region: string;
  boitiersCount: number;
  licencesCount: number;
  dateInscription: string;
  statut: 'Actif' | 'En attente' | 'Suspendu';
  directeurEmail: string;
  offre: 'Enterprise' | 'Institutionnel' | 'Standard';
}

interface RegionItem {
  region: string;
  villePhares: string;
  count: number;
}

@Component({
  selector: 'app-etablissements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-content">

      <!-- HEADER -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow">Réseau National Alternia</div>
          <h1 class="page-header__title">Établissements Scolaires au Mali</h1>
          <p class="page-header__subtitle">Supervision et gestion des 1 247 centres d'enseignement et complexes partenaires au Mali</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn--secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Exporter
          </button>
          <button class="btn btn--primary" (click)="showCreateModal.set(true)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ajouter un Établissement
          </button>
        </div>
      </div>

      <!-- BANNIÈRE DÉPLOIEMENT RÉGIONAL MALI -->
      <div class="geo-banner mb-6">
        <div class="geo-banner__text">
          <div class="geo-banner__tag">
            <span class="status-dot status-dot--online"></span>
            Déploiement Territorial — République du Mali
          </div>
          <h2 class="geo-banner__title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Couverture dans 8 Régions & le District de Bamako
          </h2>
          <p class="geo-banner__subtitle">
            Alternia équipe les salles de classe connectées du District de Bamako, de Koulikoro, Sikasso, Ségou, Kayes jusqu'à Mopti, Gao et Tombouctou.
          </p>

          <div class="geo-banner__regions">
            @for (r of regions; track r.region) {
              <button
                class="geo-region-pill"
                [class.geo-region-pill--active]="selectedRegion() === r.region"
                (click)="filterByRegion(r.region)"
              >
                <span class="geo-region-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></svg>
                </span>
                <span class="geo-region-nom">{{ r.region }}</span>
                <span class="geo-region-count">{{ r.count }}</span>
              </button>
            }
          </div>
        </div>

        <div class="geo-banner__visual">
          <div class="geo-radar">
            <svg viewBox="0 0 220 220" class="geo-radar-svg">
              <defs>
                <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="var(--c-brand)" stop-opacity="0.15"/>
                  <stop offset="100%" stop-color="var(--c-brand)" stop-opacity="0"/>
                </radialGradient>
              </defs>

              <!-- Concentric Range Rings -->
              <circle cx="110" cy="110" r="95" fill="none" stroke="var(--c-border)" stroke-width="1" stroke-dasharray="3,3"/>
              <circle cx="110" cy="110" r="70" fill="none" stroke="var(--c-border)" stroke-width="1"/>
              <circle cx="110" cy="110" r="45" fill="url(#radarGlow)" stroke="var(--c-brand-border)" stroke-width="1"/>
              <circle cx="110" cy="110" r="20" fill="none" stroke="var(--c-brand)" stroke-width="1.5"/>

              <!-- Connection Lines -->
              <line x1="110" y1="110" x2="65" y2="135" stroke="var(--c-brand)" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.6"/>
              <line x1="110" y1="110" x2="160" y2="85" stroke="var(--c-cyan)" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.6"/>
              <line x1="110" y1="110" x2="115" y2="55" stroke="var(--c-brand)" stroke-width="1.5" opacity="0.4"/>
              <line x1="110" y1="110" x2="150" y2="150" stroke="var(--c-accent)" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.6"/>
              <line x1="110" y1="110" x2="50" y2="80" stroke="var(--c-cyan)" stroke-width="1.5" opacity="0.4"/>

              <!-- Hub Nodes (Regions) -->
              <!-- Central Hub: Bamako -->
              <circle cx="110" cy="110" r="8" fill="var(--c-brand)"/>
              <circle cx="110" cy="110" r="14" fill="none" stroke="var(--c-brand)" stroke-width="1.5" opacity="0.5"/>
              <text x="110" y="132" text-anchor="middle" font-size="8" font-weight="700" fill="var(--c-text)">BAMAKO</text>

              <!-- Koulikoro / Kati -->
              <circle cx="65" cy="135" r="5" fill="var(--c-cyan)"/>
              <text x="50" y="152" font-size="7" font-weight="600" fill="var(--c-secondary)">Koulikoro</text>

              <!-- Sikasso -->
              <circle cx="150" cy="150" r="5.5" fill="var(--c-accent)"/>
              <text x="150" y="166" font-size="7" font-weight="600" fill="var(--c-secondary)">Sikasso</text>

              <!-- Ségou -->
              <circle cx="160" cy="85" r="5" fill="var(--c-cyan)"/>
              <text x="160" y="76" font-size="7" font-weight="600" fill="var(--c-secondary)">Ségou</text>

              <!-- Kayes -->
              <circle cx="50" cy="80" r="4.5" fill="var(--c-brand)"/>
              <text x="40" y="70" font-size="7" font-weight="600" fill="var(--c-secondary)">Kayes</text>

              <!-- Mopti / Nord -->
              <circle cx="115" cy="55" r="4" fill="var(--c-success)"/>
              <text x="115" y="47" text-anchor="middle" font-size="7" font-weight="600" fill="var(--c-secondary)">Mopti</text>
            </svg>
          </div>
        </div>
      </div>

      <!-- KPI METRICS -->
      <div class="kpi-grid mb-6">
        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>ÉTABLISSEMENTS ACTIFS</span>
            <span class="badge badge--success">1 247</span>
          </div>
          <div class="metric-value text-brand mt-2">1 247</div>
          <div class="text-xs text-secondary mt-1">Répartis sur tout le territoire malien</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>MOY. BOÎTIERS / ÉTABLISSEMENT</span>
            <span class="badge badge--brand">10,3</span>
          </div>
          <div class="metric-value text-cyan mt-2">10,3</div>
          <div class="text-xs text-secondary mt-1">Salles de classe équipées en moyenne</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>CONTRATS ENTERPRISE</span>
            <span class="badge badge--brand">78%</span>
          </div>
          <div class="metric-value text-text mt-2">972</div>
          <div class="text-xs text-secondary mt-1">Grands lycées & complexes scolaires</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>DOSSIERS EN INTÉGRATION</span>
            <span class="badge badge--warning">17</span>
          </div>
          <div class="metric-value text-accent mt-2">17</div>
          <div class="text-xs text-secondary mt-1">En cours de déploiement ce mois</div>
        </div>
      </div>

      <!-- SEARCH & FILTERS -->
      <div class="card mb-4">
        <div class="flex flex-wrap justify-between items-center gap-3">
          <div class="search-box flex-1" style="max-width: 380px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Rechercher un lycée, ville, région, contact..."
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
            />
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            @if (selectedRegion()) {
              <div class="active-filter-badge">
                <span>Région : {{ selectedRegion() }}</span>
                <button class="active-filter-clear" (click)="selectedRegion.set(null)" title="Effacer le filtre">×</button>
              </div>
            }
            <span class="text-xs text-subtle font-medium">Statut :</span>
            <button class="btn btn--sm" [class.btn--primary]="selectedStatut() === 'Tous'" [class.btn--ghost]="selectedStatut() !== 'Tous'" (click)="selectedStatut.set('Tous')">Tous</button>
            <button class="btn btn--sm" [class.btn--primary]="selectedStatut() === 'Actif'" [class.btn--ghost]="selectedStatut() !== 'Actif'" (click)="selectedStatut.set('Actif')">Actifs</button>
            <button class="btn btn--sm" [class.btn--primary]="selectedStatut() === 'En attente'" [class.btn--ghost]="selectedStatut() !== 'En attente'" (click)="selectedStatut.set('En attente')">En attente</button>
            <button class="btn btn--sm" [class.btn--primary]="selectedStatut() === 'Suspendu'" [class.btn--ghost]="selectedStatut() !== 'Suspendu'" (click)="selectedStatut.set('Suspendu')">Suspendus</button>
          </div>
        </div>
      </div>

      <!-- TABLE -->
      <div class="table-wrap bg-white">
        <table>
          <thead>
            <tr>
              <th>Établissement</th>
              <th>Localisation (Mali)</th>
              <th>Offre Contractuelle</th>
              <th>Boîtiers Alternia</th>
              <th>Licences Actives</th>
              <th>Date d'inscription</th>
              <th>Statut</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (e of filteredEtablissements(); track e.id) {
              <tr>
                <td>
                  <div class="etab-name-cell">
                    <div class="etab-avatar">{{ e.nom.slice(0, 2).toUpperCase() }}</div>
                    <div>
                      <div class="font-semibold text-text">{{ e.nom }}</div>
                      <div class="text-xs text-subtle">{{ e.directeurEmail }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="text-xs font-medium text-text">{{ e.ville }}</div>
                  <div class="text-xs text-secondary">{{ e.region }}</div>
                </td>
                <td>
                  <span class="badge"
                    [class.badge--brand]="e.offre === 'Enterprise'"
                    [class.badge--info]="e.offre === 'Institutionnel'"
                    [class.badge--neutral]="e.offre === 'Standard'"
                  >{{ e.offre }}</span>
                </td>
                <td>
                  <div class="font-semibold text-brand">{{ e.boitiersCount }}</div>
                  <div class="text-xs text-subtle">boîtiers</div>
                </td>
                <td>
                  <div class="font-semibold text-text">{{ e.licencesCount }}</div>
                  <div class="text-xs text-subtle">licences</div>
                </td>
                <td class="text-xs text-secondary">{{ e.dateInscription }}</td>
                <td>
                  @if (e.statut === 'Actif') {
                    <span class="badge badge--success"><span class="status-dot status-dot--online"></span> Actif</span>
                  } @else if (e.statut === 'En attente') {
                    <span class="badge badge--warning"><span class="status-dot status-dot--warning"></span> En attente</span>
                  } @else {
                    <span class="badge badge--danger"><span class="status-dot status-dot--offline"></span> Suspendu</span>
                  }
                </td>
                <td style="text-align: right;">
                  <div class="flex justify-end gap-1">
                    @if (e.statut === 'Actif') {
                      <button class="btn btn--ghost btn--sm" style="color: var(--c-accent);" (click)="toggleStatut(e)">Suspendre</button>
                    } @else {
                      <button class="btn btn--ghost btn--sm" style="color: var(--c-success);" (click)="toggleStatut(e)">Activer</button>
                    }
                    <button class="btn btn--secondary btn--sm" (click)="selectedEtab.set(e)">Détails</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- CREATE MODAL -->
      @if (showCreateModal()) {
        <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.2s ease;">
          <div class="card" style="width: 100%; max-width: 520px; background: white; border-radius: var(--r-xl); box-shadow: var(--s-xl); animation: scaleIn 0.2s ease;">
            <div class="flex justify-between items-start mb-5">
              <div>
                <h3 class="text-lg font-bold text-text">Ajouter un Établissement (Mali)</h3>
                <p class="text-xs text-secondary mt-1">Renseignez les coordonnées pour créer un nouvel accès établissement</p>
              </div>
              <button class="btn btn--ghost btn--sm btn--icon" (click)="showCreateModal.set(false)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="flex flex-col gap-4">
              <div>
                <label class="text-xs font-semibold text-secondary mb-1 block">Nom de l'Établissement</label>
                <input type="text" class="input" placeholder="Ex: Lycée Public de Kati..." />
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <label class="text-xs font-semibold text-secondary mb-1 block">Ville / Cercle</label>
                  <input type="text" class="input" placeholder="Ex: Bamako, Sikasso, Kati..." />
                </div>
                <div>
                  <label class="text-xs font-semibold text-secondary mb-1 block">Région (Mali)</label>
                  <select class="input">
                    <option>District de Bamako</option>
                    <option>Région de Koulikoro</option>
                    <option>Région de Sikasso</option>
                    <option>Région de Ségou</option>
                    <option>Région de Kayes</option>
                    <option>Région de Mopti</option>
                    <option>Région de Gao</option>
                    <option>Région de Tombouctou</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-secondary mb-1 block">Email de la Direction</label>
                <input type="email" class="input" placeholder="direction&#64;lycee.ml" />
              </div>
              <div>
                <label class="text-xs font-semibold text-secondary mb-1 block">Offre contractuelle</label>
                <select class="input">
                  <option>Enterprise</option>
                  <option>Institutionnel</option>
                  <option>Standard</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
              <button class="btn btn--ghost" (click)="showCreateModal.set(false)">Annuler</button>
              <button class="btn btn--primary" (click)="createEtablissement()">Créer l'établissement</button>
            </div>
          </div>
        </div>
      }

      <!-- DETAILS MODAL -->
      @if (selectedEtab(); as e) {
        <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.2s ease;">
          <div class="card" style="width: 100%; max-width: 540px; background: white; border-radius: var(--r-xl); box-shadow: var(--s-xl); animation: scaleIn 0.2s ease;">
            <div class="flex justify-between items-start mb-4">
              <div>
                <span class="badge badge--brand mb-2">Fiche Établissement (Mali)</span>
                <h3 class="text-lg font-bold text-text">{{ e.nom }}</h3>
                <p class="text-xs text-secondary">{{ e.ville }}, {{ e.region }}</p>
              </div>
              <button class="btn btn--ghost btn--sm btn--icon" (click)="selectedEtab.set(null)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: var(--c-surface-alt); padding: 1rem; border-radius: var(--r-lg); margin-bottom: 1rem; border: 1px solid var(--c-border-light);">
              <div>
                <div class="text-xs text-subtle">Statut Contractuel</div>
                <div class="font-semibold text-sm mt-1" [class.text-success]="e.statut === 'Actif'" [class.text-danger]="e.statut === 'Suspendu'" [class.text-accent]="e.statut === 'En attente'">{{ e.statut }}</div>
              </div>
              <div>
                <div class="text-xs text-subtle">Offre Souscrite</div>
                <div class="font-semibold text-sm text-brand mt-1">{{ e.offre }}</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Boîtiers Déployés</div>
                <div class="font-bold text-sm mt-1 text-text">{{ e.boitiersCount }} unités connectées</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Licences Familles</div>
                <div class="font-bold text-sm mt-1 text-text">{{ e.licencesCount }} comptes élèves</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Contact Direction</div>
                <div class="font-mono text-xs mt-1 text-brand">{{ e.directeurEmail }}</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Inscrit le</div>
                <div class="text-sm mt-1 text-secondary">{{ e.dateInscription }}</div>
              </div>
            </div>

            <div class="flex justify-end gap-2">
              <button class="btn btn--ghost" (click)="selectedEtab.set(null)">Fermer</button>
              <button class="btn btn--secondary">Voir les boîtiers</button>
              <button class="btn btn--primary">Administrer le portail</button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .geo-banner {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1.5rem;
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-xl);
      padding: 1.75rem;
      align-items: center;
      box-shadow: var(--s-xs);

      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }

    .geo-banner__tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      color: var(--c-brand);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 6px;
    }

    .geo-banner__title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--c-text);
      letter-spacing: -0.02em;
      margin-bottom: 6px;
    }

    .geo-banner__subtitle {
      font-size: 13px;
      color: var(--c-secondary);
      line-height: 1.5;
      margin-bottom: 1rem;
      max-width: 720px;
    }

    .geo-banner__regions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .geo-region-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: var(--c-surface-alt);
      border: 1px solid var(--c-border);
      border-radius: var(--r-full);
      cursor: pointer;
      transition: all var(--t-fast);
      outline: none;

      &:hover {
        border-color: var(--c-brand);
        background: var(--c-brand-bg);
        transform: translateY(-1px);
      }

      &--active {
        background: var(--c-brand);
        border-color: var(--c-brand);
        color: white;

        .geo-region-nom { color: white; }
        .geo-region-icon { color: white; }
        .geo-region-count { background: rgba(255, 255, 255, 0.25); color: white; }
      }
    }

    .geo-region-icon {
      color: var(--c-brand);
      display: flex;
      align-items: center;
    }

    .geo-region-nom {
      font-size: 12px;
      font-weight: 600;
      color: var(--c-text);
    }

    .geo-region-count {
      font-size: 11px;
      font-weight: 700;
      color: var(--c-brand);
      background: var(--c-brand-bg);
      border-radius: var(--r-full);
      padding: 1px 7px;
    }

    .geo-banner__visual {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .geo-radar {
      width: 170px;
      height: 170px;
      border-radius: 50%;
      background: radial-gradient(circle at center, rgba(99,102,241,0.06) 0%, rgba(248,250,252,0.6) 100%);
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
      border: 1px solid var(--c-border);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      .geo-radar-svg { width: 100%; height: 100%; }
    }

    .active-filter-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--c-brand-bg);
      border: 1px solid var(--c-brand-border);
      color: var(--c-brand);
      padding: 3px 8px;
      border-radius: var(--r-sm);
      font-size: 11px;
      font-weight: 600;
    }

    .active-filter-clear {
      background: none;
      border: none;
      color: var(--c-brand);
      font-size: 14px;
      cursor: pointer;
      font-weight: 700;
      line-height: 1;
      padding: 0;
    }

    /* Avatar établissement dans le tableau */
    .etab-name-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .etab-avatar {
      width: 34px;
      height: 34px;
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
  `]
})
export class EtablissementsComponent {
  searchQuery = signal('');
  selectedStatut = signal<'Tous' | 'Actif' | 'En attente' | 'Suspendu'>('Tous');
  selectedRegion = signal<string | null>(null);
  showCreateModal = signal(false);
  selectedEtab = signal<Etablissement | null>(null);

  readonly regions: RegionItem[] = [
    { region: 'District de Bamako', villePhares: 'Bamako (Communes I à VI)', count: 512 },
    { region: 'Koulikoro', villePhares: 'Kati, Koulikoro, Banamba', count: 234 },
    { region: 'Sikasso', villePhares: 'Sikasso, Koutiala, Bougouni', count: 198 },
    { region: 'Ségou', villePhares: 'Ségou, San, Niono', count: 146 },
    { region: 'Kayes', villePhares: 'Kayes, Kita, Nioro', count: 92 },
    { region: 'Mopti', villePhares: 'Mopti, Sévaré, Djenné', count: 45 },
    { region: 'Gao', villePhares: 'Gao, Ansongo', count: 14 },
    { region: 'Tombouctou', villePhares: 'Tombouctou, Diré', count: 6 },
  ];

  readonly etablissementsList = signal<Etablissement[]>([
    { id: 'ETAB-101', nom: 'Lycée Mamadou Konaté', ville: 'Bamako', region: 'District de Bamako', boitiersCount: 28, licencesCount: 1400, dateInscription: '14/01/2024', statut: 'Actif', directeurEmail: 'direction@lmk-bamako.ml', offre: 'Enterprise' },
    { id: 'ETAB-102', nom: 'Lycée Moderne de Bamako', ville: 'Bamako', region: 'District de Bamako', boitiersCount: 24, licencesCount: 1200, dateInscription: '02/03/2024', statut: 'Actif', directeurEmail: 'direction@lmb-bamako.ml', offre: 'Enterprise' },
    { id: 'ETAB-103', nom: 'Groupe Scolaire Excellence', ville: 'Sikasso', region: 'Sikasso', boitiersCount: 20, licencesCount: 950, dateInscription: '19/11/2023', statut: 'Actif', directeurEmail: 'contact@gse-sikasso.ml', offre: 'Enterprise' },
    { id: 'ETAB-104', nom: 'Collège Horizon', ville: 'Kati', region: 'Koulikoro', boitiersCount: 16, licencesCount: 780, dateInscription: '05/05/2024', statut: 'Actif', directeurEmail: 'admin@horizon-kati.ml', offre: 'Standard' },
    { id: 'ETAB-105', nom: 'Lycée Amadou Hampâté Bâ', ville: 'Bamako', region: 'District de Bamako', boitiersCount: 18, licencesCount: 890, dateInscription: '12/06/2024', statut: 'Actif', directeurEmail: 'direction@lahb-bamako.ml', offre: 'Enterprise' },
    { id: 'ETAB-106', nom: 'Complexe Scolaire La Renaissance', ville: 'Ségou', region: 'Ségou', boitiersCount: 14, licencesCount: 650, dateInscription: '10/09/2023', statut: 'Actif', directeurEmail: 'secretariat@renaissance-segou.ml', offre: 'Institutionnel' },
    { id: 'ETAB-107', nom: 'Lycée Dougoukolo Konaré', ville: 'Kayes', region: 'Kayes', boitiersCount: 15, licencesCount: 720, dateInscription: '22/02/2024', statut: 'Actif', directeurEmail: 'admin@ldk-kayes.ml', offre: 'Standard' },
    { id: 'ETAB-108', nom: 'École Privée Excellence', ville: 'Mopti', region: 'Mopti', boitiersCount: 10, licencesCount: 420, dateInscription: '01/03/2025', statut: 'En attente', directeurEmail: 'direction@excellence-mopti.ml', offre: 'Standard' },
    { id: 'ETAB-109', nom: 'CEM Hamdallaye', ville: 'Bamako', region: 'District de Bamako', boitiersCount: 12, licencesCount: 560, dateInscription: '15/04/2025', statut: 'Actif', directeurEmail: 'cem.hamdallaye@education.ml', offre: 'Standard' },
    { id: 'ETAB-110', nom: 'Groupe Scolaire Lumière', ville: 'Ségou', region: 'Ségou', boitiersCount: 8, licencesCount: 340, dateInscription: '20/05/2025', statut: 'Suspendu', directeurEmail: 'contact@lumiere-segou.ml', offre: 'Standard' },
    { id: 'ETAB-111', nom: 'Lycée Public de Gao', ville: 'Gao', region: 'Gao', boitiersCount: 14, licencesCount: 610, dateInscription: '11/06/2025', statut: 'Actif', directeurEmail: 'direction@lycee-gao.ml', offre: 'Institutionnel' },
    { id: 'ETAB-112', nom: 'Lycée Franco-Arabe de Tombouctou', ville: 'Tombouctou', region: 'Tombouctou', boitiersCount: 6, licencesCount: 280, dateInscription: '18/07/2025', statut: 'Actif', directeurEmail: 'secretariat@lfat-tombouctou.ml', offre: 'Standard' }
  ]);

  filteredEtablissements = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.selectedStatut();
    const reg = this.selectedRegion();

    return this.etablissementsList().filter(e => {
      const matchSearch = !q || e.nom.toLowerCase().includes(q) || e.ville.toLowerCase().includes(q) || e.region.toLowerCase().includes(q);
      const matchStatus = st === 'Tous' || e.statut === st;
      const matchRegion = !reg || e.region.toLowerCase().includes(reg.toLowerCase());
      return matchSearch && matchStatus && matchRegion;
    });
  });

  filterByRegion(region: string) {
    if (this.selectedRegion() === region) {
      this.selectedRegion.set(null);
    } else {
      this.selectedRegion.set(region);
    }
  }

  toggleStatut(e: Etablissement) {
    const newStatut = e.statut === 'Actif' ? 'Suspendu' : 'Actif';
    this.etablissementsList.update(list => list.map(item => item.id === e.id ? { ...item, statut: newStatut } : item));
  }

  createEtablissement() {
    this.showCreateModal.set(false);
  }
}

