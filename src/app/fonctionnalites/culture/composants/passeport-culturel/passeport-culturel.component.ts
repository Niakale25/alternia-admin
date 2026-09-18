import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@partage/composants/badge/badge.component';
import { TamponPasseportDTO, NiveauExplorateurDTO } from '../../modeles/culture.modele';

@Component({
  selector: 'app-passeport-culturel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './passeport-culturel.component.html',
  styleUrls: ['./passeport-culturel.component.scss']
})
export class PasseportCulturelComponent {
  @Input({ required: true }) tampons: TamponPasseportDTO[] = [];
  @Input({ required: true }) niveaux: NiveauExplorateurDTO[] = [];

  @Output() basculerActif = new EventEmitter<string>();
}
