import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TicketSupport {
  id: string;
  sujet: string;
  etablissement: string;
  priorite: 'Urgent' | 'Haute' | 'Normale' | 'Basse';
  statut: 'Ouvert' | 'En cours' | 'Résolu';
  dateCreation: string;
  assigneA: string;
}

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content">

      <!-- HEADER -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow text-accent">Support Technique & Maintenance</div>
          <h1 class="page-header__title">Centre d'Assistance & Diagnostics</h1>
          <p class="page-header__subtitle">Suivi des tickets d'incidents, interventions matérielles et maintenance préventive</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn--primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nouveau Ticket Support
          </button>
        </div>
      </div>

      <!-- KPI SUMMARY -->
      <div class="kpi-grid mb-6">
        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>TICKETS EN COURS</span>
            <span class="badge badge--warning">3 Ouverts</span>
          </div>
          <div class="metric-value text-accent mt-2">3</div>
          <div class="text-xs text-secondary mt-1">Temps de prise en charge : 14 min</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>TEMPS DE RÉSOLUTION MOYEN</span>
            <span class="badge badge--success">1.8 heures</span>
          </div>
          <div class="metric-value text-success mt-2">1,8h</div>
          <div class="text-xs text-secondary mt-1">96.4% de résolutions au 1er contact</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>INCIDENTS RÉSEAU</span>
            <span class="badge badge--success">Aucun</span>
          </div>
          <div class="metric-value text-brand mt-2">0</div>
          <div class="text-xs text-secondary mt-1">Écosystème stable</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>SATISFACTION CLIENT (CSAT)</span>
            <span class="badge badge--brand">4.9 / 5</span>
          </div>
          <div class="metric-value text-cyan mt-2">4,9/5</div>
          <div class="text-xs text-secondary mt-1">Basé sur 1 420 retours</div>
        </div>
      </div>

      <!-- TICKETS TABLE -->
      <div class="table-wrap bg-white">
        <table>
          <thead>
            <tr>
              <th>N° Ticket</th>
              <th>Sujet / Problème</th>
              <th>Établissement / Source</th>
              <th>Priorité</th>
              <th>Statut</th>
              <th>Assigné à</th>
              <th>Date de création</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (t of tickets; track t.id) {
              <tr>
                <td class="font-mono text-xs font-semibold text-brand">{{ t.id }}</td>
                <td class="font-medium text-text">{{ t.sujet }}</td>
                <td class="text-xs text-secondary">{{ t.etablissement }}</td>
                <td>
                  @if (t.priorite === 'Urgent') {
                    <span class="badge badge--danger">Urgent</span>
                  } @else if (t.priorite === 'Haute') {
                    <span class="badge badge--warning">Haute</span>
                  } @else {
                    <span class="badge badge--neutral">Normale</span>
                  }
                </td>
                <td>
                  @if (t.statut === 'Ouvert') {
                    <span class="badge badge--warning">Ouvert</span>
                  } @else if (t.statut === 'En cours') {
                    <span class="badge badge--info">En cours</span>
                  } @else {
                    <span class="badge badge--success">Résolu</span>
                  }
                </td>
                <td class="text-xs font-medium text-text">{{ t.assigneA }}</td>
                <td class="text-xs text-subtle">{{ t.dateCreation }}</td>
                <td style="text-align: right;">
                  <button class="btn btn--secondary btn--sm">Traiter</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

    </div>
  `
})
export class MaintenanceComponent {
  readonly tickets: TicketSupport[] = [
    { id: 'TCK-4011', sujet: 'Demande de remplacement de batterie boîtier ALT-BOX-8852-X1', etablissement: 'Lycée Technique Alternia Abidjan', priorite: 'Urgent', statut: 'Ouvert', dateCreation: 'Aujourd\'hui 15:10', assigneA: 'Équipe Support Afrique' },
    { id: 'TCK-4010', sujet: 'Latence lors de la génération de corrigé IA SVT', etablissement: 'Collège International Marie Curie', priorite: 'Haute', statut: 'En cours', dateCreation: 'Aujourd\'hui 14:02', assigneA: 'Ingénieur IA Senior' },
    { id: 'TCK-4009', sujet: 'Mise à jour des licences pour 45 nouvelles classes', etablissement: 'Lycée Excellence Saint-Louis', priorite: 'Normale', statut: 'Ouvert', dateCreation: 'Aujourd\'hui 10:25', assigneA: 'Gestionnaire de Compte' },
    { id: 'TCK-4008', sujet: 'Problème de synchronisation horaire NTP sur le sous-réseau', etablissement: 'Académie Royale de Rabat', priorite: 'Normale', statut: 'Résolu', dateCreation: 'Hier 18:40', assigneA: 'Support IoT' },
  ];
}
