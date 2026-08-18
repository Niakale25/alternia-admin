import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableauBordService } from '../services/tableau-bord.service';
import { CarteKpiComponent } from '../composants/carte-kpi/carte-kpi.component';
import { GraphiqueCroissanceComponent } from '../composants/graphique-croissance/graphique-croissance.component';
import { ListeAlertesComponent } from '../composants/liste-alertes/liste-alertes.component';
import { RepartitionLicencesComponent } from '../composants/repartition-licences/repartition-licences.component';
import { ActionsRapidesComponent } from '../composants/actions-rapides/actions-rapides.component';
import { ChargeurSqueletteComponent } from '@partage/composants/chargeur-squelette/chargeur-squelette.component';
import { AlertePrioritaireDTO } from '../modeles/tableau-bord.model';

@Component({
  selector: 'app-tableau-bord-page',
  standalone: true,
  imports: [
    CommonModule,
    CarteKpiComponent,
    GraphiqueCroissanceComponent,
    ListeAlertesComponent,
    RepartitionLicencesComponent,
    ActionsRapidesComponent,
    ChargeurSqueletteComponent
  ],
  templateUrl: './tableau-bord-page.component.html',
  styleUrls: ['./tableau-bord-page.component.scss']
})
export class TableauBordPageComponent implements OnInit {
  readonly tdbService = inject(TableauBordService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.tdbService.chargerDonnees();
  }

  onTraiterAlerte(alerte: AlertePrioritaireDTO): void {
    if (alerte.type === 'renouvellement') {
      this.router.navigate(['/licences']);
    } else if (alerte.type === 'boitier') {
      this.router.navigate(['/boitiers']);
    } else if (alerte.type === 'etablissement') {
      this.router.navigate(['/etablissements']);
    }
  }
}
