import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (ouvert) {
      <div
        class="confirmation-backdrop"
        (click)="onClicArrierePlan($event)"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="'modal-title-' + titre"
      >
        <div class="confirmation-dialog" [class]="'confirmation-dialog--' + variante" (click)="$event.stopPropagation()">
          
          <!-- Icône d'alerte avec effet halo -->
          <div class="confirmation-icon-wrap" [class]="'confirmation-icon-wrap--' + variante">
            <div class="icon-pulse"></div>
            @if (variante === 'danger') {
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            } @else if (variante === 'avertissement') {
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            } @else {
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            }
          </div>

          <!-- Titre & Message -->
          <h3 class="confirmation-title" [id]="'modal-title-' + titre">{{ titre }}</h3>
          
          <div class="confirmation-body">
            <p class="confirmation-message">{{ message }}</p>
            
            @if (nomElement) {
              <div class="confirmation-target-pill">
                <span class="target-name">{{ nomElement }}</span>
              </div>
            }

            @if (avertissement) {
              <div class="confirmation-warning">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{{ avertissement }}</span>
              </div>
            }
          </div>

          <!-- Boutons d'Action -->
          <div class="confirmation-actions">
            <button
              type="button"
              class="btn btn--secondary btn--cancel"
              (click)="annuler.emit()"
              [disabled]="enCours"
            >
              {{ texteAnnuler }}
            </button>
            <button
              type="button"
              class="btn btn--confirm"
              [class.btn--danger]="variante === 'danger'"
              [class.btn--accent]="variante === 'avertissement'"
              [class.btn--primary]="variante === 'info'"
              (click)="confirmer.emit()"
              [disabled]="enCours"
            >
              @if (enCours) {
                <span class="btn-spinner"></span>
                Traitement...
              } @else {
                @if (variante === 'danger') {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                }
                {{ texteConfirmer }}
              }
            </button>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .confirmation-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10, 15, 29, 0.72);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
      animation: fadeInBackdrop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .confirmation-dialog {
      position: relative;
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-xl);
      padding: 2rem 1.75rem 1.75rem;
      max-width: 440px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
      animation: scaleInDialog 0.24s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;

      [data-theme="dark"] & {
        background: #131B2E;
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08);
      }
    }

    .confirmation-icon-wrap {
      position: relative;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.15rem;

      &--danger {
        background: rgba(248, 113, 113, 0.14);
        color: var(--c-danger);
        border: 1px solid rgba(248, 113, 113, 0.25);
        .icon-pulse {
          background: rgba(248, 113, 113, 0.35);
        }
      }

      &--avertissement {
        background: rgba(251, 146, 60, 0.14);
        color: var(--c-accent);
        border: 1px solid rgba(251, 146, 60, 0.25);
        .icon-pulse {
          background: rgba(251, 146, 60, 0.35);
        }
      }

      &--info {
        background: rgba(78, 111, 224, 0.14);
        color: var(--c-brand);
        border: 1px solid rgba(78, 111, 224, 0.25);
        .icon-pulse {
          background: rgba(78, 111, 224, 0.35);
        }
      }
    }

    .icon-pulse {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      opacity: 0.5;
      animation: iconPulseAnim 2.2s infinite ease-out;
      pointer-events: none;
    }

    .confirmation-title {
      font-size: 17px;
      font-weight: 700;
      color: var(--c-text);
      margin: 0 0 0.5rem;
      letter-spacing: -0.01em;
    }

    .confirmation-body {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.65rem;
      margin-bottom: 1.5rem;
    }

    .confirmation-message {
      font-size: 13.5px;
      color: var(--c-secondary);
      line-height: 1.5;
      margin: 0;
    }

    .confirmation-target-pill {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      background: var(--c-surface-alt);
      border: 1px solid var(--c-border);
      border-radius: var(--r-md);
      max-width: 100%;

      .target-name {
        font-size: 13px;
        font-weight: 700;
        color: var(--c-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .confirmation-warning {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      font-weight: 500;
      color: var(--c-danger);
      background: rgba(248, 113, 113, 0.08);
      border: 1px solid rgba(248, 113, 113, 0.18);
      padding: 5px 10px;
      border-radius: var(--r-sm);
      margin-top: 2px;
      line-height: 1.35;
      text-align: left;
    }

    .confirmation-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      width: 100%;

      .btn {
        flex: 1;
        justify-content: center;
        padding: 9px 14px;
        font-size: 13px;
        font-weight: 600;
        border-radius: var(--r-md);
      }
    }

    .btn-spinner {
      display: inline-block;
      width: 13px;
      height: 13px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes fadeInBackdrop {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleInDialog {
      from {
        opacity: 0;
        transform: scale(0.94) translateY(8px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes iconPulseAnim {
      0% {
        transform: scale(0.95);
        opacity: 0.6;
      }
      50% {
        transform: scale(1.15);
        opacity: 0;
      }
      100% {
        transform: scale(0.95);
        opacity: 0;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ModalConfirmationComponent {
  @Input() ouvert: boolean = false;
  @Input() titre: string = 'Confirmer la suppression';
  @Input() message: string = 'Êtes-vous sûr de vouloir supprimer définitivement cet élément ?';
  @Input() nomElement: string = '';
  @Input() avertissement: string = 'Cette action est irréversible.';
  @Input() texteConfirmer: string = 'Supprimer définitivement';
  @Input() texteAnnuler: string = 'Annuler';
  @Input() variante: 'danger' | 'avertissement' | 'info' = 'danger';
  @Input() enCours: boolean = false;

  @Output() confirmer = new EventEmitter<void>();
  @Output() annuler = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onToucheEchap(): void {
    if (this.ouvert && !this.enCours) {
      this.annuler.emit();
    }
  }

  onClicArrierePlan(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('confirmation-backdrop') && !this.enCours) {
      this.annuler.emit();
    }
  }
}
