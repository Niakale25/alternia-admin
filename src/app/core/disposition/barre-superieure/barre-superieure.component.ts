import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { NotificationService } from '../../../partage/services/notification.service';

@Component({
  selector: 'app-barre-superieure',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './barre-superieure.component.html',
  styleUrls: ['./barre-superieure.component.scss']
})
export class BarreSuperieureComponent {
  readonly themeService = inject(ThemeService);
  readonly notificationService = inject(NotificationService);

  @Input() barreRepliee: boolean = false;
  @Output() basculerBarre = new EventEmitter<void>();

  readonly rechercheTexte = signal<string>('');

  onRecherche(event: Event | any): void {
    const cible = (event?.target as HTMLInputElement | null);
    if (cible) {
      this.rechercheTexte.set(cible.value);
    }
  }

  declencherNotificationDemo(): void {
    this.notificationService.info('Système opérationnel — Synchronisation active avec les 1 247 boîtiers scolaires.');
  }
}
