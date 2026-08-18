import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tdb-repartition-licences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repartition-licences.component.html',
  styleUrls: ['./repartition-licences.component.scss']
})
export class RepartitionLicencesComponent {
  @Input({ required: true }) repartition!: Array<{
    type: string;
    pourcentage: number;
    total: number;
    couleur: string;
  }>;
}
