import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenuCulturelDTO } from '../../modeles/culture.modele';

@Component({
  selector: 'app-modal-suppression-culture',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="annuler.emit()" role="dialog" aria-modal="true">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-icon-danger">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </div>

        <h3 class="modal-title">Confirmer la suppression</h3>
        <p class="modal-desc">
          Êtes-vous sûr de vouloir supprimer définitivement le contenu culturel
        </p>
        <div class="modal-target-pill">
          <strong>« {{ titre }} »</strong>
        </div>
        <div class="modal-warning">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>Cette action est irréversible et retirera le contenu d'Alta Mobile.</span>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn--secondary" (click)="annuler.emit()">
            Annuler
          </button>
          <button type="button" class="btn btn--danger" (click)="confirmer.emit(item.id)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
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
      animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal-dialog {
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
      box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.4);
      animation: scaleIn 0.24s cubic-bezier(0.16, 1, 0.3, 1);

      [data-theme="dark"] & {
        background: #131B2E;
        border-color: rgba(255, 255, 255, 0.1);
      }
    }
    .modal-icon-danger {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: rgba(248, 113, 113, 0.14);
      color: var(--c-danger);
      border: 1px solid rgba(248, 113, 113, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.15rem;
    }
    .modal-title {
      font-size: 17px;
      font-weight: 700;
      color: var(--c-text);
      margin-bottom: 0.5rem;
    }
    .modal-desc {
      font-size: 13.5px;
      color: var(--c-secondary);
      line-height: 1.5;
      margin: 0;
    }
    .modal-target-pill {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      background: var(--c-surface-alt);
      border: 1px solid var(--c-border);
      border-radius: var(--r-md);
      margin: 0.5rem 0;
      font-size: 13px;
      color: var(--c-text);
      max-width: 100%;
      word-break: break-word;
    }
    .modal-warning {
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
      margin-top: 4px;
      text-align: left;
    }
    .modal-actions {
      display: flex;
      gap: 10px;
      margin-top: 1.5rem;
      width: 100%;
      justify-content: center;

      .btn {
        flex: 1;
        justify-content: center;
        padding: 9px 14px;
        font-size: 13px;
        font-weight: 600;
      }
    }

    @keyframes scaleIn {
      from { transform: scale(0.94) translateY(8px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }
  `]
})
export class ModalSuppressionCultureComponent {
  @Input({ required: true }) item!: ContenuCulturelDTO;
  @Output() annuler = new EventEmitter<void>();
  @Output() confirmer = new EventEmitter<string>();

  get titre(): string {
    if ('nom' in this.item) return this.item.nom;
    if ('titre' in this.item) return this.item.titre;
    if ('question' in this.item) return this.item.question;
    if ('titreHistoire' in this.item) return this.item.titreHistoire;
    return this.item.id;
  }
}
