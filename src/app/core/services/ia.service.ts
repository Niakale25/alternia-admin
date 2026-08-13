import { Injectable, signal, computed } from '@angular/core';
import { IaModelDTO, ServerNodeDTO } from '../models/admin-dto.model';

@Injectable({
  providedIn: 'root'
})
export class IaService {
  private readonly _models = signal<IaModelDTO[]>([
    { id: 'IA-01', nom: 'GPT-Alternia Core', version: 'v4.2.0', domaine: 'Modèle Pédagogique Général', statut: 'Actif', tempsReponseMoyenMs: 89, tauxErreurPercent: 0.12, consommationJourReq: 840200, disponibilitePercent: 99.98, tokensPerMinute: 4200000 },
    { id: 'IA-02', nom: 'AlterniaMath Moteur STEM', version: 'v3.1.2', domaine: 'Résolution Mathématiques & Sciences', statut: 'Actif', tempsReponseMoyenMs: 67, tauxErreurPercent: 0.08, consommationJourReq: 512400, disponibilitePercent: 99.99, tokensPerMinute: 2100000 },
    { id: 'IA-03', nom: 'AlterniaSVT & Biologie', version: 'v2.0.8', domaine: 'Sciences de la Vie et de la Terre', statut: 'Actif', tempsReponseMoyenMs: 110, tauxErreurPercent: 0.45, consommationJourReq: 310100, disponibilitePercent: 99.85, tokensPerMinute: 1500000 },
    { id: 'IA-04', nom: 'AlterniaLangues V2', version: 'v2.0.0-beta', domaine: 'Traduction & Langues Régionales', statut: 'Entraînement', tempsReponseMoyenMs: 240, tauxErreurPercent: 1.20, consommationJourReq: 184593, disponibilitePercent: 98.40, tokensPerMinute: 900000 },
  ]);

  readonly models = computed(() => this._models());
  readonly totalRequestsToday = computed(() => 1847293);
  readonly averageLatencyMs = computed(() => 124);
  readonly averageErrorRatePercent = computed(() => 0.24);
}

@Injectable({
  providedIn: 'root'
})
export class InfrastructureService {
  private readonly _nodes = signal<ServerNodeDTO[]>([
    { id: 'node-eu-west-1a', region: 'Europe Ouest (Paris)', provider: 'AWS EC2', cpuLoadPercent: 24, ramUsedGb: 32, ramTotalGb: 64, bandwidthMbps: 1200, status: 'Opérationnel' },
    { id: 'node-eu-west-1b', region: 'Europe Ouest (Francfort)', provider: 'AWS EC2', cpuLoadPercent: 31, ramUsedGb: 44, ramTotalGb: 64, bandwidthMbps: 1400, status: 'Opérationnel' },
    { id: 'node-af-south-1a', region: 'Afrique Ouest (Edge Abidjan)', provider: 'Cloudflare Edge', cpuLoadPercent: 68, ramUsedGb: 52, ramTotalGb: 64, bandwidthMbps: 1600, status: 'Charge élevée' },
  ]);

  readonly nodes = computed(() => this._nodes());
  readonly globalCpuPercent = computed(() => 28.4);
  readonly totalRamUsedGb = computed(() => 142);
  readonly totalRamCapacityGb = computed(() => 256);
  readonly outboundTrafficGbps = computed(() => 4.2);
}
