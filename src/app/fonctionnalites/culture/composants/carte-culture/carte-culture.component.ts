import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenuCulturelDTO } from '../../modeles/culture.modele';

@Component({
  selector: 'app-carte-culture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carte-culture.component.html',
  styleUrls: ['./carte-culture.component.scss']
})
export class CarteCultureComponent {
  @Input({ required: true }) item!: ContenuCulturelDTO;
  @Input() regionCouleur: string = 'var(--c-brand)';

  @Output() voirDetail = new EventEmitter<ContenuCulturelDTO>();
  @Output() editer = new EventEmitter<ContenuCulturelDTO>();
  @Output() supprimer = new EventEmitter<ContenuCulturelDTO>();
  @Output() basculerPublication = new EventEmitter<string>();

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
    if ('categorie' in this.item) return `Catégorie : ${this.item.categorie}`;
    if ('conteur' in this.item) return `${this.item.conteur} (${this.item.qualiteConteur})`;
    return '';
  }

  get tag(): string {
    if ('tag' in this.item && typeof this.item.tag === 'string') return this.item.tag;
    if ('categorie' in this.item && typeof this.item.categorie === 'string') return this.item.categorie;
    if (this.item.type === 'devinette') return this.item.difficulte;
    return this.item.type.toUpperCase();
  }

  get imageUrl(): string | null {
    if ('photoUrl' in this.item && this.item.photoUrl) return this.item.photoUrl;
    if ('avatarUrl' in this.item && this.item.avatarUrl) return this.item.avatarUrl;
    return null;
  }

  get typeLabel(): string {
    switch (this.item.type) {
      case 'figure': return 'Figure Historique';
      case 'monument': return 'Monument';
      case 'ville': return 'Cité & Village';
      case 'conte': return 'Conte';
      case 'devinette': return 'Devinette';
      case 'quiz': return 'Quiz Culturel';
      case 'temoignage': return 'Récit Oral';
      default: return 'Contenu';
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

  get infoSupplementaire(): string | null {
    if (this.item.type === 'conte') {
      return `${this.item.scenes?.length || 0} scènes • ${this.item.dureeAudio}`;
    }
    if (this.item.type === 'devinette') {
      return `+${this.item.recompenseXp} XP • 3 indices`;
    }
    if (this.item.type === 'quiz') {
      return `+${this.item.recompenseXp} XP • 4 options`;
    }
    if (this.item.type === 'temoignage') {
      return `${this.item.duree}`;
    }
    if (this.item.type === 'figure') {
      return `${this.item.periode}`;
    }
    if (this.item.type === 'monument') {
      return `${this.item.ere}`;
    }
    return null;
  }
}
