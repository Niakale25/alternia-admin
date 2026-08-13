import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Etablissement {
  id: string;
  nom: string;
  ville: string;
  pays: string;
  boitiersCount: number;
  licencesCount: number;
  dateInscription: string;
  statut: 'Actif' | 'En attente' | 'Suspendu';
  directeurEmail: string;
  offre: 'Enterprise' | 'Institutionnel' | 'Standard';
}

interface PaysItem { flag: string; pays: string; count: string; }

@Component({
  selector: 'app-etablissements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-content">

      <!-- HEADER -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow">Réseau des Partenaires</div>
          <h1 class="page-header__title">Établissements Scolaires</h1>
          <p class="page-header__subtitle">Administration des 1 247 centres d'enseignement partenaires dans 14 pays</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn--secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Exporter
          </button>
          <button class="btn btn--primary" (click)="showCreateModal.set(true)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ajouter un Établissement
          </button>
        </div>
      </div>

      <!-- BANNIÈRE PRÉSENCE GÉOGRAPHIQUE -->
      <div class="geo-banner mb-6">
        <div class="geo-banner__text">
          <div class="geo-banner__title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Présence dans 14 pays africains et francophones
          </div>
          <div class="geo-banner__subtitle">Alternia accompagne des établissements du Sénégal au Maroc, de la Côte d'Ivoire au Cameroun.</div>
          <div class="geo-banner__pays">
            @for (p of pays; track p.pays) {
              <div class="geo-pays-item">
                <span class="geo-pays-flag">{{ p.flag }}</span>
                <span class="geo-pays-nom">{{ p.pays }}</span>
                <span class="geo-pays-count">{{ p.count }}</span>
              </div>
            }
          </div>
        </div>
        <div class="geo-banner__visual">
          <div class="geo-globe">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="rgba(49,73,153,0.06)" stroke="rgba(49,73,153,0.15)" stroke-width="1"/>
              <ellipse cx="100" cy="80" rx="35" ry="25" fill="rgba(49,73,153,0.12)" stroke="rgba(49,73,153,0.3)" stroke-width="0.5"/>
              <ellipse cx="80" cy="115" rx="22" ry="30" fill="rgba(64,187,204,0.15)" stroke="rgba(64,187,204,0.4)" stroke-width="0.5"/>
              <ellipse cx="130" cy="120" rx="18" ry="22" fill="rgba(49,73,153,0.10)" stroke="rgba(49,73,153,0.25)" stroke-width="0.5"/>
              <circle cx="85" cy="108" r="4" fill="#40BBCC" opacity="0.9"/>
              <circle cx="85" cy="108" r="8" fill="#40BBCC" opacity="0.2"/>
              <circle cx="100" cy="95" r="3.5" fill="#314999" opacity="0.9"/>
              <circle cx="100" cy="95" r="7" fill="#314999" opacity="0.2"/>
              <circle cx="115" cy="110" r="3" fill="#40BBCC" opacity="0.85"/>
              <circle cx="115" cy="110" r="6" fill="#40BBCC" opacity="0.2"/>
              <circle cx="70" cy="95" r="3" fill="#F1851F" opacity="0.85"/>
              <circle cx="70" cy="95" r="6" fill="#F1851F" opacity="0.2"/>
              <circle cx="125" cy="88" r="2.5" fill="#314999" opacity="0.85"/>
              <line x1="85" y1="108" x2="100" y2="95" stroke="rgba(64,187,204,0.3)" stroke-width="0.75" stroke-dasharray="2,2"/>
              <line x1="100" y1="95" x2="115" y2="110" stroke="rgba(49,73,153,0.3)" stroke-width="0.75" stroke-dasharray="2,2"/>
              <line x1="70" y1="95" x2="85" y2="108" stroke="rgba(241,133,31,0.3)" stroke-width="0.75" stroke-dasharray="2,2"/>
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
          <div class="text-xs text-secondary mt-1">Répartis dans 14 pays</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>MOY. BOÎTIERS / ÉTABLISSEMENT</span>
            <span class="badge badge--brand">10,3</span>
          </div>
          <div class="metric-value text-cyan mt-2">10,3</div>
          <div class="text-xs text-secondary mt-1">Taux de couverture des salles</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>CONTRATS ENTERPRISE</span>
            <span class="badge badge--brand">78%</span>
          </div>
          <div class="metric-value text-text mt-2">972</div>
          <div class="text-xs text-secondary mt-1">Abonnements pluriannuels</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>DEMANDES EN ATTENTE</span>
            <span class="badge badge--warning">17</span>
          </div>
          <div class="metric-value text-accent mt-2">17</div>
          <div class="text-xs text-secondary mt-1">Dossiers d'accréditation</div>
        </div>
      </div>

      <!-- SEARCH & FILTERS -->
      <div class="card mb-4">
        <div class="flex flex-wrap justify-between items-center gap-3">
          <div class="search-box flex-1" style="max-width: 380px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Rechercher un établissement, ville, directeur..." [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" />
          </div>

          <div class="flex items-center gap-2">
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
              <th>Localisation</th>
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
                  <div class="text-xs text-secondary">{{ e.pays }}</div>
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
                <h3 class="text-lg font-bold text-text">Ajouter un Établissement</h3>
                <p class="text-xs text-secondary mt-1">Renseignez les données administratives pour créer un contrat</p>
              </div>
              <button class="btn btn--ghost btn--sm btn--icon" (click)="showCreateModal.set(false)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="flex flex-col gap-4">
              <div>
                <label class="text-xs font-semibold text-secondary mb-1 block">Nom de l'Établissement</label>
                <input type="text" class="input" placeholder="Ex: Lycée International..." />
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <label class="text-xs font-semibold text-secondary mb-1 block">Ville</label>
                  <input type="text" class="input" placeholder="Ex: Abidjan" />
                </div>
                <div>
                  <label class="text-xs font-semibold text-secondary mb-1 block">Pays</label>
                  <input type="text" class="input" placeholder="Ex: Côte d'Ivoire" />
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-secondary mb-1 block">Email de la Direction</label>
                <input type="email" class="input" placeholder="direction&#64;ecole.com" />
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
              <button class="btn btn--primary" (click)="createEtablissement()">Créer le profil</button>
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
                <span class="badge badge--brand mb-2">Fiche Établissement</span>
                <h3 class="text-lg font-bold text-text">{{ e.nom }}</h3>
                <p class="text-xs text-secondary">{{ e.ville }}, {{ e.pays }}</p>
              </div>
              <button class="btn btn--ghost btn--sm btn--icon" (click)="selectedEtab.set(null)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: var(--c-surface); padding: 1rem; border-radius: var(--r-lg); margin-bottom: 1rem;">
              <div>
                <div class="text-xs text-subtle">Statut Contractuel</div>
                <div class="font-semibold text-sm mt-1" [class.text-success]="e.statut === 'Actif'" [class.text-danger]="e.statut === 'Suspendu'" [class.text-accent]="e.statut === 'En attente'">{{ e.statut }}</div>
              </div>
              <div>
                <div class="text-xs text-subtle">Offre Souscrite</div>
                <div class="font-semibold text-sm text-brand mt-1">{{ e.offre }}</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Boîtiers Assignés</div>
                <div class="font-bold text-sm mt-1">{{ e.boitiersCount }} unités</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Licences Familles</div>
                <div class="font-bold text-sm mt-1">{{ e.licencesCount }} comptes</div>
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
      background: linear-gradient(135deg, rgba(49,73,153,0.04) 0%, rgba(64,187,204,0.04) 100%);
      border: 1px solid var(--c-brand-border);
      border-radius: var(--r-xl);
      padding: 1.5rem;
      align-items: center;

      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }

    .geo-banner__title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 700;
      color: var(--c-brand);
      letter-spacing: -0.02em;
      margin-bottom: 4px;
    }

    .geo-banner__subtitle {
      font-size: 12px;
      color: var(--c-secondary);
      margin-bottom: 12px;
    }

    .geo-banner__pays {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .geo-pays-item {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-full);
      cursor: default;
      transition: all var(--t-fast);

      &:hover {
        border-color: var(--c-brand-border);
        background: var(--c-brand-bg);
        transform: translateY(-1px);
      }
    }

    .geo-pays-flag { font-size: 14px; line-height: 1; }
    .geo-pays-nom { font-size: 11px; font-weight: 600; color: var(--c-text); }
    .geo-pays-count {
      font-size: 10px;
      font-weight: 700;
      color: var(--c-brand);
      background: var(--c-brand-bg);
      border-radius: var(--r-full);
      padding: 1px 5px;
    }

    .geo-banner__visual {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .geo-globe {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: radial-gradient(circle at 38% 32%, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.6) 100%);
      box-shadow: 0 8px 24px rgba(49,73,153,0.12), inset 0 0 30px rgba(64,187,204,0.05);
      border: 1px solid rgba(49,73,153,0.12);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      svg { width: 100%; height: 100%; }
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
  showCreateModal = signal(false);
  selectedEtab = signal<Etablissement | null>(null);

  readonly pays: PaysItem[] = [
    { flag: '🇲🇱', pays: 'Mali', count: '312' },
    { flag: '🇨🇮', pays: 'Côte d\'Ivoire', count: '248' },
    { flag: '🇸🇳', pays: 'Sénégal', count: '196' },
    { flag: '🇨🇲', pays: 'Cameroun', count: '143' },
    { flag: '🇲🇦', pays: 'Maroc', count: '118' },
    { flag: '🇧🇫', pays: 'Burkina Faso', count: '87' },
    { flag: '🇬🇳', pays: 'Guinée', count: '64' },
    { flag: '🇹🇬', pays: 'Togo', count: '42' },
    { flag: '🇧🇯', pays: 'Bénin', count: '37' },
  ];

  readonly etablissementsList = signal<Etablissement[]>([
    { id: 'ETAB-101', nom: 'Lycée Excellence Saint-Louis', ville: 'Abidjan', pays: 'Côte d\'Ivoire', boitiersCount: 24, licencesCount: 1200, dateInscription: '14/01/2024', statut: 'Actif', directeurEmail: 'direction@stlouis-abidjan.ci', offre: 'Enterprise' },
    { id: 'ETAB-102', nom: 'Collège International Marie Curie', ville: 'Dakar', pays: 'Sénégal', boitiersCount: 18, licencesCount: 850, dateInscription: '02/03/2024', statut: 'Actif', directeurEmail: 'admin@curie-dakar.sn', offre: 'Institutionnel' },
    { id: 'ETAB-103', nom: 'Complexe Scolaire La Renaissance', ville: 'Douala', pays: 'Cameroun', boitiersCount: 30, licencesCount: 1500, dateInscription: '19/11/2023', statut: 'Actif', directeurEmail: 'contact@renaissance-douala.cm', offre: 'Enterprise' },
    { id: 'ETAB-104', nom: 'Lycée Technique Alternia Abidjan', ville: 'Abidjan', pays: 'Côte d\'Ivoire', boitiersCount: 12, licencesCount: 450, dateInscription: '05/05/2024', statut: 'Actif', directeurEmail: 'proviseur@lta-abidjan.ci', offre: 'Standard' },
    { id: 'ETAB-105', nom: 'École Pilote InnovEd Dakar', ville: 'Dakar', pays: 'Sénégal', boitiersCount: 8, licencesCount: 300, dateInscription: '12/06/2026', statut: 'En attente', directeurEmail: 'direction@innoved-dakar.sn', offre: 'Standard' },
    { id: 'ETAB-106', nom: 'Académie Royale de Rabat', ville: 'Rabat', pays: 'Maroc', boitiersCount: 42, licencesCount: 2100, dateInscription: '10/09/2023', statut: 'Actif', directeurEmail: 'secretariat@academie-rabat.ma', offre: 'Enterprise' },
    { id: 'ETAB-107', nom: 'Institut Supérieur Yaoundé', ville: 'Yaoundé', pays: 'Cameroun', boitiersCount: 15, licencesCount: 780, dateInscription: '22/02/2024', statut: 'Suspendu', directeurEmail: 'admin@isy-yaounde.cm', offre: 'Institutionnel' },
    { id: 'ETAB-108', nom: 'Lycée Mamadou Konaté', ville: 'Bamako', pays: 'Mali', boitiersCount: 20, licencesCount: 940, dateInscription: '01/03/2025', statut: 'Actif', directeurEmail: 'direction@lmk-bamako.ml', offre: 'Enterprise' },
    { id: 'ETAB-109', nom: 'CEM Hamdallaye', ville: 'Bamako', pays: 'Mali', boitiersCount: 14, licencesCount: 620, dateInscription: '15/04/2025', statut: 'Actif', directeurEmail: 'cem.hamdallaye@education.ml', offre: 'Standard' },
  ]);

  filteredEtablissements = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.selectedStatut();

    return this.etablissementsList().filter(e => {
      const matchSearch = !q || e.nom.toLowerCase().includes(q) || e.ville.toLowerCase().includes(q) || e.pays.toLowerCase().includes(q);
      const matchStatus = st === 'Tous' || e.statut === st;
      return matchSearch && matchStatus;
    });
  });

  toggleStatut(e: Etablissement) {
    const newStatut = e.statut === 'Actif' ? 'Suspendu' : 'Actif';
    this.etablissementsList.update(list => list.map(item => item.id === e.id ? { ...item, statut: newStatut } : item));
  }

  createEtablissement() {
    this.showCreateModal.set(false);
  }
}
