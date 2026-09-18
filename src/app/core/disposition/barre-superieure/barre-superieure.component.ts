import { Component, Input, Output, EventEmitter, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { NotificationService } from '../../../partage/services/notification.service';
import { AuthentificationService } from '../../services/authentification/authentification.service';

@Component({
  selector: 'app-barre-superieure',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './barre-superieure.component.html',
  styleUrls: ['./barre-superieure.component.scss']
})
export class BarreSuperieureComponent {
  private readonly router = inject(Router);
  readonly themeService = inject(ThemeService);
  readonly notificationService = inject(NotificationService);
  readonly authService = inject(AuthentificationService);

  @Input() barreRepliee: boolean = false;
  @Output() basculerBarre = new EventEmitter<void>();

  readonly urlActuelle = signal<string>(this.router.url);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.urlActuelle.set(event.urlAfterRedirects || event.url);
    });
  }

  readonly titrePage = computed(() => {
    const url = this.urlActuelle().split('?')[0];
    if (url.includes('/tableau-bord')) return 'Tableau de Bord';
    if (url.includes('/etablissements')) return 'Établissements Scolaires';
    if (url.includes('/parents')) return 'Comptes Parents';
    if (url.includes('/boitiers')) return 'Boîtiers Alternia';
    if (url.includes('/culture')) return 'Culture & Patrimoine';
    if (url.includes('/pedagogie-ia')) return 'Studio Avatars & IA';
    if (url.includes('/abonnements')) return 'Abonnements & Formules';
    if (url.includes('/statistiques')) return 'Statistiques d\'Impact';
    if (url.includes('/notifications')) return 'Centre de Notifications';
    if (url.includes('/parametres')) return 'Paramètres Système';
    return 'Supervision Générale';
  });

  readonly initiales = computed(() => {
    const nom = this.authService.adminInfo()?.nom?.trim();
    if (!nom) return 'SA';
    const parties = nom.split(/\s+/).filter(Boolean);
    if (parties.length >= 2) {
      return (parties[0][0] + parties[1][0]).toUpperCase();
    }
    return nom.slice(0, 2).toUpperCase();
  });
}
