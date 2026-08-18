import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@partage/composants/badge/badge.component';
import { BoitierDTO } from '../../modeles/boitier.model';

@Component({
  selector: 'app-tableau-boitiers',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './tableau-boitiers.component.html',
  styleUrls: ['./tableau-boitiers.component.scss']
})
export class TableauBoitiersComponent {
  @Input({ required: true }) boitiers!: BoitierDTO[];
  @Output() changerStatut = new EventEmitter<{ id: string; statut: 'Actif' | 'Hors ligne' | 'Maintenance' }>();
  @Output() supprimer = new EventEmitter<string>();
}
