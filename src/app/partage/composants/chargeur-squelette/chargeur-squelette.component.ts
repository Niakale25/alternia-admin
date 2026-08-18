import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chargeur-squelette',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chargeur-squelette.component.html',
  styleUrls: ['./chargeur-squelette.component.scss']
})
export class ChargeurSqueletteComponent {
  @Input() largeur: string = '100%';
  @Input() hauteur: string = '20px';
  @Input() rayon: string = 'var(--r-sm)';
  @Input() type: 'ligne' | 'cercle' | 'carte' = 'ligne';
}
