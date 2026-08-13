import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../shared/components/toast/toast.service';

export interface Abonnement {
  id: string;
  parentNom: string;
  parentEmail: string;
  type: 'Premium Annuel' | 'Standard Mensuel' | 'Découverte';
  montant: number;
  dateDebut: string;
  dateRenouvellement: string;
  statut: 'Actif' | 'Résilié' | 'En attente de paiement' | 'Suspendu';
  autoRenouvellement: boolean;
}

@Component({
  selector: 'app-abonnements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-content">

      <!-- EN-TÊTE -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow">Commercial & Revenus</div>
          <h1 class="page-header__title">Abonnements Parents</h1>
          <p class="page-header__subtitle">Gestion des abonnements individuels et renouvellements automatiques</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn--secondary" (click)="exporter()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Exporter
          </button>
          <button class="btn btn--primary" (click)="showCreateModal.set(true)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nouvel abonnement
          </button>
        </div>
      </div>

      <!-- KPIs -->
      <div class="kpi-grid mb-6">
        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>ABONNEMENTS ACTIFS</span>
            <span class="badge badge--success">+12,4%</span>
          </div>
          <div class="metric-value text-brand mt-2">48 391</div>
          <div class="text-xs text-secondary mt-1">Abonnements en cours</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>REVENUS ABONNEMENTS (MRR)</span>
            <span class="badge badge--success">+9,3%</span>
          </div>
          <div class="metric-value text-cyan mt-2">81 000 000 FCFA</div>
          <div class="text-xs text-secondary mt-1">Revenu mensuel récurrent parents</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>RENOUVELLEMENTS (30J)</span>
            <span class="badge badge--warning">À traiter</span>
          </div>
          <div class="metric-value text-accent mt-2">2 847</div>
          <div class="text-xs text-secondary mt-1">Abonnements à renouveler</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>TAUX DE RÉTENTION</span>
            <span class="badge badge--success">Excellent</span>
          </div>
          <div class="metric-value text-success mt-2">96,8%</div>
          <div class="text-xs text-secondary mt-1">Taux de renouvellement parents</div>
        </div>
      </div>

      <!-- FILTRES -->
      <div class="card mb-4">
        <div class="flex flex-wrap gap-3 items-center justify-between">
          <div class="search-box flex-1" style="max-width: 340px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Rechercher un parent ou un type..." [ngModel]="recherche()" (ngModelChange)="recherche.set($event)" />
          </div>
          <div class="flex gap-2 flex-wrap">
            @for (type of typesAbonnement; track type) {
              <button
                class="btn btn--sm"
                [class.btn--primary]="filtreType() === type"
                [class.btn--ghost]="filtreType() !== type"
                (click)="filtreType.set(type)"
              >{{ type }}</button>
            }
          </div>
        </div>
      </div>

      <!-- TABLEAU -->
      <div class="card p-0" style="overflow: hidden;">
        <div class="table-wrap">
          <table style="min-width: 760px;">
            <thead>
              <tr>
                <th>Parent</th>
                <th>Type d'abonnement</th>
                <th>Montant</th>
                <th>Début</th>
                <th>Renouvellement</th>
                <th>Auto-renouvellement</th>
                <th>Statut</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (ab of filteredAbonnements(); track ab.id) {
                <tr>
                  <td>
                    <div class="font-medium text-text">{{ ab.parentNom }}</div>
                    <div class="text-xs text-subtle">{{ ab.parentEmail }}</div>
                  </td>
                  <td>
                    <span class="badge"
                      [class.badge--brand]="ab.type === 'Premium Annuel'"
                      [class.badge--info]="ab.type === 'Standard Mensuel'"
                      [class.badge--neutral]="ab.type === 'Découverte'"
                    >{{ ab.type }}</span>
                  </td>
                  <td>
                    <span class="font-semibold text-text white-space-nowrap">{{ ab.montant | number }} FCFA</span>
                    <div class="text-xs text-subtle">{{ ab.type.includes('Annuel') ? '/an' : '/mois' }}</div>
                  </td>
                  <td class="text-secondary whitespace-nowrap">{{ ab.dateDebut }}</td>
                  <td>
                    <span [class.text-accent]="estBientotExpire(ab.dateRenouvellement)" class="font-medium whitespace-nowrap">
                      {{ ab.dateRenouvellement }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" [class.badge--success]="ab.autoRenouvellement" [class.badge--neutral]="!ab.autoRenouvellement">
                      {{ ab.autoRenouvellement ? 'Activé' : 'Désactivé' }}
                    </span>
                  </td>
                  <td>
                    <span class="badge"
                      [class.badge--success]="ab.statut === 'Actif'"
                      [class.badge--danger]="ab.statut === 'En attente de paiement'"
                      [class.badge--neutral]="ab.statut === 'Résilié'"
                      [class.badge--warning]="ab.statut === 'Suspendu'"
                    >{{ ab.statut }}</span>
                  </td>
                  <td style="text-align: right;">
                    <div class="flex justify-end gap-1">
                      <button class="btn btn--ghost btn--sm btn--icon" data-tooltip="Modifier" (click)="selectedAbonnement.set(ab)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      </button>
                      <button class="btn btn--ghost btn--sm btn--icon" data-tooltip="Renouveler" (click)="renouveler(ab)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="p-8 text-center text-secondary">
                    Aucun abonnement correspondant à votre recherche.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL DETAILS / EDIT -->
      @if (selectedAbonnement(); as ab) {
        <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 1rem;">
          <div class="card" style="width: 100%; max-width: 480px; background: white; border-radius: var(--r-xl); box-shadow: var(--s-xl);">
            <div class="flex justify-between items-start mb-4">
              <div>
                <span class="badge badge--brand mb-1">Abonnement Parent</span>
                <h3 class="text-lg font-bold text-text">{{ ab.parentNom }}</h3>
                <p class="text-xs text-secondary">{{ ab.parentEmail }}</p>
              </div>
              <button class="btn btn--ghost btn--sm btn--icon" (click)="selectedAbonnement.set(null)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="grid-3 mb-4" style="grid-template-columns: 1fr 1fr; background: var(--c-surface); padding: 1rem; border-radius: var(--r-lg);">
              <div>
                <div class="text-xs text-subtle">Offre Souscrite</div>
                <div class="font-semibold text-sm mt-1 text-brand">{{ ab.type }}</div>
              </div>
              <div>
                <div class="text-xs text-subtle">Montant</div>
                <div class="font-semibold text-sm mt-1">{{ ab.montant | number }} FCFA</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Date de Début</div>
                <div class="font-semibold text-xs mt-1">{{ ab.dateDebut }}</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Renouvellement</div>
                <div class="font-semibold text-xs mt-1 text-accent">{{ ab.dateRenouvellement }}</div>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
              <button class="btn btn--ghost" (click)="selectedAbonnement.set(null)">Fermer</button>
              <button class="btn btn--primary" (click)="enregistrerModification(ab)">Sauvegarder</button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL CREATE -->
      @if (showCreateModal()) {
        <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 1rem;">
          <div class="card" style="width: 100%; max-width: 480px; background: white; border-radius: var(--r-xl); box-shadow: var(--s-xl);">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-bold text-text">Nouvel Abonnement Parent</h3>
                <p class="text-xs text-secondary">Créer ou associer une formule pour un tuteur</p>
              </div>
              <button class="btn btn--ghost btn--sm btn--icon" (click)="showCreateModal.set(false)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="flex flex-col gap-3">
              <div>
                <label class="text-xs font-semibold text-secondary mb-1 block">Nom du Parent / Tuteur</label>
                <input type="text" class="input" placeholder="Ex: Diarra Ousmane" />
              </div>
              <div>
                <label class="text-xs font-semibold text-secondary mb-1 block">Email</label>
                <input type="email" class="input" placeholder="o.diarra&#64;gmail.com" />
              </div>
              <div>
                <label class="text-xs font-semibold text-secondary mb-1 block">Formule</label>
                <select class="input">
                  <option>Premium Annuel (100 000 FCFA/an)</option>
                  <option>Standard Mensuel (10 000 FCFA/mois)</option>
                  <option>Découverte (Gratuit)</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
              <button class="btn btn--ghost" (click)="showCreateModal.set(false)">Annuler</button>
              <button class="btn btn--primary" (click)="creerAbonnement()">Valider l'abonnement</button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class AbonnementsComponent {
  private toastService = inject(ToastService);

  recherche = signal('');
  filtreType = signal('Tous');
  selectedAbonnement = signal<Abonnement | null>(null);
  showCreateModal = signal(false);

  readonly typesAbonnement = ['Tous', 'Premium Annuel', 'Standard Mensuel', 'Découverte'];

  readonly abonnements = signal<Abonnement[]>([
    { id: 'ab-01', parentNom: 'Diallo Aminata', parentEmail: 'a.diallo@gmail.com', type: 'Premium Annuel', montant: 100000, dateDebut: '15 jan. 2026', dateRenouvellement: '15 jan. 2027', statut: 'Actif', autoRenouvellement: true },
    { id: 'ab-02', parentNom: 'Kouyaté Moussa', parentEmail: 'm.kouyate@yahoo.fr', type: 'Standard Mensuel', montant: 10000, dateDebut: '1er fév. 2026', dateRenouvellement: '1er sept. 2026', statut: 'Actif', autoRenouvellement: true },
    { id: 'ab-03', parentNom: 'Traoré Ibrahim', parentEmail: 'i.traore@outlook.com', type: 'Premium Annuel', montant: 100000, dateDebut: '10 jan. 2026', dateRenouvellement: '10 jan. 2027', statut: 'Actif', autoRenouvellement: false },
    { id: 'ab-04', parentNom: 'Coulibaly Fatoumata', parentEmail: 'f.coulibaly@gmail.com', type: 'Découverte', montant: 0, dateDebut: '1er août 2026', dateRenouvellement: '31 août 2026', statut: 'Actif', autoRenouvellement: false },
    { id: 'ab-05', parentNom: 'Sanogo Bakary', parentEmail: 'b.sanogo@gmail.com', type: 'Standard Mensuel', montant: 10000, dateDebut: '15 juil. 2026', dateRenouvellement: '15 août 2026', statut: 'En attente de paiement', autoRenouvellement: true },
    { id: 'ab-06', parentNom: 'Keïta Mariama', parentEmail: 'm.keita@yahoo.fr', type: 'Premium Annuel', montant: 100000, dateDebut: '5 fév. 2025', dateRenouvellement: '5 fév. 2026', statut: 'Résilié', autoRenouvellement: false },
  ]);

  filteredAbonnements = computed(() => {
    const q = this.recherche().toLowerCase().trim();
    const ft = this.filtreType();

    return this.abonnements().filter(a => {
      const matchSearch = !q || a.parentNom.toLowerCase().includes(q) || a.parentEmail.toLowerCase().includes(q);
      const matchType = ft === 'Tous' || a.type === ft;
      return matchSearch && matchType;
    });
  });

  exporter() {
    this.toastService.show('Exportation du listing des abonnements parents...', 'info');
  }

  renouveler(ab: Abonnement) {
    this.toastService.show(`Renouvellement de l'abonnement pour ${ab.parentNom} initié.`, 'success');
  }

  enregistrerModification(ab: Abonnement) {
    this.selectedAbonnement.set(null);
    this.toastService.show(`Abonnement de ${ab.parentNom} mis à jour.`, 'success');
  }

  creerAbonnement() {
    this.showCreateModal.set(false);
    this.toastService.show('Nouvel abonnement créé avec succès.', 'success');
  }

  estBientotExpire(date: string): boolean {
    return date.includes('août 2026') || date.includes('sept. 2026');
  }
}
