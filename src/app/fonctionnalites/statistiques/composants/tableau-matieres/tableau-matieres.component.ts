import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tableau-matieres',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tableau-matieres.component.html',
  styleUrls: ['./tableau-matieres.component.scss']
})
export class TableauMatieresComponent {
  @Input({ required: true }) matieres!: Array<{
    matiere: string;
    pourcentage: number;
    heuresTotal: number;
    croissance: number;
  }>;
}
