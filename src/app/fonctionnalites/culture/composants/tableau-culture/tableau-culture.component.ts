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
    const i = item as any;
    return i.titre || i.nom || i.question || i.titreHistoire || i.enigmeTexte || 'Sans titre';
  }

  getSousTitre(item: ContenuCulturelDTO): string {
    const i = item as any;
    return i.sousTitre || i.titreHonorifique || (i.categorie ? `Catégorie : ${i.categorie}` : '') || '';
  }

  getSpecificite(item: ContenuCulturelDTO): string {
    const i = item as any;
    if (i.info && typeof i.info === 'string' && i.info.trim() && i.info !== 'undefined') {
      return i.info;
    }
    if (i.periode && typeof i.periode === 'string' && i.periode !== 'undefined') return i.periode;
    if (i.ere && typeof i.ere === 'string' && i.ere !== 'undefined') return i.ere;
    if (i.epoqueOuSiecle && typeof i.epoqueOuSiecle === 'string') return i.epoqueOuSiecle;
    if (i.dureeAudio && typeof i.dureeAudio === 'string') return i.dureeAudio;
    if (i.recompenseXp) return `+${i.recompenseXp} XP`;
    return '—';
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

  readonly imagesEnErreur = new Set<string>();

  marquerImageErreur(id: string): void {
    this.imagesEnErreur.add(id);
  }

  aImageValide(item: ContenuCulturelDTO): boolean {
    return !!this.getImageUrl(item) && !this.imagesEnErreur.has(item.id);
  }

  getImageUrl(item: ContenuCulturelDTO): string | null {
    const i = item as any;
    return i.photoUrl || i.avatarUrl || null;
  }
}
