import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtablissementDTO } from '../../modeles/etablissement.model';
import { BadgeComponent } from '@partage/composants/badge/badge.component';

@Component({
  selector: 'app-tableau-etablissements',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './tableau-etablissements.component.html',
  styleUrls: ['./tableau-etablissements.component.scss']
})
export class TableauEtablissementsComponent {
  @Input({ required: true }) etablissements: EtablissementDTO[] = [];
  @Input() modeAffichage: 'tableau' | 'cartes' = 'tableau';
  @Output() basculerStatut = new EventEmitter<string>();
  @Output() supprimer = new EventEmitter<string>();
  @Output() voirDetail = new EventEmitter<EtablissementDTO>();

  readonly etablissementSelectionne = signal<EtablissementDTO | null>(null);

  // Couleurs d'avatars harmonieuses
  private readonly paletteAvatars = [
    { bg: 'rgba(49, 73, 153, 0.12)', text: '#314999' },
    { bg: 'rgba(64, 187, 204, 0.15)', text: '#0E7490' },
    { bg: 'rgba(241, 133, 31, 0.12)', text: '#C2410C' },
    { bg: 'rgba(16, 185, 129, 0.15)', text: '#047857' },
    { bg: 'rgba(139, 92, 246, 0.15)', text: '#6D28D9' }
  ];

  obtenirInitiales(nom: string): string {
    if (!nom) return 'ET';
    const mots = nom.replace(/^(Lycée|Collège|École|Complexe|Groupe|Institut)\s+/i, '').trim().split(/\s+/);
    if (mots.length >= 2) {
      return (mots[0][0] + mots[1][0]).toUpperCase();
    }
    return nom.substring(0, 2).toUpperCase();
  }

  obtenirStyleAvatar(nom: string): { bg: string; text: string } {
    let hash = 0;
    for (let i = 0; i < nom.length; i++) {
      hash = nom.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % this.paletteAvatars.length;
    return this.paletteAvatars[index];
  }

  copierTexte(texte: string, event: MouseEvent): void {
    event.stopPropagation();
    navigator.clipboard?.writeText(texte);
  }
}
