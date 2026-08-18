import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@partage/composants/badge/badge.component';
import { EtablissementDTO } from '../../modeles/etablissement.model';

@Component({
  selector: 'app-tableau-etablissements',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './tableau-etablissements.component.html',
  styleUrls: ['./tableau-etablissements.component.scss']
})
export class TableauEtablissementsComponent {
  @Input({ required: true }) etablissements!: EtablissementDTO[];
  @Output() basculerStatut = new EventEmitter<string>();
  @Output() supprimer = new EventEmitter<string>();
}
