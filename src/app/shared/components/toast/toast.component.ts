import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [ngClass]="'toast--' + toast.type" (click)="toastService.remove(toast.id)">
          <div class="toast__icon">
            @if (toast.type === 'success') {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            } @else if (toast.type === 'error') {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            } @else if (toast.type === 'warning') {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            } @else {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            }
          </div>
          <div class="toast__content">
            <div class="toast__title">{{ toast.title }}</div>
            @if (toast.message) {
              <div class="toast__message">{{ toast.message }}</div>
            }
          </div>
          <button class="toast__close" (click)="toastService.remove(toast.id); $event.stopPropagation()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .toast {
      background: white;
      border-radius: var(--r-md);
      box-shadow: var(--s-lg);
      padding: 12px 16px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      min-width: 300px;
      max-width: 400px;
      cursor: pointer;
      animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border-left: 4px solid var(--c-border);
    }
    .toast--success { border-left-color: var(--c-success); }
    .toast--error { border-left-color: var(--c-danger); }
    .toast--warning { border-left-color: var(--c-warning); }
    .toast--info { border-left-color: var(--c-brand); }
    
    .toast__icon {
      margin-top: 2px;
    }
    .toast--success .toast__icon { color: var(--c-success); }
    .toast--error .toast__icon { color: var(--c-danger); }
    .toast--warning .toast__icon { color: var(--c-warning); }
    .toast--info .toast__icon { color: var(--c-brand); }
    
    .toast__content { flex: 1; }
    .toast__title { font-weight: 600; font-size: 0.875rem; color: var(--c-text); }
    .toast__message { font-size: 0.75rem; color: var(--c-secondary); margin-top: 4px; line-height: 1.4; }
    
    .toast__close {
      background: none;
      border: none;
      color: var(--c-subtle);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
    }
    .toast__close:hover { background: var(--c-surface); color: var(--c-text); }
    
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
