import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '@partage/composants/badge/badge.component';
import { AvatarPedagogiqueDTO } from '@donnees/repositories/pedagogie-ia.repository';

@Component({
  selector: 'app-studio-avatars',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent],
  templateUrl: './studio-avatars.component.html',
  styleUrls: ['./studio-avatars.component.scss']
})
export class StudioAvatarsComponent {
  @Input({ required: true }) avatars: AvatarPedagogiqueDTO[] = [];
  @Input() voixEnLecture: string | null = null;
  @Input() recherche: string = '';
  @Input() filtreMatiere: string = 'Toutes';

  @Output() lireVoix = new EventEmitter<AvatarPedagogiqueDTO>();
  @Output() editer = new EventEmitter<AvatarPedagogiqueDTO>();
  @Output() basculerActif = new EventEmitter<AvatarPedagogiqueDTO>();
  @Output() definirParDefaut = new EventEmitter<AvatarPedagogiqueDTO>();
  @Output() supprimer = new EventEmitter<AvatarPedagogiqueDTO>();
  @Output() changerRecherche = new EventEmitter<string>();
  @Output() changerFiltreMatiere = new EventEmitter<string>();
  @Output() ouvrirStreamLive = new EventEmitter<AvatarPedagogiqueDTO>();

  filtreMoteur: 'tous' | 'simli' | 'statique' = 'tous';
  idCopie: string | null = null;
  imagesErreur = new Set<string>();

  getInitiales(nom: string): string {
    if (!nom) return 'IA';
    const parties = nom.replace(/^(Dr\.|Prof\.|Professeure|Mme|M\.)\s*/i, '').trim().split(/\s+/);
    if (parties.length >= 2) {
      return (parties[0][0] + parties[1][0]).toUpperCase();
    }
    return nom.substring(0, 2).toUpperCase();
  }

  onImageErreur(id: string): void {
    this.imagesErreur.add(id);
  }

  matieresOptions = [
    'Toutes',
    'Français & Littérature',
    'Mathématiques & Sciences',
    'Histoire, Géographie & Culture',
    'SVT & Biologie'
  ];

  copierFaceId(faceId: string, event: MouseEvent): void {
    event.stopPropagation();
    if (!faceId) return;
    navigator.clipboard?.writeText(faceId);
    this.idCopie = faceId;
    setTimeout(() => {
      if (this.idCopie === faceId) {
        this.idCopie = null;
      }
    }, 2000);
  }

  get avatarsFiltresParMoteur(): AvatarPedagogiqueDTO[] {
    if (this.filtreMoteur === 'tous') return this.avatars;
    return this.avatars.filter(a => a.moteurRendu === this.filtreMoteur);
  }
}
