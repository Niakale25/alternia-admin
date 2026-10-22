import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
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

  readonly imageErreur = signal<boolean>(false);

  onImageErreur(): void {
    this.imageErreur.set(true);
  }

  get titre(): string {
    const i = this.item as any;
    return i.titre || i.nom || i.question || i.titreHistoire || i.enigmeTexte || 'Sans titre';
  }

  get sousTitre(): string {
    const i = this.item as any;
    return i.sousTitre || i.titreHonorifique || (i.categorie ? `Catégorie : ${i.categorie}` : '') || '';
  }

  get tag(): string {
    const i = this.item as any;
    return i.tag || i.etiquette || i.categorie || i.difficulte || this.typeLabel;
  }

  get imageUrl(): string | null {
    const i = this.item as any;
    return i.photoUrl || i.avatarUrl || null;
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
    const i = this.item as any;
    if (i.info && typeof i.info === 'string' && i.info.trim() && i.info !== 'undefined') {
      return i.info;
    }
    if (i.periode && typeof i.periode === 'string' && i.periode !== 'undefined') return i.periode;
    if (i.ere && typeof i.ere === 'string' && i.ere !== 'undefined') return i.ere;
    if (i.epoqueOuSiecle && typeof i.epoqueOuSiecle === 'string') return i.epoqueOuSiecle;
    if (i.dureeAudio && typeof i.dureeAudio === 'string') return i.dureeAudio;
    if (i.recompenseXp) return `+${i.recompenseXp} XP`;
    return null;
  }

  get resumeCourt(): string {
    const i = this.item as any;
    return i.resume || i.presentation || i.explicationCulturelle || i.extrait || '';
  }
}

