import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@partage/composants/badge/badge.component';
import { CampagneOtaDTO } from '@donnees/repositories/boitier.repository';

@Component({
  selector: 'app-campagnes-ota',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './campagnes-ota.component.html',
  styleUrls: ['./campagnes-ota.component.scss']
})
export class CampagnesOtaComponent {
  @Input({ required: true }) campagnes: CampagneOtaDTO[] = [];
  @Output() lancerCampagne = new EventEmitter<string>();
}
