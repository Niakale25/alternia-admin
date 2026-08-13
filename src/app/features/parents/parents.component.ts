import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ParentAccount {
  id: string;
  nomFamille: string;
  tuteur: string;
  email: string;
  telephone: string;
  etablissement: string;
  licencesAssocies: number;
  statut: 'Actif' | 'Inactif' | 'Suspendu';
  derniereActivite: string;
  abonnementsType: 'Premium Annuel' | 'Standard Mensuel' | 'Découverte';
}

@Component({
  selector: 'app-parents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-content">

      <!-- HEADER -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow">Comptes & Utilisateurs</div>
          <h1 class="page-header__title">Gestion des Comptes Parents</h1>
          <p class="page-header__subtitle">Supervision des 48 391 comptes d'accès tuteurs et familles connectés</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn--secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Exporter la Liste (CSV)
          </button>
        </div>
      </div>

      <!-- KPI METRICS -->
      <div class="kpi-grid mb-6">
        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>PARENTS CONNECTÉS CE MOIS</span>
            <span class="badge badge--success">+12.4%</span>
          </div>
          <div class="metric-value text-brand mt-2">48 391</div>
          <div class="text-xs text-secondary mt-1">Activité régulière détectée</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>LICENCES ATTRIBUÉES</span>
            <span class="badge badge--cyan">1.28 / famille</span>
          </div>
          <div class="metric-value text-cyan mt-2">61 940</div>
          <div class="text-xs text-secondary mt-1">Total clés actives associées</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>TAUX D'ACTIVATION APP MOBILE</span>
            <span class="badge badge--brand">91.4%</span>
          </div>
          <div class="metric-value text-text mt-2">91,4%</div>
          <div class="text-xs text-secondary mt-1">Application iOS & Android</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>COMPTES EN RENOULLEMENT</span>
            <span class="badge badge--warning">3 892</span>
          </div>
          <div class="metric-value text-accent mt-2">3 892</div>
          <div class="text-xs text-secondary mt-1">Échéance sous 30 jours</div>
        </div>
      </div>

      <!-- FILTERS -->
      <div class="card mb-4">
        <div class="flex flex-wrap justify-between items-center gap-3">
          <div class="search-box flex-1" style="max-width: 380px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Rechercher nom, email, établissement..." [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" />
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-subtle font-medium">Statut :</span>
            <button class="btn btn--sm" [class.btn--primary]="selectedStatut() === 'Tous'" [class.btn--ghost]="selectedStatut() !== 'Tous'" (click)="selectedStatut.set('Tous')">Tous</button>
            <button class="btn btn--sm" [class.btn--primary]="selectedStatut() === 'Actif'" [class.btn--ghost]="selectedStatut() !== 'Actif'" (click)="selectedStatut.set('Actif')">Actifs</button>
            <button class="btn btn--sm" [class.btn--primary]="selectedStatut() === 'Inactif'" [class.btn--ghost]="selectedStatut() !== 'Inactif'" (click)="selectedStatut.set('Inactif')">Inactifs</button>
            <button class="btn btn--sm" [class.btn--primary]="selectedStatut() === 'Suspendu'" [class.btn--ghost]="selectedStatut() !== 'Suspendu'" (click)="selectedStatut.set('Suspendu')">Suspendus</button>
          </div>
        </div>
      </div>

      <!-- TABLE -->
      <div class="table-wrap bg-white">
        <table>
          <thead>
            <tr>
              <th>Famille & Tuteur</th>
              <th>Contact</th>
              <th>Établissement rattaché</th>
              <th>Licences</th>
              <th>Abonnement</th>
              <th>Dernière Connexion</th>
              <th>Statut</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of filteredParents(); track p.id) {
              <tr>
                <td>
                  <div class="font-semibold text-text">Famille {{ p.nomFamille }}</div>
                  <div class="text-xs text-secondary">Tuteur : {{ p.tuteur }}</div>
                </td>
                <td>
                  <div class="text-xs font-mono text-brand">{{ p.email }}</div>
                  <div class="text-xs text-subtle font-mono">{{ p.telephone }}</div>
                </td>
                <td class="text-xs font-medium text-text">{{ p.etablissement }}</td>
                <td>
                  <span class="tag text-mono">{{ p.licencesAssocies }} licence(s)</span>
                </td>
                <td>
                  <span class="text-xs font-semibold" [class.text-brand]="p.abonnementsType === 'Premium Annuel'" [class.text-cyan]="p.abonnementsType === 'Standard Mensuel'">
                    {{ p.abonnementsType }}
                  </span>
                </td>
                <td class="text-xs text-secondary">{{ p.derniereActivite }}</td>
                <td>
                  @if (p.statut === 'Actif') {
                    <span class="badge badge--success"><span class="status-dot status-dot--online"></span> Actif</span>
                  } @else if (p.statut === 'Inactif') {
                    <span class="badge badge--neutral">Inactif</span>
                  } @else {
                    <span class="badge badge--danger"><span class="status-dot status-dot--offline"></span> Suspendu</span>
                  }
                </td>
                <td style="text-align: right;">
                  <div class="flex justify-end gap-1">
                    @if (p.statut === 'Actif') {
                      <button class="btn btn--ghost btn--sm text-accent" (click)="toggleStatut(p)">Désactiver</button>
                    } @else {
                      <button class="btn btn--ghost btn--sm text-success" (click)="toggleStatut(p)">Activer</button>
                    }
                    <button class="btn btn--secondary btn--sm" (click)="selectedParent.set(p)">Consulter</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- MODAL DETAILS -->
      @if (selectedParent(); as p) {
        <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 1rem;">
          <div class="card" style="width: 100%; max-width: 520px; background: white; border-radius: var(--r-xl); box-shadow: var(--s-xl);">
            <div class="flex justify-between items-start mb-4">
              <div>
                <span class="badge badge--cyan mb-1">Profil Tuteur / Famille</span>
                <h3 class="text-lg font-bold text-text">Famille {{ p.nomFamille }}</h3>
                <p class="text-xs text-secondary">{{ p.email }} &bull; {{ p.telephone }}</p>
              </div>
              <button class="btn btn--ghost btn--sm btn--icon" (click)="selectedParent.set(null)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="grid-3 mb-4" style="grid-template-columns: 1fr 1fr; background: var(--c-surface); padding: 1rem; border-radius: var(--r-lg);">
              <div>
                <div class="text-xs text-subtle">Établissement lié</div>
                <div class="font-semibold text-xs text-text mt-1">{{ p.etablissement }}</div>
              </div>
              <div>
                <div class="text-xs text-subtle">Formule d'abonnement</div>
                <div class="font-semibold text-xs text-brand mt-1">{{ p.abonnementsType }}</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Nombre de Licences</div>
                <div class="font-mono text-sm font-semibold mt-1">{{ p.licencesAssocies }} activées</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Dernière activité</div>
                <div class="font-semibold text-xs mt-1 text-secondary">{{ p.derniereActivite }}</div>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
              <button class="btn btn--ghost" (click)="selectedParent.set(null)">Fermer</button>
              <button class="btn btn--secondary">Renvoyer mot de passe</button>
              <button class="btn btn--primary">Réinitialiser Licences</button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class ParentsComponent {
  searchQuery = signal('');
  selectedStatut = signal<'Tous' | 'Actif' | 'Inactif' | 'Suspendu'>('Tous');
  selectedParent = signal<ParentAccount | null>(null);

  readonly parentsList = signal<ParentAccount[]>([
    { id: 'PAR-8801', nomFamille: 'Kouassi', tuteur: 'Jean-Marc Kouassi', email: 'jm.kouassi@gmail.com', telephone: '+225 07 08 12 34 56', etablissement: 'Lycée Excellence Saint-Louis', licencesAssocies: 2, statut: 'Actif', derniereActivite: 'Aujourd\'hui à 14:12', abonnementsType: 'Premium Annuel' },
    { id: 'PAR-8802', nomFamille: 'Diallo', tuteur: 'Aminata Diallo', email: 'a.diallo@sn-tech.com', telephone: '+221 77 450 89 12', etablissement: 'Collège International Marie Curie', licencesAssocies: 1, statut: 'Actif', derniereActivite: 'Aujourd\'hui à 11:45', abonnementsType: 'Standard Mensuel' },
    { id: 'PAR-8803', nomFamille: 'Mbarga', tuteur: 'Paul Mbarga', email: 'paul.mbarga@yahoo.fr', telephone: '+237 699 12 34 88', etablissement: 'Complexe Scolaire La Renaissance', licencesAssocies: 3, statut: 'Actif', derniereActivite: 'Hier à 19:30', abonnementsType: 'Premium Annuel' },
    { id: 'PAR-8804', nomFamille: 'Bamba', tuteur: 'Fatim Bamba', email: 'fatim.bamba@outlook.com', telephone: '+225 05 44 89 00 11', etablissement: 'Lycée Technique Alternia Abidjan', licencesAssocies: 1, statut: 'Inactif', derniereActivite: 'il y a 14 jours', abonnementsType: 'Découverte' },
    { id: 'PAR-8805', nomFamille: 'Benali', tuteur: 'Youssef Benali', email: 'y.benali@maroc-net.ma', telephone: '+212 661 23 45 67', etablissement: 'Académie Royale de Rabat', licencesAssocies: 2, statut: 'Actif', derniereActivite: 'Aujourd\'hui à 16:02', abonnementsType: 'Premium Annuel' },
    { id: 'PAR-8806', nomFamille: 'Ndao', tuteur: 'Ousmane Ndao', email: 'o.ndao@gmail.com', telephone: '+221 70 891 22 33', etablissement: 'École Pilote InnovEd Dakar', licencesAssocies: 1, statut: 'Suspendu', derniereActivite: 'il y a 45 jours', abonnementsType: 'Standard Mensuel' },
  ]);

  filteredParents = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.selectedStatut();

    return this.parentsList().filter(p => {
      const matchSearch = !q || p.nomFamille.toLowerCase().includes(q) || p.tuteur.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.etablissement.toLowerCase().includes(q);
      const matchStatus = st === 'Tous' || p.statut === st;
      return matchSearch && matchStatus;
    });
  });

  toggleStatut(p: ParentAccount) {
    const newStatut = p.statut === 'Actif' ? 'Suspendu' : 'Actif';
    this.parentsList.update(list => list.map(item => item.id === p.id ? { ...item, statut: newStatut } : item));
  }
}
