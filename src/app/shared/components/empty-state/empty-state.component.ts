import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="empty-state__icon">
        <ng-content select="[icon]"></ng-content>
      </div>
      <div class="empty-state__title">{{ title() }}</div>
      <div class="empty-state__desc">{{ description() }}</div>
      <div class="mt-4">
        <ng-content select="[action]"></ng-content>
      </div>
    </div>
  `
})
export class EmptyStateComponent {
  title = input.required<string>();
  description = input.required<string>();
}
