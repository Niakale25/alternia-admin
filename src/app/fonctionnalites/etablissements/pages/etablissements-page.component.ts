import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtablissementService } from '../services/etablissement.service';
import { BanniereRegionaleComponent } from '../composants/banniere-regionale/banniere-regionale.component';
import { TableauEtablissementsComponent } from '../composants/tableau-etablissements/tableau-etablissements.component';
import { ModalEtablissementComponent } from '../composants/modal-etablissement/modal-etablissement.component';
import { CarteStatistiqueComponent } from '@partage/composants/carte-statistique/carte-statistique.component';
import { EtatVideComponent } from '@partage/composants/etat-vide/etat-vide.component';
import { ModalConfirmationComponent } from '@partage/composants/modal-confirmation/modal-confirmation.component';
import { NotificationService } from '@partage/services/notification.service';
import { EtablissementDTO } from '../modeles/etablissement.model';

@Component({
  selector: 'app-etablissements-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BanniereRegionaleComponent,
    TableauEtablissementsComponent,
    ModalEtablissementComponent,
    CarteStatistiqueComponent,
    EtatVideComponent,
    ModalConfirmationComponent
  ],
  templateUrl: './etablissements-page.component.html',
  styleUrls: ['./etablissements-page.component.scss']
})
export class EtablissementsPageComponent implements OnInit {
  readonly service = inject(EtablissementService);
  private readonly notificationService = inject(NotificationService);

  readonly modalOuvert = signal<boolean>(false);
  readonly modeAffichage = signal<'tableau' | 'cartes'>('tableau');
  readonly etablissementASupprimer = signal<EtablissementDTO | null>(null);

  ngOnInit(): void {
    this.service.chargerEtablissements();
  }

  changerMode(mode: 'tableau' | 'cartes'): void {
    this.modeAffichage.set(mode);
  }

  onCreerEtablissement(donnees: Omit<EtablissementDTO, 'id' | 'dateInscription'>): void {
    this.service.creerEtablissement(donnees);
    this.modalOuvert.set(false);
  }

  demanderSuppression(etablissement: EtablissementDTO): void {
    this.etablissementASupprimer.set(etablissement);
  }

  confirmerSuppression(): void {
    const e = this.etablissementASupprimer();
    if (e) {
      this.service.supprimer(e.id);
      this.notificationService.succes(`L'établissement ${e.nom} a été supprimé du répertoire.`);
      this.etablissementASupprimer.set(null);
    }
  }

  reinitialiserFiltres(): void {
    this.service.recherche.set('');
    this.service.filtreStatut.set('Tous');
    this.service.filtreOffre.set('Toutes');
    this.service.filtreRegion.set('Toutes');
  }

  exporterDonnees(): void {
    const total = this.service.etablissementsFiltres().length;
    this.notificationService.succes(`Export du répertoire de ${total} établissement(s) généré avec succès.`);
  }
}
