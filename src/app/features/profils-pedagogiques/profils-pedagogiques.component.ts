import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ProfilPedagogique {
  id: string;
  nom: string;
  prenom: string;
  matiere: string;
  niveaux: string[];
  photoUrl: string;
  audioUrl: string;
  statut: 'Actif' | 'Inactif';
  dateCreation: string;
}

@Component({
  selector: 'app-profils-pedagogiques',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-content">

      <!-- EN-TÊTE -->
      <div class="page-header flex justify-between items-start">
        <div>
          <div class="page-header__eyebrow">Contenu Pédagogique</div>
          <h1 class="page-header__title">Profils Pédagogiques</h1>
          <p class="page-header__subtitle">
            {{ filtres().length }} profils pédagogiques — tuteurs IA interactifs d'Alternia
          </p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn--secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Exporter
          </button>
          <button class="btn btn--primary" (click)="ouvrirModalAjout()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ajouter un profil
          </button>
        </div>
      </div>

      <!-- FILTRES & RECHERCHE -->
      <div class="card mb-4">
        <div class="flex flex-wrap justify-between items-center gap-3">
          <div class="search-box flex-1" style="max-width: 360px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Rechercher par nom, matière..."
              [ngModel]="recherche()"
              (ngModelChange)="recherche.set($event)"
            />
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs text-subtle font-medium">Matière :</span>
            @for (mat of matieresFiltres; track mat) {
              <button
                class="btn btn--sm"
                [class.btn--primary]="filtreMatiere() === mat"
                [class.btn--ghost]="filtreMatiere() !== mat"
                (click)="filtreMatiere.set(mat)"
              >
                {{ mat }}
              </button>
            }
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-subtle font-medium">Statut :</span>
            @for (s of statutsFiltres; track s) {
              <button
                class="btn btn--sm"
                [class.btn--primary]="filtreStatut() === s"
                [class.btn--ghost]="filtreStatut() !== s"
                (click)="filtreStatut.set(s)"
              >
                {{ s }}
              </button>
            }
          </div>
        </div>
      </div>

      <!-- GRILLE DES PROFILS -->
      <div class="profils-grid">
        @for (profil of filtres(); track profil.id) {
          <div class="profil-card">

            <!-- Photo -->
            <div class="profil-card__photo-wrap">
              <img
                [src]="profil.photoUrl"
                [alt]="profil.prenom + ' ' + profil.nom"
                class="profil-card__photo"
                loading="lazy"
              />
              <span
                class="profil-card__statut-badge"
                [class.profil-card__statut-badge--actif]="profil.statut === 'Actif'"
                [class.profil-card__statut-badge--inactif]="profil.statut === 'Inactif'"
              >
                {{ profil.statut }}
              </span>
            </div>

            <!-- Infos -->
            <div class="profil-card__body">
              <div class="profil-card__matiere">{{ profil.matiere }}</div>
              <h3 class="profil-card__nom">{{ profil.prenom }} {{ profil.nom }}</h3>

              <div class="profil-card__niveaux">
                @for (n of profil.niveaux; track n) {
                  <span class="tag">{{ n }}</span>
                }
              </div>

              <!-- Lecteur audio -->
              <div class="profil-card__audio">
                <button
                  class="profil-card__play-btn"
                  (click)="toggleAudio(profil.id)"
                  [class.profil-card__play-btn--playing]="profilEnLecture() === profil.id"
                  [attr.aria-label]="profilEnLecture() === profil.id ? 'Pause' : 'Écouter ' + profil.prenom"
                >
                  @if (profilEnLecture() === profil.id) {
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  } @else {
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  }
                </button>
                <div class="profil-card__audio-info">
                  <div class="profil-card__audio-label">
                    {{ profilEnLecture() === profil.id ? 'En cours...' : 'Écouter la présentation' }}
                  </div>
                  <div class="profil-card__audio-bars" [class.profil-card__audio-bars--playing]="profilEnLecture() === profil.id">
                    @for (b of [1,2,3,4,5]; track b) {
                      <div class="audio-bar" [style.animation-delay]="(b * 0.1) + 's'"></div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="profil-card__actions">
              <button class="btn btn--ghost btn--sm btn--icon" data-tooltip="Modifier" aria-label="Modifier le profil">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              </button>
              <button class="btn btn--ghost btn--sm btn--icon" data-tooltip="Supprimer" aria-label="Supprimer le profil">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        }

        @empty {
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <div class="empty-state__title">Aucun profil trouvé</div>
            <div class="empty-state__desc">Modifiez vos filtres ou ajoutez un nouveau profil pédagogique.</div>
          </div>
        }
      </div>

    </div>
  `,
  styles: [`
    .profils-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
    }

    /* ── CARTE PROFIL ─────────────────────────────────────────── */
    .profil-card {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-xl);
      overflow: hidden;
      box-shadow: var(--s-xs);
      transition: box-shadow var(--t-base), transform var(--t-base);
      display: flex;
      flex-direction: column;

      &:hover {
        box-shadow: var(--s-md);
        transform: translateY(-2px);
      }
    }

    .profil-card__photo-wrap {
      position: relative;
      width: 100%;
      padding-top: 75%;
      overflow: hidden;
      background: var(--c-surface);
    }

    .profil-card__photo {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--t-slow);

      .profil-card:hover & { transform: scale(1.04); }
    }

    .profil-card__statut-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: var(--r-full);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      backdrop-filter: blur(8px);

      &--actif {
        background: rgba(34, 197, 94, 0.85);
        color: white;
      }

      &--inactif {
        background: rgba(100, 116, 139, 0.85);
        color: white;
      }
    }

    .profil-card__body {
      padding: 1rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .profil-card__matiere {
      font-size: 11px;
      font-weight: 700;
      color: var(--c-brand);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .profil-card__nom {
      font-size: 15px;
      font-weight: 700;
      color: var(--c-text);
      letter-spacing: -0.02em;
    }

    .profil-card__niveaux {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    /* ── LECTEUR AUDIO ────────────────────────────────────────── */
    .profil-card__audio {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      background: var(--c-surface);
      border: 1px solid var(--c-border-light);
      border-radius: var(--r-md);
      margin-top: 4px;
    }

    .profil-card__play-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background: var(--c-brand);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: all var(--t-fast);

      &:hover { background: var(--c-brand-hover); transform: scale(1.05); }

      &--playing {
        background: var(--c-cyan);
        animation: pulse-dot 1.5s infinite;
      }
    }

    .profil-card__audio-info { flex: 1; min-width: 0; }

    .profil-card__audio-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--c-secondary);
    }

    /* Barres d'animation audio */
    .profil-card__audio-bars {
      display: flex;
      align-items: center;
      gap: 2px;
      height: 12px;
      margin-top: 3px;
    }

    .audio-bar {
      width: 3px;
      height: 4px;
      background: var(--c-muted);
      border-radius: 2px;
      transition: height var(--t-fast);

      .profil-card__audio-bars--playing & {
        animation: audio-wave 0.8s ease-in-out infinite alternate;
        background: var(--c-cyan);
      }
    }

    @keyframes audio-wave {
      0%   { height: 3px; }
      100% { height: 12px; }
    }

    /* Actions */
    .profil-card__actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      padding: 8px 12px;
      border-top: 1px solid var(--c-border-light);
      background: var(--c-surface);
    }
  `]
})
export class ProfilsPedagogiquesComponent {

  recherche = signal('');
  filtreMatiere = signal('Toutes');
  filtreStatut = signal('Tous');
  profilEnLecture = signal<string | null>(null);

  readonly matieresFiltres = ['Toutes', 'Mathématiques', 'Sciences', 'Français', 'Histoire-Géo', 'Langues'];
  readonly statutsFiltres = ['Tous', 'Actif', 'Inactif'];

  readonly profils: ProfilPedagogique[] = [
    {
      id: 'pp-01',
      nom: 'Kouyaté',
      prenom: 'Aminata',
      matiere: 'Mathématiques',
      niveaux: ['Primaire', 'Collège'],
      photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=300&fit=crop&auto=format',
      audioUrl: '',
      statut: 'Actif',
      dateCreation: '2026-01-15'
    },
    {
      id: 'pp-02',
      nom: 'Diallo',
      prenom: 'Moussa',
      matiere: 'Sciences & SVT',
      niveaux: ['Collège', 'Lycée'],
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format',
      audioUrl: '',
      statut: 'Actif',
      dateCreation: '2026-01-20'
    },
    {
      id: 'pp-03',
      nom: 'Traoré',
      prenom: 'Fatoumata',
      matiere: 'Français & Lecture',
      niveaux: ['Primaire'],
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop&auto=format',
      audioUrl: '',
      statut: 'Actif',
      dateCreation: '2026-02-05'
    },
    {
      id: 'pp-04',
      nom: 'Coulibaly',
      prenom: 'Ibrahim',
      matiere: 'Histoire-Géographie',
      niveaux: ['Collège', 'Lycée'],
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&auto=format',
      audioUrl: '',
      statut: 'Actif',
      dateCreation: '2026-02-10'
    },
    {
      id: 'pp-05',
      nom: 'Sanogo',
      prenom: 'Mariam',
      matiere: 'Langues Régionales',
      niveaux: ['Primaire', 'Collège'],
      photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=300&fit=crop&auto=format',
      audioUrl: '',
      statut: 'Actif',
      dateCreation: '2026-03-01'
    },
    {
      id: 'pp-06',
      nom: 'Camara',
      prenom: 'Sékou',
      matiere: 'Mathématiques',
      niveaux: ['Lycée'],
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop&auto=format',
      audioUrl: '',
      statut: 'Inactif',
      dateCreation: '2026-03-15'
    },
    {
      id: 'pp-07',
      nom: 'Keïta',
      prenom: 'Djénéba',
      matiere: 'Sciences & SVT',
      niveaux: ['Primaire'],
      photoUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=300&fit=crop&auto=format',
      audioUrl: '',
      statut: 'Actif',
      dateCreation: '2026-04-02'
    },
    {
      id: 'pp-08',
      nom: 'Sidibé',
      prenom: 'Oumar',
      matiere: 'Histoire-Géographie',
      niveaux: ['Primaire', 'Collège'],
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&auto=format',
      audioUrl: '',
      statut: 'Actif',
      dateCreation: '2026-04-20'
    }
  ];

  readonly filtres = computed(() => {
    let result = this.profils;

    if (this.filtreMatiere() !== 'Toutes') {
      result = result.filter(p => p.matiere.toLowerCase().includes(this.filtreMatiere().toLowerCase().replace('s ', ' ')));
    }

    if (this.filtreStatut() !== 'Tous') {
      result = result.filter(p => p.statut === this.filtreStatut());
    }

    if (this.recherche()) {
      const q = this.recherche().toLowerCase();
      result = result.filter(p =>
        p.nom.toLowerCase().includes(q) ||
        p.prenom.toLowerCase().includes(q) ||
        p.matiere.toLowerCase().includes(q)
      );
    }

    return result;
  });

  toggleAudio(id: string) {
    this.profilEnLecture.set(this.profilEnLecture() === id ? null : id);
  }

  ouvrirModalAjout() {
    // TODO : ouvrir un drawer modal d'ajout
    alert('Modal d\'ajout de profil pédagogique — à implémenter avec le DrawerComponent');
  }
}
