import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton" [ngStyle]="{
      'width': width(),
      'height': height(),
      'border-radius': borderRadius()
    }"></div>
  `,
  styles: [`
    .skeleton {
      background: linear-gradient(90deg, var(--c-surface-alt) 25%, var(--c-border-light) 50%, var(--c-surface-alt) 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite linear;
      display: inline-block;
    }
    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class SkeletonLoaderComponent {
  width = input<string>('100%');
  height = input<string>('20px');
  borderRadius = input<string>('var(--r-md)');
}
