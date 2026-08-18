import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '@partage/composants/badge/badge.component';
import { ParentDTO } from '../../modeles/parent.model';

@Component({
  selector: 'app-tableau-parents',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './tableau-parents.component.html',
  styleUrls: ['./tableau-parents.component.scss']
})
export class TableauParentsComponent {
  @Input({ required: true }) parents!: ParentDTO[];
  @Output() basculerStatut = new EventEmitter<string>();
  @Output() supprimer = new EventEmitter<string>();
}
