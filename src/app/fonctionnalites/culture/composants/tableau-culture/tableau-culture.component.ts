import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenuCulturelDTO } from '../../modeles/culture.modele';

@Component({
  selector: 'app-tableau-culture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tableau-culture.component.html',
  styleUrls: ['./tableau-culture.component.scss']
})
export class TableauCultureComponent {
  @Input({ required: true }) contenus: ContenuCulturelDTO[] = [];

  @Output() voirDetail = new EventEmitter<ContenuCulturelDTO>();
  @Output() editer = new EventEmitter<ContenuCulturelDTO>();
  @Output() supprimer = new EventEmitter<ContenuCulturelDTO>();
  @Output() basculerPublication = new EventEmitter<string>();

  getTitre(item: ContenuCulturelDTO): string {
    if ('nom' in item) return item.nom;
    if ('titre' in item) return item.titre;
    if ('question' in item) return item.question;
    if ('titreHistoire' in item) return item.titreHistoire;
    return 'Sans titre';
  }

  getSousTitre(item: ContenuCulturelDTO): string {
    if ('titreHonorifique' in item) return item.titreHonorifique;
    if ('sousTitre' in item) return item.sousTitre;
    if ('categorie' in item) return item.categorie;
    if ('conteur' in item) return item.conteur;
    return '';
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'figure': return 'Figure';
      case 'monument': return 'Monument';
      case 'ville': return 'Cité/Ville';
      case 'conte': return 'Conte';
      case 'devinette': return 'Devinette';
      case 'quiz': return 'Quiz';
      case 'temoignage': return 'Récit';
      default: return type;
    }
  }

  getTypeBadgeClass(type: string): string {
    switch (type) {
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

  getImageUrl(item: ContenuCulturelDTO): string | null {
    if ('photoUrl' in item && item.photoUrl) return item.photoUrl;
    if ('avatarUrl' in item && item.avatarUrl) return item.avatarUrl;
    return null;
  }
}
