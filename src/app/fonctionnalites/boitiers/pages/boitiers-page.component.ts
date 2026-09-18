import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoitierService } from '../services/boitier.service';
import { TableauBoitiersComponent } from '../composants/tableau-boitiers/tableau-boitiers.component';
import { InspecteurHardwareComponent } from '../composants/inspecteur-hardware/inspecteur-hardware.component';
import { CampagnesOtaComponent } from '../composants/campagnes-ota/campagnes-ota.component';
import { ModalBoitierComponent } from '../composants/modal-boitier/modal-boitier.component';
import { CarteStatistiqueComponent } from '@partage/composants/carte-statistique/carte-statistique.component';
import { EtatVideComponent } from '@partage/composants/etat-vide/etat-vide.component';
import { ModalConfirmationComponent } from '@partage/composants/modal-confirmation/modal-confirmation.component';
import { NotificationService } from '@partage/services/notification.service';
import { BoitierDTO } from '../modeles/boitier.model';

@Component({
  selector: 'app-boitiers-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableauBoitiersComponent,
    InspecteurHardwareComponent,
    CampagnesOtaComponent,
    ModalBoitierComponent,
    CarteStatistiqueComponent,
    EtatVideComponent,
    ModalConfirmationComponent
  ],
  templateUrl: './boitiers-page.component.html',
  styleUrls: ['./boitiers-page.component.scss']
})
export class BoitiersPageComponent implements OnInit {
  readonly service = inject(BoitierService);
  private readonly notificationService = inject(NotificationService);

  readonly modalOuvert = signal<boolean>(false);
  readonly boitierASupprimer = signal<BoitierDTO | null>(null);

  ngOnInit(): void {
    this.service.chargerBoitiers();
  }

  onCreerBoitier(donnees: Omit<BoitierDTO, 'id' | 'derniereConnexion' | 'batterie' | 'stockageUtiliseGo' | 'elevesConnectes' | 'temperatureCpu'>): void {
    this.service.creerBoitier(donnees);
    this.modalOuvert.set(false);
  }

  demanderSuppression(boitier: BoitierDTO): void {
    this.boitierASupprimer.set(boitier);
  }

  confirmerSuppression(): void {
    const b = this.boitierASupprimer();
    if (b) {
      this.service.supprimer(b.id);
      this.notificationService.succes(`Le boîtier ${b.serialNumber} (${b.etablissementNom}) a été retiré du parc.`);
      this.boitierASupprimer.set(null);
    }
  }
}
