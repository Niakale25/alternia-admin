import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoRegionDTO } from '../../modeles/etablissement.model';

@Component({
  selector: 'app-banniere-regionale',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banniere-regionale.component.html',
  styleUrls: ['./banniere-regionale.component.scss']
})
export class BanniereRegionaleComponent {
  @Input({ required: true }) regions: InfoRegionDTO[] = [];
  @Input() regionSelectionnee: string = 'Toutes';
  @Output() selectionnerRegion = new EventEmitter<string>();

  get totalEtablissements(): number {
    return this.regions?.reduce((acc, r) => acc + (r.count || 0), 0) || 1247;
  }

  filtrer(region: string): void {
    if (this.regionSelectionnee === region && region !== 'Toutes') {
      this.selectionnerRegion.emit('Toutes');
    } else {
      this.selectionnerRegion.emit(region);
    }
  }
}
