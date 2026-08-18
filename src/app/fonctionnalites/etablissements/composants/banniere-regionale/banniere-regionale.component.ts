import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input({ required: true }) regions!: InfoRegionDTO[];
  @Input() regionSelectionnee: string = 'Toutes';
  @Output() selectionnerRegion = new EventEmitter<string>();

  filtrer(region: string): void {
    if (this.regionSelectionnee === region) {
      this.selectionnerRegion.emit('Toutes');
    } else {
      this.selectionnerRegion.emit(region);
    }
  }
}
