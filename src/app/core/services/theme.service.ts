import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('alternia-theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      this.setTheme(isDark);
    }
  }

  toggleTheme() {
    this.setTheme(!this.isDarkMode());
  }

  setTheme(isDark: boolean) {
    this.isDarkMode.set(isDark);
    if (typeof window !== 'undefined') {
      localStorage.setItem('alternia-theme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }
}
