import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoitierService } from '../../core/services/boitier.service';
import { BoitierDTO } from '../../core/models/admin-dto.model';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../shared/components/toast/toast.service';

@Component({
  selector: 'app-boitiers',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonLoaderComponent, EmptyStateComponent],
  template: `
    <div class="page-content">

      <!-- HEADER -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow">Parc Matériel & Dispositifs</div>
          <h1 class="page-header__title">Gestion des Boîtiers Alternia</h1>
          <p class="page-header__subtitle">Supervision en temps réel des {{ boitierService.totalDeployedCount() | number }} boîtiers intelligents déployés</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn--secondary" (click)="refreshList()" [disabled]="isLoading()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.animate-spin]="isLoading()"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            Actualiser
          </button>
          <button class="btn btn--primary" (click)="registerBox()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Enregistrer un Boîtier
          </button>
        </div>
      </div>

      <!-- KPI METRICS -->
      <div class="kpi-grid mb-6">
        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>TOTAL DÉPLOYÉS</span>
            <span class="badge badge--brand">Globaux</span>
          </div>
          @if (isLoading()) {
            <app-skeleton-loader width="80px" height="32px" class="mt-2"></app-skeleton-loader>
          } @else {
            <div class="metric-value mt-2">{{ boitierService.totalDeployedCount() | number }}</div>
          }
          <div class="text-xs text-secondary mt-1">100% enregistrés en base</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>EN LIGNE</span>
            <span class="status-dot status-dot--online"></span>
          </div>
          @if (isLoading()) {
            <app-skeleton-loader width="80px" height="32px" class="mt-2"></app-skeleton-loader>
          } @else {
            <div class="metric-value text-success mt-2">{{ boitierService.onlineCount() | number }}</div>
          }
          <div class="text-xs text-secondary mt-1">87.2% du parc actif</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>SYNCHRONISATION</span>
            <span class="status-dot status-dot--syncing"></span>
          </div>
          @if (isLoading()) {
            <app-skeleton-loader width="80px" height="32px" class="mt-2"></app-skeleton-loader>
          } @else {
            <div class="metric-value text-cyan mt-2">{{ boitierService.syncingCount() | number }}</div>
          }
          <div class="text-xs text-secondary mt-1">Transferts de journaux OTA</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>MAINTENANCE / HORS LIGNE</span>
            <span class="status-dot status-dot--warning"></span>
          </div>
          @if (isLoading()) {
            <app-skeleton-loader width="80px" height="32px" class="mt-2"></app-skeleton-loader>
          } @else {
            <div class="metric-value text-accent mt-2">{{ boitierService.maintenanceCount() | number }}</div>
          }
          <div class="text-xs text-secondary mt-1">En diagnostic requis</div>
        </div>
      </div>

      <!-- FILTERS & SEARCH BAR -->
      <div class="card mb-4">
        <div class="flex flex-wrap justify-between items-center gap-3">
          <div class="search-box flex-1" style="max-width: 380px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Rechercher par N° Série, Établissement, IP..." [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" [disabled]="isLoading()" />
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs text-subtle font-medium">Statut :</span>
            <button class="btn btn--sm" [class.btn--primary]="selectedStatus() === 'Tous'" [class.btn--ghost]="selectedStatus() !== 'Tous'" (click)="selectedStatus.set('Tous')">Tous</button>
            <button class="btn btn--sm" [class.btn--primary]="selectedStatus() === 'En ligne'" [class.btn--ghost]="selectedStatus() !== 'En ligne'" (click)="selectedStatus.set('En ligne')">En ligne</button>
            <button class="btn btn--sm" [class.btn--primary]="selectedStatus() === 'Hors ligne'" [class.btn--ghost]="selectedStatus() !== 'Hors ligne'" (click)="selectedStatus.set('Hors ligne')">Hors ligne</button>
            <button class="btn btn--sm" [class.btn--primary]="selectedStatus() === 'Synchronisation'" [class.btn--ghost]="selectedStatus() !== 'Synchronisation'" (click)="selectedStatus.set('Synchronisation')">Sync</button>
            <button class="btn btn--sm" [class.btn--primary]="selectedStatus() === 'Maintenance'" [class.btn--ghost]="selectedStatus() !== 'Maintenance'" (click)="selectedStatus.set('Maintenance')">Maintenance</button>
          </div>
        </div>
      </div>

      <!-- DATA TABLE -->
      <div class="table-wrap bg-white">
        <table>
          <thead>
            <tr>
              <th>N° Série & MAC</th>
              <th>Établissement</th>
              <th>Statut</th>
              <th>Version Firmware</th>
              <th>Batterie</th>
              <th>Stockage Intégré</th>
              <th>Mode d'exploitation</th>
              <th>Dernière Sync</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            @if (isLoading()) {
              @for (i of [1,2,3,4,5]; track i) {
                <tr>
                  <td><app-skeleton-loader width="140px" height="16px"></app-skeleton-loader></td>
                  <td><app-skeleton-loader width="180px" height="16px"></app-skeleton-loader></td>
                  <td><app-skeleton-loader width="80px" height="24px" borderRadius="12px"></app-skeleton-loader></td>
                  <td><app-skeleton-loader width="90px" height="22px" borderRadius="4px"></app-skeleton-loader></td>
                  <td><app-skeleton-loader width="100px" height="8px"></app-skeleton-loader></td>
                  <td><app-skeleton-loader width="90px" height="8px"></app-skeleton-loader></td>
                  <td><app-skeleton-loader width="110px" height="16px"></app-skeleton-loader></td>
                  <td><app-skeleton-loader width="70px" height="16px"></app-skeleton-loader></td>
                  <td style="text-align: right;"><app-skeleton-loader width="60px" height="28px" borderRadius="6px"></app-skeleton-loader></td>
                </tr>
              }
            } @else {
              @for (b of filteredBoitiers(); track b.id) {
                <tr>
                  <td>
                    <div class="font-semibold text-mono text-brand">{{ b.serialNumber }}</div>
                    <div class="text-xs text-subtle font-mono">{{ b.ipAddress }}</div>
                  </td>
                  <td>
                    <div class="font-medium text-text">{{ b.etablissementNom }}</div>
                    <div class="text-xs text-secondary">ID: {{ b.etablissementId }}</div>
                  </td>
                  <td>
                    @if (b.status === 'En ligne') {
                      <span class="badge badge--success"><span class="status-dot status-dot--online"></span> En ligne</span>
                    } @else if (b.status === 'Synchronisation') {
                      <span class="badge badge--info"><span class="status-dot status-dot--syncing"></span> Sync</span>
                    } @else if (b.status === 'Maintenance') {
                      <span class="badge badge--warning"><span class="status-dot status-dot--warning"></span> Maintenance</span>
                    } @else {
                      <span class="badge badge--danger"><span class="status-dot status-dot--offline"></span> Hors ligne</span>
                    }
                  </td>
                  <td>
                    <span class="tag text-mono">{{ b.firmwareVersion }}</span>
                  </td>
                  <td>
                    <div class="flex items-center gap-2" style="width: 100px;">
                      <div class="progress flex-1">
                        <div class="progress__bar" [class.progress__bar--success]="b.batteryLevel > 40" [class.progress__bar--accent]="b.batteryLevel <= 40 && b.batteryLevel > 15" [class.progress__bar--danger]="b.batteryLevel <= 15" [style.width.%]="b.batteryLevel"></div>
                      </div>
                      <span class="text-xs text-mono font-medium">{{ b.batteryLevel }}%</span>
                    </div>
                  </td>
                  <td>
                    <div class="flex items-center gap-2" style="width: 90px;">
                      <div class="progress flex-1">
                        <div class="progress__bar progress__bar--cyan" [style.width.%]="b.storageUsedPercent"></div>
                      </div>
                      <span class="text-xs text-subtle">{{ b.storageUsedPercent }}%</span>
                    </div>
                  </td>
                  <td>
                    <span class="text-xs font-medium" [class.text-brand]="b.operatingMode === 'Classe Connectée'" [class.text-accent]="b.operatingMode === 'Examen'">
                      {{ b.operatingMode }}
                    </span>
                  </td>
                  <td class="text-xs text-secondary">{{ b.lastSync }}</td>
                  <td style="text-align: right;">
                    <div class="flex justify-end gap-1">
                      <button class="btn btn--ghost btn--sm btn--icon" title="Ping diagnostic" (click)="pingDevice(b)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </button>
                      <button class="btn btn--secondary btn--sm" (click)="selectedBoitier.set(b)">Détails</button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="9" class="p-8">
                    <app-empty-state title="Aucun boîtier correspondant" description="Modifiez vos mots-clés ou filtres pour afficher des appareils de la flotte Alternia.">
                      <svg icon width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <button action class="btn btn--secondary mt-2" (click)="searchQuery.set(''); selectedStatus.set('Tous')">Réinitialiser les filtres</button>
                    </app-empty-state>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- MODAL DETAILS -->
      @if (selectedBoitier(); as b) {
        <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.2s ease;">
          <div class="card" style="width: 100%; max-width: 560px; background: white; border-radius: var(--r-xl); box-shadow: var(--s-xl); animation: scaleIn 0.2s ease;">
            <div class="flex justify-between items-start mb-4">
              <div>
                <span class="badge badge--brand mb-1">Fiche Matériel</span>
                <h3 class="text-lg font-bold text-text">Boîtier {{ b.serialNumber }}</h3>
                <p class="text-xs text-secondary">Établissement lié : {{ b.etablissementNom }}</p>
              </div>
              <button class="btn btn--ghost btn--sm btn--icon" (click)="selectedBoitier.set(null)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="grid-3 mb-4" style="grid-template-columns: 1fr 1fr; background: var(--c-surface); padding: 1rem; border-radius: var(--r-lg);">
              <div>
                <div class="text-xs text-subtle">Statut Réseau</div>
                <div class="font-semibold text-sm mt-1" [class.text-success]="b.status === 'En ligne'" [class.text-danger]="b.status === 'Hors ligne'">{{ b.status }}</div>
              </div>
              <div>
                <div class="text-xs text-subtle">Adresse IP Locale</div>
                <div class="font-mono text-xs font-semibold text-brand mt-1">{{ b.ipAddress }}</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Firmware IoT</div>
                <div class="font-mono text-xs font-semibold mt-1">{{ b.firmwareVersion }}</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Température CPU</div>
                <div class="font-semibold text-sm mt-1" [class.text-accent]="b.cpuTemperature > 45">{{ b.cpuTemperature }}°C</div>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
              <button class="btn btn--ghost" (click)="selectedBoitier.set(null)">Fermer</button>
              <button class="btn btn--secondary" (click)="pingDevice(b)">Ping Diagnostic</button>
              <button class="btn btn--primary" (click)="forceSync(b)">Forcer Synchro OTA</button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class BoitiersComponent implements OnInit {
  boitierService = inject(BoitierService);
  toastService = inject(ToastService);
  
  isLoading = signal(true);
  searchQuery = signal('');
  selectedStatus = signal<'Tous' | 'En ligne' | 'Hors ligne' | 'Synchronisation' | 'Maintenance'>('Tous');
  selectedBoitier = signal<BoitierDTO | null>(null);

  filteredBoitiers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.selectedStatus();

    return this.boitierService.boitiers().filter(b => {
      const matchSearch = !q || b.serialNumber.toLowerCase().includes(q) || b.etablissementNom.toLowerCase().includes(q) || b.ipAddress.includes(q);
      const matchStatus = st === 'Tous' || b.status === st;
      return matchSearch && matchStatus;
    });
  });

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.toastService.info('Données synchronisées', 'Le statut du parc a été mis à jour.');
    }, 800);
  }

  registerBox() {
    this.toastService.info('Enregistrement initié', "Redirection vers l'assistant d'ajout de boîtier.");
  }

  pingDevice(b: BoitierDTO) {
    const result = this.boitierService.pingBoitier(b.id);
    if (result.success) {
      this.toastService.success('Diagnostic Réseau', `Ping vers ${b.serialNumber} réussi. Latence: ${result.latencyMs}ms`);
    } else {
      this.toastService.error('Échec Diagnostic', `Le boîtier ${b.serialNumber} est injoignable.`);
    }
  }

  forceSync(b: BoitierDTO) {
    this.toastService.warning('Synchronisation lancée', `Le transfert OTA a débuté pour ${b.serialNumber}.`);
    this.selectedBoitier.set(null);
  }
}
