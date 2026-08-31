import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentDTO } from '../../modeles/parent.model';
import { BadgeComponent } from '@partage/composants/badge/badge.component';

@Component({
  selector: 'app-tableau-parents',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './tableau-parents.component.html',
  styleUrls: ['./tableau-parents.component.scss']
})
export class TableauParentsComponent {
  @Input({ required: true }) parents: ParentDTO[] = [];
  @Input() modeAffichage: 'tableau' | 'cartes' = 'tableau';
  @Output() basculerStatut = new EventEmitter<string>();
  @Output() supprimer = new EventEmitter<string>();

  // Palette d'avatars pour les familles
  private readonly paletteAvatars = [
    { bg: 'rgba(64, 187, 204, 0.15)', text: '#0E7490' },
    { bg: 'rgba(49, 73, 153, 0.12)', text: '#314999' },
    { bg: 'rgba(241, 133, 31, 0.12)', text: '#C2410C' },
    { bg: 'rgba(16, 185, 129, 0.15)', text: '#047857' },
    { bg: 'rgba(139, 92, 246, 0.15)', text: '#6D28D9' }
  ];

  obtenirInitiales(nomFamille: string): string {
    if (!nomFamille) return 'FA';
    const propre = nomFamille.replace(/^Famille\s+/i, '').trim();
    return propre.substring(0, 2).toUpperCase();
  }

  obtenirStyleAvatar(nom: string): { bg: string; text: string } {
    let hash = 0;
    for (let i = 0; i < nom.length; i++) {
      hash = nom.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % this.paletteAvatars.length;
    return this.paletteAvatars[index];
  }

  nettoyerNumeroWhatsApp(telephone: string): string {
    return telephone.replace(/[^\d+]/g, '');
  }
}
