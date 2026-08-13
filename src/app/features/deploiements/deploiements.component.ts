import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DeploymentHistory {
  id: string;
  version: string;
  canal: 'Canari (10%)' | 'Flotte Globale (100%)' | 'Bêta Établissements';
  date: string;
  statut: 'Succès' | 'En cours' | 'Rollback';
  boitiersImpactes: string;
  auteur: string;
}

@Component({
  selector: 'app-deploiements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content">

      <!-- HEADER -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow">Mises à jour OTA & CI/CD</div>
          <h1 class="page-header__title">Déploiements du Firmware & Logiciels</h1>
          <p class="page-header__subtitle">Historique des versions OTA (Over-The-Air) et contrôle de Rollback des boîtiers</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn--secondary text-danger">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Rollback Immédiat
          </button>
          <button class="btn btn--primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Planifier une v3.3.0 OTA
          </button>
        </div>
      </div>

      <!-- CURRENT VERSION HERO CARD -->
      <div class="card mb-6 bg-white" style="border-left: 4px solid var(--c-brand);">
        <div class="flex flex-wrap justify-between items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="badge badge--success">VERSION EN PRODUCTION</span>
              <span class="tag text-mono font-bold text-brand">v3.2.1-prod</span>
            </div>
            <h3 class="text-lg font-bold text-text mt-2">Alternia IoT OS & Moteur IA Local</h3>
            <p class="text-xs text-secondary mt-1">Déployé avec succès sur 11 203 boîtiers (87.2% du parc global). Correctif de sécurité et amélioration du temps de synchro hors-ligne.</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <div class="text-xs text-subtle">Taux de Réussite</div>
              <div class="font-mono text-lg font-bold text-success">99.8%</div>
            </div>
            <button class="btn btn--secondary">Journal de Release (Changelog)</button>
          </div>
        </div>
      </div>

      <!-- DEPLOYMENTS TABLE -->
      <div class="table-wrap bg-white">
        <table>
          <thead>
            <tr>
              <th>ID Déploiement</th>
              <th>Version Firmware</th>
              <th>Canal de diffusion</th>
              <th>Boîtiers touchés</th>
              <th>Déclenché par</th>
              <th>Date & Heure</th>
              <th>Résultat</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (d of history; track d.id) {
              <tr>
                <td class="font-mono text-xs font-semibold text-brand">{{ d.id }}</td>
                <td>
                  <span class="tag font-mono font-bold">{{ d.version }}</span>
                </td>
                <td class="text-xs font-medium text-text">{{ d.canal }}</td>
                <td class="font-mono text-xs">{{ d.boitiersImpactes }}</td>
                <td class="text-xs text-secondary">{{ d.auteur }}</td>
                <td class="text-xs text-subtle">{{ d.date }}</td>
                <td>
                  @if (d.statut === 'Succès') {
                    <span class="badge badge--success">Succès</span>
                  } @else if (d.statut === 'En cours') {
                    <span class="badge badge--info">En cours</span>
                  } @else {
                    <span class="badge badge--danger">Rollback</span>
                  }
                </td>
                <td style="text-align: right;">
                  <button class="btn btn--ghost btn--sm">Journal</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

    </div>
  `
})
export class DeploiementsComponent {
  readonly history: DeploymentHistory[] = [
    { id: 'DEP-8891', version: 'v3.2.1-prod', canal: 'Flotte Globale (100%)', date: '12/08/2026 04:00', statut: 'Succès', boitiersImpactes: '11 203 / 12 847', auteur: 'DevOps Automated Bot' },
    { id: 'DEP-8890', version: 'v3.2.1-rc1', canal: 'Canari (10%)', date: '10/08/2026 22:30', statut: 'Succès', boitiersImpactes: '1 284', auteur: 'Lead IoT Architect' },
    { id: 'DEP-8889', version: 'v3.2.0-ota', canal: 'Bêta Établissements', date: '01/08/2026 14:15', statut: 'Rollback', boitiersImpactes: '210', auteur: 'System Integration Admin' },
    { id: 'DEP-8888', version: 'v3.1.9-prod', canal: 'Flotte Globale (100%)', date: '15/07/2026 03:00', statut: 'Succès', boitiersImpactes: '12 100', auteur: 'DevOps Automated Bot' },
  ];
}
