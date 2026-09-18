import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@partage/composants/badge/badge.component';
import { BoitierDTO } from '../../modeles/boitier.model';

@Component({
  selector: 'app-inspecteur-hardware',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './inspecteur-hardware.component.html',
  styleUrls: ['./inspecteur-hardware.component.scss']
})
export class InspecteurHardwareComponent {
  @Input({ required: true }) boitier!: BoitierDTO;
  @Output() fermer = new EventEmitter<void>();
  @Output() forcerSynchro = new EventEmitter<BoitierDTO>();
  @Output() redemarrerServeur = new EventEmitter<BoitierDTO>();
  @Output() changerStatut = new EventEmitter<{ id: string; statut: BoitierDTO['statut'] }>();
}
