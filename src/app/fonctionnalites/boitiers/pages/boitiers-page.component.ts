import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoitierService } from '../services/boitier.service';
import { TableauBoitiersComponent } from '../composants/tableau-boitiers/tableau-boitiers.component';
import { ModalBoitierComponent } from '../composants/modal-boitier/modal-boitier.component';
import { CarteStatistiqueComponent } from '@partage/composants/carte-statistique/carte-statistique.component';
import { EtatVideComponent } from '@partage/composants/etat-vide/etat-vide.component';
import { BoitierDTO } from '../modeles/boitier.model';

@Component({
  selector: 'app-boitiers-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableauBoitiersComponent,
    ModalBoitierComponent,
    CarteStatistiqueComponent,
    EtatVideComponent
  ],
  templateUrl: './boitiers-page.component.html',
  styleUrls: ['./boitiers-page.component.scss']
})
export class BoitiersPageComponent implements OnInit {
  readonly service = inject(BoitierService);
  readonly modalOuvert = signal<boolean>(false);

  ngOnInit(): void {
    this.service.chargerBoitiers();
  }

  onCreerBoitier(donnees: Omit<BoitierDTO, 'id' | 'derniereConnexion'>): void {
    this.service.creerBoitier(donnees);
    this.modalOuvert.set(false);
  }
}
