import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenuCulturelDTO, SceneConteDTO } from '../../modeles/culture.modele';

@Component({
  selector: 'app-tiroir-detail-culture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tiroir-detail-culture.component.html',
  styleUrls: ['./tiroir-detail-culture.component.scss']
})
export class TiroirDetailCultureComponent {
  @Input({ required: true }) item!: ContenuCulturelDTO;

  @Output() fermer = new EventEmitter<void>();
  @Output() editer = new EventEmitter<ContenuCulturelDTO>();
  @Output() supprimer = new EventEmitter<ContenuCulturelDTO>();
  @Output() basculerPublication = new EventEmitter<string>();

  readonly ongletActif = signal<'vue' | 'contenu' | 'metas'>('vue');

  get titre(): string {
    if ('nom' in this.item) return this.item.nom;
    if ('titre' in this.item) return this.item.titre;
    if ('question' in this.item) return this.item.question;
    if ('titreHistoire' in this.item) return this.item.titreHistoire;
    return 'Sans titre';
  }

  get sousTitre(): string {
    if ('titreHonorifique' in this.item) return this.item.titreHonorifique;
    if ('sousTitre' in this.item) return this.item.sousTitre;
    if ('categorie' in this.item) return this.item.categorie;
    if ('conteur' in this.item) return `${this.item.conteur} (${this.item.qualiteConteur})`;
    return '';
  }

  get typeLabel(): string {
    switch (this.item.type) {
      case 'figure': return 'Figure Historique';
      case 'monument': return 'Monument Historique';
      case 'ville': return 'Cité & Village';
      case 'conte': return 'Conte Interactif';
      case 'devinette': return 'Devinette Traditionnelle';
      case 'quiz': return 'Quiz Culturel';
      case 'temoignage': return 'Récit & Mémoire Vivante';
      default: return 'Contenu Culturel';
    }
  }

  get typeBadgeClass(): string {
    switch (this.item.type) {
      case 'figure': return 'badge--brand';
      case 'monument': return 'badge--info';
      case 'ville': return 'badge--warning';
      case 'conte': return 'badge--accent';
      case 'devinette': return 'badge--info';
      case 'quiz': return 'badge--success';
      case 'temoignage': return 'badge--neutral';
      default: return 'badge--neutral';
    }
  }

  get imageUrl(): string | null {
    if ('photoUrl' in this.item && this.item.photoUrl) return this.item.photoUrl;
    if ('avatarUrl' in this.item && this.item.avatarUrl) return this.item.avatarUrl;
    return null;
  }
}
