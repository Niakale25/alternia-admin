import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fenetre-modale',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fenetre-modale.component.html',
  styleUrls: ['./fenetre-modale.component.scss']
})
export class FenetreModaleComponent {
  @Input() ouvert: boolean = false;
  @Input() titre: string = '';
  @Input() sousTitre: string = '';
  @Input() largeurMax: string = '540px';
  @Output() fermer = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onToucheEchap(): void {
    if (this.ouvert) {
      this.fermer.emit();
    }
  }

  clicArrierePlan(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modale-arriere-plan')) {
      this.fermer.emit();
    }
  }
}
