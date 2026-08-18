import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LicenceService } from '../services/licence.service';
import { TableauLicencesComponent } from '../composants/tableau-licences/tableau-licences.component';
import { ModalLicenceComponent } from '../composants/modal-licence/modal-licence.component';
import { CarteStatistiqueComponent } from '@partage/composants/carte-statistique/carte-statistique.component';
import { EtatVideComponent } from '@partage/composants/etat-vide/etat-vide.component';
import { LicenceDTO } from '../modeles/licence.model';

@Component({
  selector: 'app-licences-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableauLicencesComponent,
    ModalLicenceComponent,
    CarteStatistiqueComponent,
    EtatVideComponent
  ],
  templateUrl: './licences-page.component.html',
  styleUrls: ['./licences-page.component.scss']
})
export class LicencesPageComponent implements OnInit {
  readonly service = inject(LicenceService);
  readonly modalOuvert = signal<boolean>(false);

  ngOnInit(): void {
    this.service.chargerLicences();
  }

  onCreerLicence(donnees: Omit<LicenceDTO, 'id' | 'code' | 'dateActivation'>): void {
    this.service.creerLicence(donnees);
    this.modalOuvert.set(false);
  }
}
