import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlSecurisePipe } from '../../tuyaux/html-securise.pipe';

@Component({
  selector: 'app-etat-vide',
  standalone: true,
  imports: [CommonModule, HtmlSecurisePipe],
  templateUrl: './etat-vide.component.html',
  styleUrls: ['./etat-vide.component.scss']
})
export class EtatVideComponent {
  @Input() titre: string = 'Aucun élément trouvé';
  @Input() message: string = 'Aucune donnée ne correspond à vos critères actuels.';
  @Input() texteAction: string = '';
  @Input() iconeSvg: string = '';
  @Output() action = new EventEmitter<void>();
}
