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
  readonly modeAffichage = signal<'tableau' | 'cartes'>('tableau');

  readonly formulesStats = signal([
    { nom: 'Tous', count: 48391 },
    { nom: 'Premium Annuel', count: 34110, couleur: 'var(--c-accent)' },
    { nom: 'Standard Mensuel', count: 11462, couleur: 'var(--c-brand)' },
    { nom: 'Découverte', count: 2819, couleur: 'var(--c-cyan)' }
  ]);

  ngOnInit(): void {
    this.service.chargerParents();
  }

  changerMode(mode: 'tableau' | 'cartes'): void {
    this.modeAffichage.set(mode);
  }

  filtrerFormule(formule: string): void {
    this.service.filtreAbonnement.set(formule);
  }

  reinitialiserFiltres(): void {
    this.service.recherche.set('');
    this.service.filtreStatut.set('Tous');
    this.service.filtreAbonnement.set('Tous');
  }

  onCreerParent(donnees: Omit<ParentDTO, 'id' | 'derniereActivite'>): void {
    this.service.creerParent(donnees);
    this.modalOuvert.set(false);
  }
}
