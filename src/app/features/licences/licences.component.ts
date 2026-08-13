import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface LicenceItem {
  id: string;
  code: string;
  type: 'Établissement Bulk' | 'Parent Solo' | 'Institutionnel Pack';
  titulaire: string;
  dateActivation: string;
  dateExpiration: string;
  statut: 'Active' | 'Expirée' | 'En attente' | 'Renouvelée';
  prix: string;
  duree: string;
}

@Component({
  selector: 'app-licences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-content">

      <!-- HEADER -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow">Modèle Économique & Revenus</div>
          <h1 class="page-header__title">Licences & Abonnements</h1>
          <p class="page-header__subtitle">Supervision des {{ licencesList.length }} licences actives et prévisions de renouvellement</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn--secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export Financier
          </button>
          <button class="btn btn--primary" (click)="modalOuvert.set(true)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Générer un Pack
          </button>
        </div>
      </div>

      <!-- REVENUE METRICS BAR -->
      <div class="kpi-grid mb-6">
        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>REVENU MENSUEL RÉCURRENT</span>
            <span class="badge badge--success">+9,3%</span>
          </div>
          <div class="metric-value text-brand mt-2">122 000 000 FCFA</div>
          <div class="text-xs text-secondary mt-1">ARR estimé : 1,46 Mrd FCFA</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>LICENCES ACTIVES</span>
            <span class="badge badge--brand">52 104</span>
          </div>
          <div class="metric-value text-cyan mt-2">52 104</div>
          <div class="text-xs text-secondary mt-1">92,8% de taux d'activation</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>À RENOUVELER (30J)</span>
            <span class="badge badge--warning">3 892</span>
          </div>
          <div class="metric-value text-accent mt-2">3 892</div>
          <div class="text-xs text-secondary mt-1">Valeur récurrente : 27,5 M FCFA</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>TAUX DE RÉTENTION</span>
            <span class="badge badge--success">98,4%</span>
          </div>
          <div class="metric-value text-text mt-2">98,4%</div>
          <div class="text-xs text-secondary mt-1">Churn annuel &lt; 1,6%</div>
        </div>
      </div>

      <!-- CHARTS SECTION -->
      <div class="chart-grid mb-6">
        <!-- Revenue Growth Chart -->
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <div>
              <div class="font-bold text-base text-text">Croissance du MRR (FCFA)</div>
              <div class="text-xs text-subtle">Évolution des 6 derniers mois</div>
            </div>
            <span class="badge badge--brand">2026</span>
          </div>

          <div style="height: 180px;" class="flex items-end gap-3 pt-4">
            @for (m of mrrData; track m.mois) {
              <div class="flex-1 flex flex-col items-center gap-1">
                <span class="text-xs text-subtle font-mono">{{ m.label }}</span>
                <div class="w-full" style="height: 140px; display: flex; align-items: flex-end;">
                  <div
                    class="w-full rounded-t transition-all duration-700"
                    [style.height.%]="m.pct"
                    [style.background]="m.isCurrent ? 'linear-gradient(180deg, #40BBCC 0%, #314999 100%)' : '#314999'"
                    [style.opacity]="m.isCurrent ? 1 : 0.75"
                  ></div>
                </div>
                <span class="text-xs font-medium" [class.text-brand]="m.isCurrent" [class.text-secondary]="!m.isCurrent">{{ m.mois }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Répartition des Formules -->
        <div class="card flex flex-col justify-between">
          <div>
            <div class="font-bold text-base text-text mb-1">Répartition des Formules</div>
            <div class="text-xs text-subtle mb-4">Par typologie de contrat souscrit</div>

            <div class="flex flex-col gap-4">
              @for (f of formules; track f.nom) {
                <div>
                  <div class="flex justify-between items-center text-xs font-semibold mb-1">
                    <div class="flex items-center gap-2">
                      <span class="formule-dot" [style.background]="f.couleur"></span>
                      <span>{{ f.nom }}</span>
                    </div>
                    <span class="font-mono" [style.color]="f.couleur">{{ f.licences }} ({{ f.pct }}%)</span>
                  </div>
                  <div class="progress">
                    <div class="progress__bar" [style.width.%]="f.pct" [style.background]="f.couleur"></div>
                  </div>
                </div>
              }
            </div>
          </div>
          <div class="text-xs text-subtle mt-4">Calculé sur les contrats d'abonnement actifs en cours.</div>
        </div>
      </div>

      <!-- FILTERS + SEARCH -->
      <div class="card mb-4">
        <div class="flex flex-wrap justify-between items-center gap-3">
          <div class="search-box flex-1" style="max-width: 360px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Rechercher code, titulaire, type..."
              [ngModel]="recherche()"
              (ngModelChange)="recherche.set($event)"
            />
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs text-subtle font-medium">Type :</span>
            @for (t of typesFiltres; track t) {
              <button
                class="btn btn--sm"
                [class.btn--primary]="filtreType() === t"
                [class.btn--ghost]="filtreType() !== t"
                (click)="filtreType.set(t)"
              >{{ t }}</button>
            }
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs text-subtle font-medium">Statut :</span>
            @for (s of statutsFiltres; track s) {
              <button
                class="btn btn--sm"
                [class.btn--primary]="filtreStatut() === s"
                [class.btn--ghost]="filtreStatut() !== s"
                (click)="filtreStatut.set(s)"
              >{{ s }}</button>
            }
          </div>
        </div>
      </div>

      <!-- LICENSES TABLE -->
      <div class="table-wrap bg-white">
        <table>
          <thead>
            <tr>
              <th>Clé / Code Licence</th>
              <th>Formule / Offre</th>
              <th>Titulaire principal</th>
              <th>Activation</th>
              <th>Expiration</th>
              <th>Montant</th>
              <th>Statut</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (l of filteredLicences(); track l.id) {
              <tr>
                <td>
                  <div class="font-mono font-semibold text-brand text-xs">{{ l.code }}</div>
                  <div class="text-xs text-subtle">ID: {{ l.id }}</div>
                </td>
                <td>
                  <span class="badge"
                    [class.badge--brand]="l.type === 'Établissement Bulk'"
                    [class.badge--info]="l.type === 'Institutionnel Pack'"
                    [class.badge--neutral]="l.type === 'Parent Solo'"
                  >{{ l.type }}</span>
                </td>
                <td class="font-medium text-text">{{ l.titulaire }}</td>
                <td class="text-xs text-secondary">{{ l.dateActivation }}</td>
                <td>
                  <span class="text-xs font-mono"
                    [class.text-accent]="estBientotExpire(l.dateExpiration)"
                    [class.text-secondary]="!estBientotExpire(l.dateExpiration)"
                  >{{ l.dateExpiration }}</span>
                </td>
                <td class="font-mono font-semibold text-text">{{ l.prix }}</td>
                <td>
                  @if (l.statut === 'Active') {
                    <span class="badge badge--success">Active</span>
                  } @else if (l.statut === 'Renouvelée') {
                    <span class="badge badge--brand">Renouvelée</span>
                  } @else if (l.statut === 'En attente') {
                    <span class="badge badge--warning">En attente</span>
                  } @else {
                    <span class="badge badge--danger">Expirée</span>
                  }
                </td>
                <td style="text-align: right;">
                  <div class="flex justify-end gap-1">
                    <button class="btn btn--ghost btn--sm btn--icon" data-tooltip="Modifier">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button class="btn btn--secondary btn--sm">Gérer</button>
                  </div>
                </td>
              </tr>
            }

            @empty {
              <tr>
                <td colspan="8" class="p-8 text-center">
                  <div class="empty-state">
                    <div class="empty-state__icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/></svg>
                    </div>
                    <div class="empty-state__title">Aucune licence trouvée</div>
                    <div class="empty-state__desc">Modifiez vos filtres de recherche.</div>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- MODAL GÉNÉRER UN PACK -->
      @if (modalOuvert()) {
        <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.2s ease;">
          <div class="card" style="width: 100%; max-width: 480px; background: white; border-radius: var(--r-xl); box-shadow: var(--s-xl); animation: scaleIn 0.2s ease;">
            <div class="flex justify-between items-start mb-5">
              <div>
                <h3 class="text-lg font-bold text-text">Générer un Pack de Licences</h3>
                <p class="text-xs text-secondary mt-1">Création d'un lot de clés pour un établissement ou un partenaire institutionnel</p>
              </div>
              <button class="btn btn--ghost btn--sm btn--icon" (click)="modalOuvert.set(false)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="flex flex-col gap-4">
              <div>
                <label class="text-xs font-semibold text-secondary mb-1 block">Titulaire</label>
                <input type="text" class="input" placeholder="Nom de l'établissement ou du partenaire" />
              </div>
              <div class="flex gap-3">
                <div class="flex-1">
                  <label class="text-xs font-semibold text-secondary mb-1 block">Type</label>
                  <select class="input">
                    <option>Établissement Bulk</option>
                    <option>Institutionnel Pack</option>
                    <option>Parent Solo</option>
                  </select>
                </div>
                <div class="flex-1">
                  <label class="text-xs font-semibold text-secondary mb-1 block">Nombre de licences</label>
                  <input type="number" class="input" placeholder="ex: 100" min="1" />
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-secondary mb-1 block">Durée de validité</label>
                <select class="input">
                  <option>12 mois</option>
                  <option>24 mois</option>
                  <option>36 mois</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
              <button class="btn btn--ghost" (click)="modalOuvert.set(false)">Annuler</button>
              <button class="btn btn--primary" (click)="modalOuvert.set(false)">Générer les licences</button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .formule-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      display: inline-block;
    }
  `]
})
export class LicencesComponent {

  recherche = signal('');
  filtreType = signal('Tous');
  filtreStatut = signal('Tous');
  modalOuvert = signal(false);

  readonly typesFiltres = ['Tous', 'Établissement Bulk', 'Institutionnel Pack', 'Parent Solo'];
  readonly statutsFiltres = ['Tous', 'Active', 'En attente', 'Expirée', 'Renouvelée'];

  readonly mrrData = [
    { mois: 'Mars',  label: '93M FCFA', pct: 60,  isCurrent: false },
    { mois: 'Avr',  label: '101M FCFA', pct: 68,  isCurrent: false },
    { mois: 'Mai',   label: '107M FCFA', pct: 75,  isCurrent: false },
    { mois: 'Juin',  label: '112M FCFA', pct: 82,  isCurrent: false },
    { mois: 'Juil.', label: '117M FCFA', pct: 90,  isCurrent: false },
    { mois: 'Août',  label: '122M FCFA', pct: 100, isCurrent: true },
  ];

  readonly formules = [
    { nom: 'Enterprise Bulk (Établissements)', licences: '38 420', pct: 73.7, couleur: '#314999' },
    { nom: 'Pack Institutionnel',              licences: '9 840',  pct: 18.9, couleur: '#40BBCC' },
    { nom: 'Abonnement Parent / Famille',      licences: '3 844',  pct: 7.4,  couleur: '#F1851F' },
  ];

  readonly licencesList: LicenceItem[] = [
    { id: 'LIC-9901', code: 'ALT-2026-BULK-9901-X', type: 'Établissement Bulk', titulaire: 'Lycée Excellence Saint-Louis', dateActivation: '14/01/2024', dateExpiration: '14/01/2027', statut: 'Active', prix: '9 450 000 FCFA / an', duree: '36 mois' },
    { id: 'LIC-9902', code: 'ALT-2026-BULK-9902-X', type: 'Établissement Bulk', titulaire: 'Collège International Marie Curie', dateActivation: '02/03/2024', dateExpiration: '02/03/2027', statut: 'Active', prix: '6 690 000 FCFA / an', duree: '36 mois' },
    { id: 'LIC-9903', code: 'ALT-2026-PACK-7710-P', type: 'Institutionnel Pack', titulaire: 'Ministère de l\'Éducation CI', dateActivation: '01/09/2025', dateExpiration: '01/09/2026', statut: 'Renouvelée', prix: '29 500 000 FCFA / an', duree: '12 mois' },
    { id: 'LIC-9904', code: 'ALT-2026-SOLO-1092-F', type: 'Parent Solo', titulaire: 'Famille Kouassi', dateActivation: '10/10/2025', dateExpiration: '10/10/2026', statut: 'Active', prix: '80 000 FCFA / an', duree: '12 mois' },
    { id: 'LIC-9905', code: 'ALT-2025-SOLO-0044-F', type: 'Parent Solo', titulaire: 'Famille Ndao', dateActivation: '05/05/2025', dateExpiration: '05/08/2026', statut: 'Expirée', prix: '80 000 FCFA / an', duree: '12 mois' },
    { id: 'LIC-9906', code: 'ALT-2026-BULK-1241-X', type: 'Établissement Bulk', titulaire: 'Académie Royale de Rabat', dateActivation: '10/09/2023', dateExpiration: '10/09/2026', statut: 'Active', prix: '18 800 000 FCFA / an', duree: '36 mois' },
    { id: 'LIC-9907', code: 'ALT-2026-PACK-8810-P', type: 'Institutionnel Pack', titulaire: 'Direction Rectorat Douala', dateActivation: '15/01/2026', dateExpiration: '15/01/2027', statut: 'En attente', prix: '39 300 000 FCFA / an', duree: '12 mois' },
  ];

  filteredLicences = computed(() => {
    let result = this.licencesList;

    if (this.filtreType() !== 'Tous') {
      result = result.filter(l => l.type === this.filtreType());
    }

    if (this.filtreStatut() !== 'Tous') {
      result = result.filter(l => l.statut === this.filtreStatut());
    }

    if (this.recherche()) {
      const q = this.recherche().toLowerCase();
      result = result.filter(l =>
        l.code.toLowerCase().includes(q) ||
        l.titulaire.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q)
      );
    }

    return result;
  });

  estBientotExpire(date: string): boolean {
    // Dates avec "2026" proches expirantes
    return date.includes('/08/2026') || date.includes('/09/2026') || date.includes('/10/2026');
  }
}
