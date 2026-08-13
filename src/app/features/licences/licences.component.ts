import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  template: `
    <div class="page-content">

      <!-- HEADER -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow">Modèle Économique & Revenus</div>
          <h1 class="page-header__title">Licences & Abonnements Alternia</h1>
          <p class="page-header__subtitle">Supervision des 52 104 licences actives et prévisions de renouvellement MRR</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn--secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export Financier
          </button>
          <button class="btn btn--primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Générer un Pack de Licences
          </button>
        </div>
      </div>

      <!-- REVENUE METRICS BAR -->
      <div class="kpi-grid mb-6">
        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>REVENU MENSUEL RÉCURRENT (MRR)</span>
            <span class="badge badge--success">+9.3%</span>
          </div>
          <div class="metric-value text-brand mt-2">186 540 €</div>
          <div class="text-xs text-secondary mt-1">ARR estimé : 2.23M €</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>LICENCES ACTIVES</span>
            <span class="badge badge--brand">52 104</span>
          </div>
          <div class="metric-value text-cyan mt-2">52 104</div>
          <div class="text-xs text-secondary mt-1">92.8% de taux d'activation</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>LICENCES À RENOUVELER (30J)</span>
            <span class="badge badge--warning">3 892</span>
          </div>
          <div class="metric-value text-accent mt-2">3 892</div>
          <div class="text-xs text-secondary mt-1">Valeur récurrente : 42k €</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>TAUX DE RÉTENTION (NET RETENTION)</span>
            <span class="badge badge--success">98.4%</span>
          </div>
          <div class="metric-value text-text mt-2">98,4%</div>
          <div class="text-xs text-secondary mt-1">Churn annuel &lt; 1.6%</div>
        </div>
      </div>

      <!-- CHARTS SECTION -->
      <div class="chart-grid mb-6">
        <!-- Revenue Growth -->
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <div>
              <div class="font-bold text-base text-text">Croissance du MRR (€)</div>
              <div class="text-xs text-subtle">Évolution des 6 derniers mois</div>
            </div>
            <span class="badge badge--brand">2026</span>
          </div>

          <div style="height: 180px;" class="flex items-end gap-3 pt-4">
            <div class="flex-1 flex flex-col items-center gap-1">
              <span class="text-xs text-subtle font-mono">142k€</span>
              <div class="w-full bg-surface-alt rounded-sm overflow-hidden" style="height: 120px; display: flex; align-items: flex-end;">
                <div class="w-full" style="height: 60%; background: #314999; border-radius: 4px 4px 0 0;"></div>
              </div>
              <span class="text-xs font-medium text-secondary">Mars</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1">
              <span class="text-xs text-subtle font-mono">155k€</span>
              <div class="w-full bg-surface-alt rounded-sm overflow-hidden" style="height: 120px; display: flex; align-items: flex-end;">
                <div class="w-full" style="height: 68%; background: #314999; border-radius: 4px 4px 0 0;"></div>
              </div>
              <span class="text-xs font-medium text-secondary">Avril</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1">
              <span class="text-xs text-subtle font-mono">164k€</span>
              <div class="w-full bg-surface-alt rounded-sm overflow-hidden" style="height: 120px; display: flex; align-items: flex-end;">
                <div class="w-full" style="height: 75%; background: #314999; border-radius: 4px 4px 0 0;"></div>
              </div>
              <span class="text-xs font-medium text-secondary">Mai</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1">
              <span class="text-xs text-subtle font-mono">171k€</span>
              <div class="w-full bg-surface-alt rounded-sm overflow-hidden" style="height: 120px; display: flex; align-items: flex-end;">
                <div class="w-full" style="height: 82%; background: #314999; border-radius: 4px 4px 0 0;"></div>
              </div>
              <span class="text-xs font-medium text-secondary">Juin</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1">
              <span class="text-xs text-subtle font-mono">179k€</span>
              <div class="w-full bg-surface-alt rounded-sm overflow-hidden" style="height: 120px; display: flex; align-items: flex-end;">
                <div class="w-full" style="height: 90%; background: #314999; border-radius: 4px 4px 0 0;"></div>
              </div>
              <span class="text-xs font-medium text-secondary">Juil</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1">
              <span class="text-xs font-bold text-cyan font-mono">186.5k€</span>
              <div class="w-full bg-surface-alt rounded-sm overflow-hidden" style="height: 120px; display: flex; align-items: flex-end;">
                <div class="w-full" style="height: 100%; background: linear-gradient(180deg, #40BBCC 0%, #314999 100%); border-radius: 4px 4px 0 0;"></div>
              </div>
              <span class="text-xs font-bold text-brand">Août</span>
            </div>
          </div>
        </div>

        <!-- Breakdown by Plan -->
        <div class="card flex flex-col justify-between">
          <div>
            <div class="font-bold text-base text-text mb-1">Répartition des Formules</div>
            <div class="text-xs text-subtle mb-4">Par typologie de contrat souscrit</div>
            
            <div class="flex flex-col gap-3">
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span>Enterprise Bulk (Établissements)</span>
                  <span class="font-mono text-brand">38 420 licences (73.7%)</span>
                </div>
                <div class="progress"><div class="progress__bar" style="width: 73.7%;"></div></div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span>Pack Institutionnel Gouvernemental</span>
                  <span class="font-mono text-cyan">9 840 licences (18.9%)</span>
                </div>
                <div class="progress"><div class="progress__bar progress__bar--cyan" style="width: 18.9%;"></div></div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span>Abonnement Parent Solo / Famille</span>
                  <span class="font-mono text-accent">3 844 licences (7.4%)</span>
                </div>
                <div class="progress"><div class="progress__bar progress__bar--accent" style="width: 7.4%;"></div></div>
              </div>
            </div>
          </div>
          <div class="text-xs text-subtle mt-4">Calcul basé sur les contrats d'abonnement actifs en cours.</div>
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
            @for (l of licencesList; track l.id) {
              <tr>
                <td>
                  <div class="font-mono font-semibold text-brand text-xs">{{ l.code }}</div>
                  <div class="text-xs text-subtle">ID: {{ l.id }}</div>
                </td>
                <td>
                  <span class="tag font-medium">{{ l.type }}</span>
                </td>
                <td class="font-medium text-text">{{ l.titulaire }}</td>
                <td class="text-xs text-secondary">{{ l.dateActivation }}</td>
                <td class="text-xs text-secondary font-mono">{{ l.dateExpiration }}</td>
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
                  <button class="btn btn--secondary btn--sm">Gérer</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

    </div>
  `
})
export class LicencesComponent {
  readonly licencesList: LicenceItem[] = [
    { id: 'LIC-9901', code: 'ALT-2026-BULK-9901-X', type: 'Établissement Bulk', titulaire: 'Lycée Excellence Saint-Louis', dateActivation: '14/01/2024', dateExpiration: '14/01/2027', statut: 'Active', prix: '14 400 € / an', duree: '36 mois' },
    { id: 'LIC-9902', code: 'ALT-2026-BULK-9902-X', type: 'Établissement Bulk', titulaire: 'Collège International Marie Curie', dateActivation: '02/03/2024', dateExpiration: '02/03/2027', statut: 'Active', prix: '10 200 € / an', duree: '36 mois' },
    { id: 'LIC-9903', code: 'ALT-2026-PACK-7710-P', type: 'Institutionnel Pack', titulaire: 'Ministère de l\'Éducation CI', dateActivation: '01/09/2025', dateExpiration: '01/09/2026', statut: 'Renouvelée', prix: '45 000 € / an', duree: '12 mois' },
    { id: 'LIC-9904', code: 'ALT-2026-SOLO-1092-F', type: 'Parent Solo', titulaire: 'Famille Kouassi', dateActivation: '10/10/2025', dateExpiration: '10/10/2026', statut: 'Active', prix: '120 € / an', duree: '12 mois' },
    { id: 'LIC-9905', code: 'ALT-2025-SOLO-0044-F', type: 'Parent Solo', titulaire: 'Famille Ndao', dateActivation: '05/05/2025', dateExpiration: '05/05/2026', statut: 'Expirée', prix: '120 € / an', duree: '12 mois' },
  ];
}
