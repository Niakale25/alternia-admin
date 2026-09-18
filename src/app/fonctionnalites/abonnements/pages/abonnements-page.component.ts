import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbonnementService } from '../services/abonnement.service';
import { TableauAbonnementsComponent } from '../composants/tableau-abonnements/tableau-abonnements.component';
import { ModalAbonnementComponent } from '../composants/modal-abonnement/modal-abonnement.component';
import { CarteStatistiqueComponent } from '@partage/composants/carte-statistique/carte-statistique.component';
import { EtatVideComponent } from '@partage/composants/etat-vide/etat-vide.component';
import { ModalConfirmationComponent } from '@partage/composants/modal-confirmation/modal-confirmation.component';
import { NotificationService } from '@partage/services/notification.service';
import { AbonnementDTO } from '../modeles/abonnement.model';

@Component({
  selector: 'app-abonnements-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableauAbonnementsComponent,
    ModalAbonnementComponent,
    CarteStatistiqueComponent,
    EtatVideComponent,
    ModalConfirmationComponent
  ],
  templateUrl: './abonnements-page.component.html',
  styleUrls: ['./abonnements-page.component.scss']
})
export class AbonnementsPageComponent implements OnInit {
  readonly service = inject(AbonnementService);
  private readonly notificationService = inject(NotificationService);

  readonly modalOuvert = signal<boolean>(false);
  readonly abonnementASupprimer = signal<AbonnementDTO | null>(null);

  ngOnInit(): void {
    this.service.chargerAbonnements();
  }

  onCreerAbonnement(donnees: Omit<AbonnementDTO, 'id' | 'dateDebut'>): void {
    this.service.creerAbonnement(donnees);
    this.modalOuvert.set(false);
  }

  demanderSuppression(abonnement: AbonnementDTO): void {
    this.abonnementASupprimer.set(abonnement);
  }

  confirmerSuppression(): void {
    const a = this.abonnementASupprimer();
    if (a) {
      this.service.supprimer(a.id);
      this.notificationService.succes(`L'abonnement de ${a.parentNom} (${a.type}) a été supprimé.`);
      this.abonnementASupprimer.set(null);
    }
  }
}
