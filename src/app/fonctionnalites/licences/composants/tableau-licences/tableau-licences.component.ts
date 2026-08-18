import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@partage/composants/badge/badge.component';
import { FormatFcfaPipe } from '@partage/tuyaux/format-fcfa.pipe';
import { LicenceDTO } from '../../modeles/licence.model';

@Component({
  selector: 'app-tableau-licences',
  standalone: true,
  imports: [CommonModule, BadgeComponent, FormatFcfaPipe],
  templateUrl: './tableau-licences.component.html',
  styleUrls: ['./tableau-licences.component.scss']
})
export class TableauLicencesComponent {
  @Input({ required: true }) licences!: LicenceDTO[];
  @Output() changerStatut = new EventEmitter<{ id: string; statut: 'Active' | 'Expirée' | 'En attente' | 'Renouvelée' }>();
  @Output() supprimer = new EventEmitter<string>();
}
