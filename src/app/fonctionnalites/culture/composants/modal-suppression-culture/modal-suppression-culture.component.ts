import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenuCulturelDTO } from '../../modeles/culture.modele';

@Component({
  selector: 'app-modal-suppression-culture',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="annuler.emit()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-icon-danger">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </div>

        <h3 class="modal-title">Confirmer la suppression</h3>
        <p class="modal-desc">
          Êtes-vous sûr de vouloir supprimer définitivement le contenu culturel
          <strong>« {{ titre }} »</strong> ?
        </p>
        <p class="modal-sub">Cette action est irréversible et supprimera le contenu d'Alta Mobile.</p>

        <div class="modal-actions">
          <button type="button" class="btn btn--secondary" (click)="annuler.emit()">
            Annuler
          </button>
          <button type="button" class="btn btn--danger" (click)="confirmer.emit(item.id)">
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
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .modal-dialog {
      background: var(--c-white);
      border: 1px solid var(--c-border);
      border-radius: var(--r-xl);
      padding: 2rem;
      max-width: 440px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: var(--s-xl);
    }
    .modal-icon-danger {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--c-danger-bg);
      color: var(--c-danger);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }
    .modal-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--c-text);
      margin-bottom: 8px;
    }
    .modal-desc {
      font-size: 13.5px;
      color: var(--c-text);
      line-height: 1.5;
    }
    .modal-sub {
      font-size: 12px;
      color: var(--c-secondary);
      margin-top: 6px;
    }
    .modal-actions {
      display: flex;
      gap: 10px;
      margin-top: 1.5rem;
      width: 100%;
      justify-content: center;
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
