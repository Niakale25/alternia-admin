import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  template: `
    <div class="notfound">
      <div class="notfound__card">

        <!-- Icône animée -->
        <div class="notfound__icon-wrap">
          <svg class="notfound__icon" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="var(--c-brand)" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.4"/>
            <circle cx="40" cy="40" r="28" fill="rgba(49,73,153,0.06)" stroke="var(--c-brand-border)" stroke-width="1"/>
            <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Inter Tight" font-size="22" font-weight="700" fill="#314999">404</text>
          </svg>
        </div>

        <div class="notfound__logo">
          <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
            <rect width="30" height="30" rx="9" fill="#314999"/>
            <path d="M15 6L23.5 23H6.5L15 6Z" fill="white" opacity="0.95"/>
            <path d="M15 11L20.5 23H9.5L15 11Z" fill="#40BBCC" opacity="0.8"/>
          </svg>
          <span class="notfound__logo-text">Alternia</span>
        </div>

        <h1 class="notfound__title">Page introuvable</h1>
        <p class="notfound__desc">
          La page que vous cherchez n'existe pas ou a été déplacée.<br>
          Revenez au tableau de bord pour continuer.
        </p>

        <button class="btn btn--primary" (click)="goHome()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Retour au Tableau de Bord
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notfound {
      min-height: 100vh;
      background: var(--c-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .notfound__card {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-xl);
      box-shadow: var(--s-lg);
      padding: 3rem 2.5rem;
      max-width: 420px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      animation: scaleIn 0.3s ease;
    }

    .notfound__icon-wrap {
      width: 80px;
      height: 80px;
      animation: spin 20s linear infinite;
    }

    .notfound__icon {
      width: 80px;
      height: 80px;
    }

    .notfound__logo {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 0.5rem;
    }

    .notfound__logo-text {
      font-family: var(--font-tight);
      font-size: 16px;
      font-weight: 700;
      color: var(--c-text);
      letter-spacing: -0.03em;
    }

    .notfound__title {
      font-family: var(--font-tight);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--c-text);
      letter-spacing: -0.03em;
      margin: 0;
    }

    .notfound__desc {
      font-size: 13px;
      color: var(--c-secondary);
      line-height: 1.65;
    }
  `]
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/tableau-bord']);
  }
}
