import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ServerNode {
  id: string;
  region: string;
  provider: string;
  cpuLoad: number; // %
  ramUsed: number; // GB
  ramTotal: number; // GB
  bandwidth: string;
  status: 'Opérationnel' | 'Charge élevée' | 'Maintenance';
}

@Component({
  selector: 'app-infrastructure',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content">

      <!-- HEADER -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow">Cloud & Serveurs</div>
          <h1 class="page-header__title">Infrastructure Cloud & Edge</h1>
          <p class="page-header__subtitle">Supervision AWS / Datadog-like de la mémoire, CPU, bande passante et pods Kubernetes</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn--secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            Relancer Auto-scaling
          </button>
        </div>
      </div>

      <!-- METRICS TOP -->
      <div class="kpi-grid mb-6">
        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>CHARGE GLOBAL CPU</span>
            <span class="badge badge--success">28.4%</span>
          </div>
          <div class="metric-value text-brand mt-2">28,4%</div>
          <div class="text-xs text-secondary mt-1">Sur 64 vCPUs distribués</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>UTILISATION RAM</span>
            <span class="badge badge--brand">142 / 256 GB</span>
          </div>
          <div class="metric-value text-cyan mt-2">142 GB</div>
          <div class="text-xs text-secondary mt-1">55.4% de la capacité totale</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>TRAFIC RÉSEAU SORTANT</span>
            <span class="badge badge--brand">4.2 Gbps</span>
          </div>
          <div class="metric-value text-text mt-2">4,2 Gbps</div>
          <div class="text-xs text-secondary mt-1">Peak estimé : 8.0 Gbps</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>BASE DE DONNÉES CLUSTER</span>
            <span class="badge badge--success">PostgreSQL HA</span>
          </div>
          <div class="metric-value text-success mt-2">99,99%</div>
          <div class="text-xs text-secondary mt-1">Réplication multi-régions OK</div>
        </div>
      </div>

      <!-- NODES GRID -->
      <div class="grid-3 mb-6" style="grid-template-columns: repeat(3, 1fr);">
        @for (node of nodes; track node.id) {
          <div class="card">
            <div class="flex justify-between items-center mb-3">
              <div>
                <div class="font-bold text-sm text-text">{{ node.id }}</div>
                <div class="text-xs text-subtle">{{ node.region }} &bull; {{ node.provider }}</div>
              </div>
              <span class="badge" [class.badge--success]="node.status === 'Opérationnel'" [class.badge--warning]="node.status === 'Charge élevée'">
                {{ node.status }}
              </span>
            </div>

            <div class="flex flex-col gap-3">
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span>Charge vCPU</span>
                  <span class="font-mono text-brand">{{ node.cpuLoad }}%</span>
                </div>
                <div class="progress">
                  <div class="progress__bar" [class.progress__bar--accent]="node.cpuLoad > 60" [style.width.%]="node.cpuLoad"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span>Mémoire RAM</span>
                  <span class="font-mono text-cyan">{{ node.ramUsed }} / {{ node.ramTotal }} GB</span>
                </div>
                <div class="progress">
                  <div class="progress__bar progress__bar--cyan" [style.width.%]="(node.ramUsed / node.ramTotal) * 100"></div>
                </div>
              </div>

              <div class="flex justify-between text-xs text-secondary border-t pt-2 border-border-light">
                <span>Bande passante :</span>
                <span class="font-mono font-medium text-text">{{ node.bandwidth }}</span>
              </div>
            </div>
          </div>
        }
      </div>

    </div>
  `
})
export class InfrastructureComponent {
  readonly nodes: ServerNode[] = [
    { id: 'node-eu-west-1a', region: 'Europe Ouest (Paris)', provider: 'AWS EC2', cpuLoad: 24, ramUsed: 32, ramTotal: 64, bandwidth: '1.2 Gbps', status: 'Opérationnel' },
    { id: 'node-eu-west-1b', region: 'Europe Ouest (Francfort)', provider: 'AWS EC2', cpuLoad: 31, ramUsed: 44, ramTotal: 64, bandwidth: '1.4 Gbps', status: 'Opérationnel' },
    { id: 'node-af-south-1a', region: 'Afrique Ouest (Edge Abidjan)', provider: 'Cloudflare Edge', cpuLoad: 68, ramUsed: 52, ramTotal: 64, bandwidth: '1.6 Gbps', status: 'Charge élevée' },
  ];
}
