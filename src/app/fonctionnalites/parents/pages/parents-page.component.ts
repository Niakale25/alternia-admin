import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParentService } from '../services/parent.service';
import { TableauParentsComponent } from '../composants/tableau-parents/tableau-parents.component';
import { ModalParentComponent } from '../composants/modal-parent/modal-parent.component';
import { CarteStatistiqueComponent } from '@partage/composants/carte-statistique/carte-statistique.component';
import { EtatVideComponent } from '@partage/composants/etat-vide/etat-vide.component';
import { ModalConfirmationComponent } from '@partage/composants/modal-confirmation/modal-confirmation.component';
import { NotificationService } from '@partage/services/notification.service';
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
    EtatVideComponent,
    ModalConfirmationComponent
  ],
  templateUrl: './parents-page.component.html',
  styleUrls: ['./parents-page.component.scss']
})
export class ParentsPageComponent implements OnInit {
  readonly service = inject(ParentService);
  private readonly notificationService = inject(NotificationService);

  readonly modalOuvert = signal<boolean>(false);
  readonly modeAffichage = signal<'tableau' | 'cartes'>('tableau');
  readonly parentASupprimer = signal<ParentDTO | null>(null);

  readonly formulesStats = computed(() => {
    const list = this.service.parents();
    const famille = list.filter(p => p.abonnementsType === 'Premium Famille').length;
    const etab = list.filter(p => p.abonnementsType === 'Premium Établissement').length;
    const acces = list.filter(p => p.abonnementsType === 'Accès Général (Inclus Boîtier)').length;
    return [
      { nom: 'Tous', count: list.length },
      { nom: 'Premium Famille', count: famille, couleur: 'var(--c-brand)' },
      { nom: 'Premium Établissement', count: etab, couleur: 'var(--c-accent)' },
      { nom: 'Accès Général (Inclus Boîtier)', count: acces, couleur: 'var(--c-cyan)' }
    ];
  });

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

  demanderSuppression(parent: ParentDTO): void {
    this.parentASupprimer.set(parent);
  }

  confirmerSuppression(): void {
    const p = this.parentASupprimer();
    if (p) {
      this.service.supprimer(p.id);
      this.notificationService.succes(`Le compte de ${p.tuteur} a été supprimé avec succès.`);
      this.parentASupprimer.set(null);
    }
  }
}
