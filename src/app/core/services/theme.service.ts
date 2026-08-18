import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly CLE_STOCKAGE = 'alternia_theme';

  readonly estModeSombre = signal<boolean>(false);
  readonly isDarkMode = computed(() => this.estModeSombre());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const themeSauvegarde = localStorage.getItem(this.CLE_STOCKAGE);
        if (themeSauvegarde) {
          this.estModeSombre.set(themeSauvegarde === 'sombre');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          this.estModeSombre.set(true);
        }
      } catch (e) {
        console.warn('Impossible de lire le thème local:', e);
      }
    }

    // Synchronisation réactive avec le DOM et localStorage
    effect(() => {
      const modeSombre = this.estModeSombre();
      if (isPlatformBrowser(this.platformId)) {
        try {
          if (modeSombre) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem(this.CLE_STOCKAGE, 'sombre');
          } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem(this.CLE_STOCKAGE, 'clair');
          }
        } catch (e) {
          console.warn('Impossible d\'enregistrer le thème:', e);
        }
      }
    });
  }

  basculerTheme(): void {
    this.estModeSombre.update(v => !v);
  }

  toggleTheme(): void {
    this.basculerTheme();
  }

  definirModeSombre(estSombre: boolean): void {
    this.estModeSombre.set(estSombre);
  }
}
