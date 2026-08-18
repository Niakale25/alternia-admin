import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-introuvable',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './page-introuvable.component.html',
  styleUrls: ['./page-introuvable.component.scss']
})
export class PageIntrouvableComponent {}
