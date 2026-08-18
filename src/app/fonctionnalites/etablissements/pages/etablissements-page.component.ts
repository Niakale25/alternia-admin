import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtablissementService } from '../services/etablissement.service';
import { BanniereRegionaleComponent } from '../composants/banniere-regionale/banniere-regionale.component';
import { TableauEtablissementsComponent } from '../composants/tableau-etablissements/tableau-etablissements.component';
import { ModalEtablissementComponent } from '../composants/modal-etablissement/modal-etablissement.component';
import { CarteStatistiqueComponent } from '@partage/composants/carte-statistique/carte-statistique.component';
import { EtatVideComponent } from '@partage/composants/etat-vide/etat-vide.component';
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
    EtatVideComponent
  ],
  templateUrl: './etablissements-page.component.html',
  styleUrls: ['./etablissements-page.component.scss']
})
export class EtablissementsPageComponent implements OnInit {
  readonly service = inject(EtablissementService);
  readonly modalOuvert = signal<boolean>(false);

  ngOnInit(): void {
    this.service.chargerEtablissements();
  }

  onCreerEtablissement(donnees: Omit<EtablissementDTO, 'id' | 'dateInscription'>): void {
    this.service.creerEtablissement(donnees);
    this.modalOuvert.set(false);
  }
}
