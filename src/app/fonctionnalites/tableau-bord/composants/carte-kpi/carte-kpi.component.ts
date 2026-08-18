import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlSecurisePipe } from '@partage/tuyaux/html-securise.pipe';
import { KpiTableauBordDTO } from '../../modeles/tableau-bord.model';

@Component({
  selector: 'app-tdb-carte-kpi',
  standalone: true,
  imports: [CommonModule, HtmlSecurisePipe],
  templateUrl: './carte-kpi.component.html',
  styleUrls: ['./carte-kpi.component.scss']
})
export class CarteKpiComponent {
  @Input({ required: true }) kpi!: KpiTableauBordDTO;
}
