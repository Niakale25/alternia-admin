import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertePrioritaireDTO } from '../../modeles/tableau-bord.model';

@Component({
  selector: 'app-tdb-liste-alertes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-alertes.component.html',
  styleUrls: ['./liste-alertes.component.scss']
})
export class ListeAlertesComponent {
  @Input({ required: true }) alertes!: AlertePrioritaireDTO[];
  @Output() traiterAlerte = new EventEmitter<AlertePrioritaireDTO>();
}
