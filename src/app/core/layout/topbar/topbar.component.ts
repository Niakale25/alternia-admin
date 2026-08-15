import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="topbar">
      <!-- Gauche -->
      <div class="topbar__left">
        <!-- Barre de recherche -->
        <div class="topbar__search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher dans Alternia..."
            [value]="searchQuery()"
            (input)="onSearch($event)"
            aria-label="Rechercher dans Alternia"
          />
          <span class="topbar__search-kbd">⌘K</span>
        </div>
      </div>

      <!-- Droite -->
      <div class="topbar__right">

        <!-- Indicateur plateforme EdTech (pas IT) -->
        <div class="topbar__platform-badge">
          <span class="status-dot status-dot--online"></span>
          <span class="topbar__platform-text">Plateforme active</span>
        </div>

        <!-- Mode Sombre / Clair -->
        <button
          class="topbar__icon-btn"
          (click)="themeService.toggleTheme()"
          [attr.data-tooltip]="themeService.isDarkMode() ? 'Mode Clair' : 'Mode Sombre'"
          [attr.aria-label]="themeService.isDarkMode() ? 'Passer au mode clair' : 'Passer au mode sombre'"
        >
          @if (themeService.isDarkMode()) {
            <!-- Sun Icon for Light mode switch -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
            </svg>
          } @else {
            <!-- Moon Icon for Dark mode switch -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          }
        </button>

        <!-- Notifications -->
        <button class="topbar__icon-btn" data-tooltip="3 alertes en attente" aria-label="Notifications">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span class="topbar__notif-badge">3</span>
        </button>

        <!-- Paramètres -->
        <button class="topbar__icon-btn" routerLink="/parametres" data-tooltip="Paramètres" aria-label="Paramètres">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>

        <!-- Utilisateur -->
        <div class="topbar__user" role="button" tabindex="0" aria-label="Menu utilisateur" routerLink="/parametres">
          <div class="topbar__user-avatar">SA</div>
          <div class="topbar__user-info">
            <div class="topbar__user-name">Super Admin</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--topbar-height);
      padding: 0 1.25rem;
      background: var(--c-white);
      border-bottom: 1px solid var(--c-border);
      flex-shrink: 0;
      gap: 1rem;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .topbar__left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
    }

    .topbar__menu-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: var(--c-secondary);
      cursor: pointer;
      border-radius: var(--r-md);
      transition: all var(--t-fast);
      flex-shrink: 0;

      &:hover {
        background: var(--c-surface);
        color: var(--c-text);
      }
    }

    .topbar__search {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: var(--c-surface);
      border: 1px solid var(--c-border);
      border-radius: var(--r-md);
      max-width: 380px;
      width: 100%;
      transition: all var(--t-fast);
      color: var(--c-subtle);

      @media (max-width: 768px) {
        display: none;
      }

      &:focus-within {
        background: var(--c-white);
        border-color: var(--c-brand);
        box-shadow: 0 0 0 3px var(--c-brand-bg);
        color: var(--c-secondary);
      }

      input {
        border: none;
        background: transparent;
        outline: none;
        font-size: 13px;
        font-family: var(--font-sans);
        color: var(--c-text);
        flex: 1;
        min-width: 0;

        &::placeholder { color: var(--c-subtle); }
      }
    }

    .topbar__search-kbd {
      font-size: 10px;
      font-weight: 600;
      color: var(--c-subtle);
      background: var(--c-border-light);
      border: 1px solid var(--c-border);
      border-radius: var(--r-xs);
      padding: 1px 5px;
      flex-shrink: 0;
      font-family: var(--font-mono);
    }

    .topbar__right {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .topbar__platform-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: var(--r-full);
      background: var(--c-success-bg);
      border: 1px solid var(--c-success-border);

      @media (max-width: 576px) {
        padding: 4px;
      }
    }

    .topbar__platform-text {
      font-size: 11px;
      font-weight: 600;
      color: var(--c-success);
      white-space: nowrap;

      @media (max-width: 576px) {
        display: none;
      }
    }

    .topbar__divider {
      width: 1px;
      height: 20px;
      background: var(--c-border);
      margin: 0 4px;
    }

    .topbar__icon-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: var(--c-secondary);
      cursor: pointer;
      border-radius: var(--r-md);
      transition: all var(--t-fast);

      &:hover {
        background: var(--c-surface);
        color: var(--c-text);
      }
    }

    .topbar__notif-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 14px;
      height: 14px;
      background: var(--c-accent);
      color: white;
      font-size: 9px;
      font-weight: 700;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid var(--c-white);
    }

    .topbar__user {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 5px 8px;
      border-radius: var(--r-md);
      cursor: pointer;
      transition: background var(--t-fast);
      color: var(--c-secondary);
      border: 1px solid transparent;

      &:hover {
        background: var(--c-surface);
        border-color: var(--c-border);
        color: var(--c-text);
      }
    }

    .topbar__user-avatar {
      width: 28px;
      height: 28px;
      border-radius: var(--r-sm);
      background: linear-gradient(135deg, var(--c-brand) 0%, var(--c-cyan) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.05em;
      flex-shrink: 0;
    }

    .topbar__user-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--c-text);
      white-space: nowrap;

      @media (max-width: 576px) {
        display: none;
      }
    }
  `]
})
export class TopbarComponent {
  themeService = inject(ThemeService);
  @Input() sidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  searchQuery = signal('');

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }
}

