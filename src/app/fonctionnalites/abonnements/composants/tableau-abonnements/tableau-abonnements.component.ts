import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@partage/composants/badge/badge.component';
import { FormatFcfaPipe } from '@partage/tuyaux/format-fcfa.pipe';
import { AbonnementDTO } from '../../modeles/abonnement.model';

@Component({
  selector: 'app-tableau-abonnements',
  standalone: true,
  imports: [CommonModule, BadgeComponent, FormatFcfaPipe],
  templateUrl: './tableau-abonnements.component.html',
  styleUrls: ['./tableau-abonnements.component.scss']
})
export class TableauAbonnementsComponent {
  @Input({ required: true }) abonnements!: AbonnementDTO[];
  @Output() changerStatut = new EventEmitter<{ id: string; statut: 'Actif' | 'Résilié' | 'En attente de paiement' | 'Suspendu' }>();
  @Output() supprimer = new EventEmitter<string>();
}
