import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-graphique-statistiques',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graphique-statistiques.component.html',
  styleUrls: ['./graphique-statistiques.component.scss']
})
export class GraphiqueStatistiquesComponent {
  @Input({ required: true }) evolution!: Array<{
    mois: string;
    questions: number;
    boitiersActifs: number;
    sessions: number;
  }>;
}
