import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  readonly Math = Math;

  @Input() pageCourante: number = 0; // 0-indexé standard Spring Boot
  @Input() totalPages: number = 1;
  @Input() totalElements: number = 0;
  @Input() taillePage: number = 10;
  @Output() changementPage = new EventEmitter<number>();

  pagesAffichees(): number[] {
    const total = this.totalPages;
    const courante = this.pageCourante;
    const pages: number[] = [];

    const debut = Math.max(0, courante - 2);
    const fin = Math.min(total - 1, courante + 2);

    for (let i = debut; i <= fin; i++) {
      pages.push(i);
    }
    return pages;
  }

  allerPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.pageCourante) {
      this.changementPage.emit(page);
    }
  }
}
