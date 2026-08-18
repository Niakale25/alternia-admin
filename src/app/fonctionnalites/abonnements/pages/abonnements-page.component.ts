import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbonnementService } from '../services/abonnement.service';
import { TableauAbonnementsComponent } from '../composants/tableau-abonnements/tableau-abonnements.component';
import { ModalAbonnementComponent } from '../composants/modal-abonnement/modal-abonnement.component';
import { CarteStatistiqueComponent } from '@partage/composants/carte-statistique/carte-statistique.component';
import { EtatVideComponent } from '@partage/composants/etat-vide/etat-vide.component';
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
    EtatVideComponent
  ],
  templateUrl: './abonnements-page.component.html',
  styleUrls: ['./abonnements-page.component.scss']
})
export class AbonnementsPageComponent implements OnInit {
  readonly service = inject(AbonnementService);
  readonly modalOuvert = signal<boolean>(false);

  ngOnInit(): void {
    this.service.chargerAbonnements();
  }

  onCreerAbonnement(donnees: Omit<AbonnementDTO, 'id' | 'dateDebut'>): void {
    this.service.creerAbonnement(donnees);
    this.modalOuvert.set(false);
  }
}
