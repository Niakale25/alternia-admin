import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { ToastService } from '../../shared/components/toast/toast.service';

export interface MoteurIA {
  id: string;
  nom: string;
  matiereCiblee: string;
  niveauxCibles: string[];
  statut: 'Actif' | 'En formation' | 'Maintenance';
  questionsTraiteesJour: number;
  questionsTraiteesTotal: number;
  langues: string[];
  dateDeploiement: string;
  tauxSatisfaction: number;
  icon: string;
}

@Component({
  selector: 'app-moteurs-ia',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="page-content">

      <!-- EN-TÊTE -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow text-cyan">Intelligence Artificielle Pédagogique</div>
          <h1 class="page-header__title">Moteurs IA Alternia</h1>
          <p class="page-header__subtitle">
            Moteurs d'intelligence artificielle spécialisés par discipline — Écosystème éducatif Alternia
          </p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn--secondary" (click)="exportReport()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Rapport d'utilisation
          </button>
          <button class="btn btn--primary" (click)="showCreateModal.set(true)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>
            Nouveau moteur
          </button>
        </div>
      </div>

      <!-- MÉTRIQUES GLOBALES -->
      <div class="kpi-grid mb-6">
        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>QUESTIONS TRAITÉES AUJOURD'HUI</span>
            <span class="badge badge--info">+18,5%</span>
          </div>
          <div class="metric-value text-cyan mt-2">1,84M</div>
          <div class="text-xs text-secondary mt-1">Par l'ensemble des moteurs actifs</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>MOTEURS ACTIFS</span>
            <span class="badge badge--success">{{ moteurs.length }}</span>
          </div>
          <div class="metric-value text-brand mt-2">{{ moteursActifs }}</div>
          <div class="text-xs text-secondary mt-1">Moteurs opérationnels</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>DISCIPLINES COUVERTES</span>
          </div>
          <div class="metric-value text-text mt-2">{{ disciplines }}</div>
          <div class="text-xs text-secondary mt-1">Matières scolaires supportées</div>
        </div>

        <div class="card flex flex-col justify-between">
          <div class="flex justify-between items-center text-subtle text-xs">
            <span>SATISFACTION MOYENNE</span>
            <span class="badge badge--success">Excellent</span>
          </div>
          <div class="metric-value text-success mt-2">96,4%</div>
          <div class="text-xs text-secondary mt-1">Taux de satisfaction pédagogique</div>
        </div>
      </div>

      <!-- GRILLE DES MOTEURS IA -->
      <div class="moteurs-grid mb-6">
        @for (moteur of moteurs; track moteur.id) {
          <div class="moteur-card">
            <div class="moteur-card__header">
              <div class="moteur-card__icon-wrap">
                <span [innerHTML]="moteur.icon | safeHtml"></span>
              </div>
              <div class="moteur-card__meta">
                <span
                  class="badge"
                  [class.badge--success]="moteur.statut === 'Actif'"
                  [class.badge--warning]="moteur.statut === 'En formation'"
                  [class.badge--neutral]="moteur.statut === 'Maintenance'"
                >
                  {{ moteur.statut }}
                </span>
              </div>
            </div>

            <h3 class="moteur-card__nom">{{ moteur.nom }}</h3>
            <div class="moteur-card__matiere">{{ moteur.matiereCiblee }}</div>

            <div class="moteur-card__niveaux">
              @for (n of moteur.niveauxCibles; track n) {
                <span class="tag">{{ n }}</span>
              }
            </div>

            <div class="moteur-card__langues">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {{ moteur.langues.join(', ') }}
            </div>

            <div class="moteur-card__stats">
              <div class="moteur-card__stat">
                <div class="moteur-card__stat-value">{{ moteur.questionsTraiteesJour | number }}</div>
                <div class="moteur-card__stat-label">questions aujourd'hui</div>
              </div>
              <div class="moteur-card__stat">
                <div class="moteur-card__stat-value">{{ moteur.tauxSatisfaction }}%</div>
                <div class="moteur-card__stat-label">satisfaction</div>
              </div>
            </div>

            <!-- Barre de satisfaction -->
            <div class="moteur-card__satisfaction">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-subtle">Satisfaction pédagogique</span>
                <span class="font-bold text-cyan">{{ moteur.tauxSatisfaction }}%</span>
              </div>
              <div class="progress">
                <div
                  class="progress__bar progress__bar--cyan"
                  [style.width.%]="moteur.tauxSatisfaction"
                ></div>
              </div>
            </div>

            <div class="moteur-card__footer">
              <span class="text-xs text-subtle">Déployé le {{ moteur.dateDeploiement }}</span>
              <button class="btn btn--ghost btn--sm" (click)="selectedMoteur.set(moteur)">Détails</button>
            </div>
          </div>
        }
      </div>

      <!-- MODAL DETAILS -->
      @if (selectedMoteur(); as m) {
        <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 1rem;">
          <div class="card" style="width: 100%; max-width: 520px; background: white; border-radius: var(--r-xl); box-shadow: var(--s-xl);">
            <div class="flex justify-between items-start mb-4">
              <div>
                <span class="badge badge--cyan mb-1">Moteur Pédagogique IA</span>
                <h3 class="text-lg font-bold text-text">{{ m.nom }}</h3>
                <p class="text-xs text-secondary">Matière : {{ m.matiereCiblee }}</p>
              </div>
              <button class="btn btn--ghost btn--sm btn--icon" (click)="selectedMoteur.set(null)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="grid-3 mb-4" style="grid-template-columns: 1fr 1fr; background: var(--c-surface); padding: 1rem; border-radius: var(--r-lg);">
              <div>
                <div class="text-xs text-subtle">Statut Opérationnel</div>
                <div class="font-semibold text-sm mt-1 text-success">{{ m.statut }}</div>
              </div>
              <div>
                <div class="text-xs text-subtle">Langues Gérées</div>
                <div class="font-semibold text-sm mt-1">{{ m.langues.join(', ') }}</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Questions Totales</div>
                <div class="font-mono text-sm font-semibold mt-1">{{ m.questionsTraiteesTotal | number }}</div>
              </div>
              <div class="mt-2">
                <div class="text-xs text-subtle">Date de Déploiement</div>
                <div class="font-semibold text-xs mt-1 text-secondary">{{ m.dateDeploiement }}</div>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
              <button class="btn btn--ghost" (click)="selectedMoteur.set(null)">Fermer</button>
              <button class="btn btn--primary" (click)="reentrainerMoteur(m)">Ré-entraîner le modèle</button>
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
                <h3 class="text-lg font-bold text-text">Déployer un Nouveau Moteur IA</h3>
                <p class="text-xs text-secondary">Sélectionnez la discipline et configurez l'apprentissage</p>
              </div>
              <button class="btn btn--ghost btn--sm btn--icon" (click)="showCreateModal.set(false)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="flex flex-col gap-3">
              <div>
                <label class="text-xs font-semibold text-secondary mb-1 block">Nom du moteur</label>
                <input type="text" class="input" placeholder="Ex: AlterniaPhysique" />
              </div>
              <div>
                <label class="text-xs font-semibold text-secondary mb-1 block">Discipline / Matière</label>
                <input type="text" class="input" placeholder="Ex: Physique-Chimie" />
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
              <button class="btn btn--ghost" (click)="showCreateModal.set(false)">Annuler</button>
              <button class="btn btn--primary" (click)="creerMoteur()">Lancer le déploiement</button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .moteurs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .moteur-card {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 1.25rem;
      box-shadow: var(--s-xs);
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: box-shadow var(--t-base), transform var(--t-base);

      &:hover {
        box-shadow: var(--s-md);
        transform: translateY(-1px);
      }
    }

    .moteur-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .moteur-card__icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: var(--r-lg);
      background: var(--c-cyan-bg);
      border: 1px solid var(--c-cyan-border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--c-cyan);

      ::ng-deep svg {
        width: 22px;
        height: 22px;
        stroke-width: 1.5;
      }
    }

    .moteur-card__nom {
      font-size: 15px;
      font-weight: 700;
      color: var(--c-text);
      letter-spacing: -0.02em;
      margin-bottom: -4px;
    }

    .moteur-card__matiere {
      font-size: 12px;
      font-weight: 500;
      color: var(--c-brand);
    }

    .moteur-card__niveaux {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .moteur-card__langues {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: var(--c-subtle);
    }

    .moteur-card__stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      padding: 10px;
      background: var(--c-surface);
      border-radius: var(--r-md);
      border: 1px solid var(--c-border-light);
    }

    .moteur-card__stat {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .moteur-card__stat-value {
      font-family: var(--font-tight);
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--c-text);
      letter-spacing: -0.02em;
    }

    .moteur-card__stat-label {
      font-size: 10px;
      color: var(--c-subtle);
    }

    .moteur-card__satisfaction { display: flex; flex-direction: column; }

    .moteur-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--c-border-light);
      padding-top: 10px;
    }
  `]
})
export class MoteursIAComponent {
  toastService = inject(ToastService);
  selectedMoteur = signal<MoteurIA | null>(null);
  showCreateModal = signal(false);

  exportReport() {
    this.toastService.show("Export du rapport d'utilisation des moteurs IA lancé.", 'info');
  }

  reentrainerMoteur(moteur: MoteurIA) {
    this.selectedMoteur.set(null);
    this.toastService.show(`Ré-entraînement de ${moteur.nom} lancé avec succès.`, 'success');
  }

  creerMoteur() {
    this.showCreateModal.set(false);
    this.toastService.show("Déploiement du nouveau moteur IA initié.", 'success');
  }

  get moteursActifs(): number {
    return this.moteurs.filter(m => m.statut === 'Actif').length;
  }

  get disciplines(): number {
    return new Set(this.moteurs.map(m => m.matiereCiblee)).size;
  }

  readonly moteurs: MoteurIA[] = [
    {
      id: 'ia-01',
      nom: 'AlterniaMath',
      matiereCiblee: 'Mathématiques',
      niveauxCibles: ['Primaire', 'Collège', 'Lycée'],
      statut: 'Actif',
      questionsTraiteesJour: 840_200,
      questionsTraiteesTotal: 12_400_000,
      langues: ['Français', 'Bambara'],
      dateDeploiement: '15 jan. 2026',
      tauxSatisfaction: 97.8,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`
    },
    {
      id: 'ia-02',
      nom: 'AlterniaSciences',
      matiereCiblee: 'Sciences & SVT',
      niveauxCibles: ['Collège', 'Lycée'],
      statut: 'Actif',
      questionsTraiteesJour: 512_400,
      questionsTraiteesTotal: 7_800_000,
      langues: ['Français'],
      dateDeploiement: '20 jan. 2026',
      tauxSatisfaction: 96.1,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.58 16.5h12.85"/></svg>`
    },
    {
      id: 'ia-03',
      nom: 'AlterniaLangues',
      matiereCiblee: 'Français & Langues',
      niveauxCibles: ['Primaire', 'Collège'],
      statut: 'Actif',
      questionsTraiteesJour: 310_100,
      questionsTraiteesTotal: 5_200_000,
      langues: ['Français', 'Bambara', 'Peulh'],
      dateDeploiement: '1er fév. 2026',
      tauxSatisfaction: 95.4,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`
    },
    {
      id: 'ia-04',
      nom: 'AlterniaHistoire',
      matiereCiblee: 'Histoire-Géographie',
      niveauxCibles: ['Collège', 'Lycée'],
      statut: 'En formation',
      questionsTraiteesJour: 184_593,
      questionsTraiteesTotal: 2_100_000,
      langues: ['Français'],
      dateDeploiement: '10 mars 2026',
      tauxSatisfaction: 92.0,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`
    }
  ];
}
