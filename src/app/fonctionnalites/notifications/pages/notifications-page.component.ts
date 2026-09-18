import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotificationService, NotificationDTO, CategorieNotification, TypeNotification } from '@partage/services/notification.service';
import { CarteStatistiqueComponent } from '@partage/composants/carte-statistique/carte-statistique.component';
import { BadgeComponent } from '@partage/composants/badge/badge.component';
import { EtatVideComponent } from '@partage/composants/etat-vide/etat-vide.component';
import { ModalConfirmationComponent } from '@partage/composants/modal-confirmation/modal-confirmation.component';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CarteStatistiqueComponent,
    EtatVideComponent,
    ModalConfirmationComponent
  ],
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss']
})
export class NotificationsPageComponent {
  readonly service = inject(NotificationService);

  readonly modalViderOuverte = signal<boolean>(false);
  readonly notifASupprimer = signal<NotificationDTO | null>(null);

  onMarquerLu(notif: NotificationDTO): void {
    this.service.marquerCommeLu(notif.id);
  }

  onToutMarquerLu(): void {
    this.service.marquerToutCommeLu();
  }

  demanderSuppression(notif: NotificationDTO): void {
    this.notifASupprimer.set(notif);
  }

  confirmerSupprimer(): void {
    const notif = this.notifASupprimer();
    if (notif) {
      this.service.supprimer(notif.id);
      this.notifASupprimer.set(null);
    }
  }

  demanderVider(): void {
    this.modalViderOuverte.set(true);
  }

  confirmerVider(): void {
    this.service.viderHistorique();
    this.modalViderOuverte.set(false);
  }

  reinitialiserFiltres(): void {
    this.service.filtreCategorie.set('toutes');
    this.service.filtreStatut.set('toutes');
    this.service.filtreType.set('tous');
    this.service.recherche.set('');
  }

  get totalNotifications(): number {
    return this.service.notifications().length;
  }

  get totalCritiques(): number {
    return this.service.notifications().filter(n => n.type === 'erreur').length;
  }

  get totalAvertissements(): number {
    return this.service.notifications().filter(n => n.type === 'avertissement').length;
  }

  get totalHardware(): number {
    return this.service.notifications().filter(n => n.categorie === 'hardware').length;
  }
}
