import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlSecurisePipe } from '../../tuyaux/html-securise.pipe';

@Component({
  selector: 'app-carte-statistique',
  standalone: true,
  imports: [CommonModule, HtmlSecurisePipe],
  templateUrl: './carte-statistique.component.html',
  styleUrls: ['./carte-statistique.component.scss']
})
export class CarteStatistiqueComponent {
  @Input() titre: string = '';
  @Input() valeur: string | number = '';
  @Input() sousTexte: string = '';
  @Input() evolution: string = '';
  @Input() tendancePositive: boolean = true;
  @Input() iconeSvg: string = '';
  @Input() couleurAccent: string = 'var(--c-brand)';
}
