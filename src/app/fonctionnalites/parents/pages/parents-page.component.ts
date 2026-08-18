import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParentService } from '../services/parent.service';
import { TableauParentsComponent } from '../composants/tableau-parents/tableau-parents.component';
import { ModalParentComponent } from '../composants/modal-parent/modal-parent.component';
import { CarteStatistiqueComponent } from '@partage/composants/carte-statistique/carte-statistique.component';
import { EtatVideComponent } from '@partage/composants/etat-vide/etat-vide.component';
import { ParentDTO } from '../modeles/parent.model';

@Component({
  selector: 'app-parents-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableauParentsComponent,
    ModalParentComponent,
    CarteStatistiqueComponent,
    EtatVideComponent
  ],
  templateUrl: './parents-page.component.html',
  styleUrls: ['./parents-page.component.scss']
})
export class ParentsPageComponent implements OnInit {
  readonly service = inject(ParentService);
  readonly modalOuvert = signal<boolean>(false);

  ngOnInit(): void {
    this.service.chargerParents();
  }

  onCreerParent(donnees: Omit<ParentDTO, 'id' | 'derniereActivite'>): void {
    this.service.creerParent(donnees);
    this.modalOuvert.set(false);
  }
}
