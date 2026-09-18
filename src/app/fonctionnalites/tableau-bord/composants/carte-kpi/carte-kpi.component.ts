import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlSecurisePipe } from '@partage/tuyaux/html-securise.pipe';
import { KpiTableauBordDTO } from '../../modeles/tableau-bord.model';

@Component({
  selector: 'app-tdb-carte-kpi',
  standalone: true,
  imports: [CommonModule, HtmlSecurisePipe],
  templateUrl: './carte-kpi.component.html',
  styleUrls: ['./carte-kpi.component.scss']
})
export class CarteKpiComponent {
  @Input({ required: true }) kpi!: KpiTableauBordDTO;

  readonly sparklineData = computed(() => {
    const raw = this.kpi?.sparkline;
    if (!raw || raw.length < 2) return { path: '', area: '', points: [] };

    const width = 84;
    const height = 28;
    const pad = 2;

    const min = Math.min(...raw);
    const max = Math.max(...raw);
    const range = max - min || 1;

    const stepX = (width - 2 * pad) / (raw.length - 1);

    const coords = raw.map((val, i) => {
      const x = pad + i * stepX;
      const y = height - pad - ((val - min) / range) * (height - 2 * pad);
      return { x, y };
    });

    // Spline Catmull-Rom / Bézier
    let path = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[Math.max(0, i - 1)];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[Math.min(coords.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    const last = coords[coords.length - 1];
    const first = coords[0];
    const area = `${path} L ${last.x.toFixed(1)} ${height} L ${first.x.toFixed(1)} ${height} Z`;

    return { path, area, lastPoint: last };
  });
}
