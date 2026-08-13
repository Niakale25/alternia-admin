import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { ToastService } from '../../shared/components/toast/toast.service';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="page-content">

      <!-- EN-TÊTE -->
      <div class="page-header">
        <div class="page-header__eyebrow">Administration</div>
        <h1 class="page-header__title">Paramètres</h1>
        <p class="page-header__subtitle">Configuration générale de la plateforme Alternia</p>
      </div>

      <div class="params-layout">

        <!-- Navigation paramètres -->
        <nav class="params-nav">
          @for (section of sections; track section.id) {
            <button
              class="params-nav__item"
              [class.params-nav__item--active]="sectionActive === section.id"
              (click)="sectionActive = section.id"
            >
              <span [innerHTML]="section.icon | safeHtml"></span>
              {{ section.label }}
            </button>
          }
        </nav>

        <!-- Contenu paramètres -->
        <div class="params-content">

          @if (sectionActive === 'plateforme') {
            <div class="params-section">
              <h2 class="params-section__title">Informations de la plateforme</h2>
              <div class="params-fields">
                <div class="params-field">
                  <label class="params-field__label">Nom de la plateforme</label>
                  <input type="text" class="input" value="Alternia EdTech" />
                </div>
                <div class="params-field">
                  <label class="params-field__label">Pays principal</label>
                  <input type="text" class="input" value="Mali" />
                </div>
                <div class="params-field">
                  <label class="params-field__label">Email administrateur</label>
                  <input type="email" class="input" value="admin@alternia.io" />
                </div>
                <div class="params-field">
                  <label class="params-field__label">Fuseau horaire</label>
                  <input type="text" class="input" value="Africa/Bamako (GMT+0)" />
                </div>
              </div>
              <div class="params-actions">
                <button class="btn btn--primary" (click)="saveSettings()">Enregistrer les modifications</button>
                <button class="btn btn--ghost">Annuler</button>
              </div>
            </div>
          }

          @if (sectionActive === 'offres') {
            <div class="params-section">
              <h2 class="params-section__title">Offres et tarification</h2>
              <div class="offres-grid">
                @for (offre of offres; track offre.nom) {
                  <div class="offre-card">
                    <div class="offre-card__header">
                      <h3 class="offre-card__nom">{{ offre.nom }}</h3>
                      <span class="badge" [class.badge--success]="offre.active" [class.badge--neutral]="!offre.active">
                        {{ offre.active ? 'Actif' : 'Inactif' }}
                      </span>
                    </div>
                    <div class="offre-card__prix">{{ offre.prix }}</div>
                    <div class="offre-card__desc">{{ offre.description }}</div>
                    <button class="btn btn--secondary btn--sm mt-3" (click)="editOffre(offre)">Modifier</button>
                  </div>
                }
              </div>
            </div>
          }

          @if (sectionActive === 'notifications') {
            <div class="params-section">
              <h2 class="params-section__title">Notifications et alertes</h2>
              <div class="params-fields">
                @for (notif of notifications; track notif.label) {
                  <div class="notif-row">
                    <div class="notif-row__body">
                      <div class="notif-row__label">{{ notif.label }}</div>
                      <div class="notif-row__desc">{{ notif.description }}</div>
                    </div>
                    <div class="toggle" [class.toggle--on]="notif.active" (click)="toggleNotif(notif)">
                      <div class="toggle__thumb"></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

        </div>
      </div>

    </div>
  `,
  styles: [`
    .params-layout {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 1.5rem;
      align-items: start;

      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }

    .params-nav {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      position: sticky;
      top: calc(var(--topbar-height) + 1rem);
    }

    .params-nav__item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: var(--r-md);
      border: none;
      background: transparent;
      font-size: 13px;
      font-weight: 500;
      font-family: var(--font-sans);
      color: var(--c-secondary);
      cursor: pointer;
      text-align: left;
      transition: all var(--t-fast);

      ::ng-deep svg { width: 15px; height: 15px; }

      &:hover { background: var(--c-surface); color: var(--c-text); }
      &--active { background: var(--c-brand-bg); color: var(--c-brand); font-weight: 600; }
    }

    .params-content {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 1.5rem;
    }

    .params-section__title {
      font-size: 15px;
      font-weight: 700;
      color: var(--c-text);
      letter-spacing: -0.02em;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--c-border-light);
    }

    .params-fields { display: flex; flex-direction: column; gap: 1rem; }

    .params-field { display: flex; flex-direction: column; gap: 5px; }

    .params-field__label {
      font-size: 12px;
      font-weight: 600;
      color: var(--c-secondary);
    }

    .params-actions {
      display: flex;
      gap: 8px;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--c-border-light);
    }

    /* Offres */
    .offres-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1rem;
    }

    .offre-card {
      border: 1px solid var(--c-border);
      border-radius: var(--r-lg);
      padding: 1rem;
      display: flex;
      flex-direction: column;
    }

    .offre-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .offre-card__nom { font-size: 14px; font-weight: 700; color: var(--c-text); }

    .offre-card__prix {
      font-family: var(--font-tight);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--c-brand);
      letter-spacing: -0.03em;
      margin-bottom: 4px;
    }

    .offre-card__desc { font-size: 12px; color: var(--c-subtle); }

    /* Toggle */
    .notif-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 12px 0;
      border-bottom: 1px solid var(--c-border-light);

      &:last-child { border-bottom: none; }
    }

    .notif-row__label { font-size: 13px; font-weight: 600; color: var(--c-text); }
    .notif-row__desc  { font-size: 12px; color: var(--c-subtle); margin-top: 2px; }

    .toggle {
      width: 36px;
      height: 20px;
      border-radius: var(--r-full);
      background: var(--c-muted);
      position: relative;
      cursor: pointer;
      transition: background var(--t-fast);
      flex-shrink: 0;

      &--on { background: var(--c-brand); }
    }

    .toggle__thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: white;
      box-shadow: var(--s-sm);
      transition: transform var(--t-fast);

      .toggle--on & { transform: translateX(16px); }
    }
  `]
})
export class ParametresComponent {
  toastService = inject(ToastService);
  sectionActive = 'plateforme';

  saveSettings() {
    this.toastService.show('Paramètres enregistrés avec succès.', 'success');
  }

  editOffre(offre: { nom: string }) {
    this.toastService.show(`Édition de l'offre "${offre.nom}" ouverte.`, 'info');
  }

  toggleNotif(notif: { label: string; active: boolean }) {
    notif.active = !notif.active;
    const etat = notif.active ? 'activée' : 'désactivée';
    this.toastService.show(`Notification "${notif.label}" ${etat}.`, 'info');
  }

  readonly sections = [
    { id: 'plateforme', label: 'Plateforme', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>` },
    { id: 'offres', label: 'Offres & Tarifs', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="1" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` },
    { id: 'notifications', label: 'Notifications', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>` },
  ];

  readonly offres = [
    { nom: 'Découverte', prix: 'Gratuit', description: 'Accès limité à 30 questions/jour pour tester la plateforme.', active: true },
    { nom: 'Standard Mensuel', prix: '10 000 FCFA/mois', description: 'Accès illimité aux moteurs IA pédagogiques.', active: true },
    { nom: 'Premium Annuel', prix: '100 000 FCFA/an', description: 'Accès complet avec profils multiples et rapports de suivi.', active: true },
    { nom: 'Institutionnel Pack', prix: 'Sur devis', description: 'Déploiement en établissement scolaire avec boîtier dédié.', active: true },
  ];

  readonly notifications = [
    { label: 'Alertes de renouvellement', description: 'Notifier 30 jours avant l\'expiration d\'une licence ou d\'un abonnement.', active: true },
    { label: 'Nouveaux établissements', description: 'Recevoir une notification lorsqu\'un établissement demande à rejoindre la plateforme.', active: true },
    { label: 'Boîtiers hors ligne', description: 'Alerter lorsqu\'un boîtier ne répond plus depuis plus de 48 heures.', active: false },
    { label: 'Rapports hebdomadaires', description: 'Recevoir un rapport de synthèse chaque lundi matin.', active: true },
    { label: 'Mises à jour disponibles', description: 'Notifier lorsqu\'une nouvelle version de l\'application boîtier est disponible.', active: true },
  ];
}
