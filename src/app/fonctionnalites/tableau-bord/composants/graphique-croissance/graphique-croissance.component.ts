import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tdb-graphique-croissance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graphique-croissance.component.html',
  styleUrls: ['./graphique-croissance.component.scss']
})
export class GraphiqueCroissanceComponent {
  @Input({ required: true }) points!: Array<{
    mois: string;
    etablissements: number;
    parents: number;
    boitiers: number;
  }>;
}
