import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tdb-actions-rapides',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './actions-rapides.component.html',
  styleUrls: ['./actions-rapides.component.scss']
})
export class ActionsRapidesComponent {}
