import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParametresPlateformeDTO } from '../../modeles/parametres.model';

@Component({
  selector: 'app-section-securite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './section-securite.component.html',
  styleUrls: ['./section-securite.component.scss']
})
export class SectionSecuriteComponent {
  @Input({ required: true }) parametres!: ParametresPlateformeDTO;
  @Output() enregistrer = new EventEmitter<Partial<ParametresPlateformeDTO>>();

  onSauvegarder(): void {
    this.enregistrer.emit(this.parametres);
  }
}
