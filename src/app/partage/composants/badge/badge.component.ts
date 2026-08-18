import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type VarianteBadge = 'primaire' | 'succes' | 'danger' | 'avertissement' | 'info' | 'cyan' | 'neutre';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  @Input() variante: VarianteBadge = 'primaire';
  @Input() avecPoint: boolean = false;
  @Input() texte: string = '';
}
