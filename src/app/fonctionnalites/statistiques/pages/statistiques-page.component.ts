import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatistiqueService } from '../services/statistique.service';
import { GraphiqueStatistiquesComponent } from '../composants/graphique-statistiques/graphique-statistiques.component';
import { TableauMatieresComponent } from '../composants/tableau-matieres/tableau-matieres.component';
import { CarteStatistiqueComponent } from '@partage/composants/carte-statistique/carte-statistique.component';
import { ChargeurSqueletteComponent } from '@partage/composants/chargeur-squelette/chargeur-squelette.component';

@Component({
  selector: 'app-statistiques-page',
  standalone: true,
  imports: [
    CommonModule,
    GraphiqueStatistiquesComponent,
    TableauMatieresComponent,
    CarteStatistiqueComponent,
    ChargeurSqueletteComponent
  ],
  templateUrl: './statistiques-page.component.html',
  styleUrls: ['./statistiques-page.component.scss']
})
export class StatistiquesPageComponent implements OnInit {
  readonly service = inject(StatistiqueService);

  ngOnInit(): void {
    this.service.chargerStatistiques();
  }

  formaterNombre(val: number | null | undefined): string {
    if (val == null) return '0';
    if (val >= 1_000_000) {
      return (val / 1_000_000).toFixed(2).replace('.', ',') + 'M';
    }
    if (val >= 1_000) {
      return (val / 1_000).toFixed(1).replace('.', ',') + 'k';
    }
    return val.toLocaleString('fr-FR');
  }
}
