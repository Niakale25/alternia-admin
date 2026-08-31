import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PointCroissance {
  mois: string;
  etablissements: number;
  parents: number;
  boitiers: number;
}

export type FiltreIndicateur = 'tous' | 'etablissements' | 'parents' | 'boitiers';
export type ModeVisualisation = 'spline' | 'barres';

@Component({
  selector: 'app-tdb-graphique-croissance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graphique-croissance.component.html',
  styleUrls: ['./graphique-croissance.component.scss']
})
export class GraphiqueCroissanceComponent {
  @Input({ required: true }) points: PointCroissance[] = [];

  readonly filtreActif = signal<FiltreIndicateur>('tous');
  readonly modeVisualisation = signal<ModeVisualisation>('spline');
  readonly indexSurvol = signal<number | null>(null);

  // Configuration graphique SVG
  readonly svgWidth = 720;
  readonly svgHeight = 230;
  readonly padLeft = 50;
  readonly padRight = 20;
  readonly padTop = 20;
  readonly padBottom = 35;
  readonly baselineY = 195;

  readonly maxEtab = 1500;
  readonly maxParents = 60000;
  readonly maxBoitiers = 1500;

  // Calcul des coordonnées
  readonly coords = computed(() => {
    const pts = this.points;
    if (!pts || pts.length === 0) return { etab: [], parents: [], boitiers: [], xs: [] };

    const plotWidth = this.svgWidth - this.padLeft - this.padRight;
    const plotHeight = this.baselineY - this.padTop;
    const stepX = pts.length > 1 ? plotWidth / (pts.length - 1) : 0;

    const xs = pts.map((_, i) => this.padLeft + i * stepX);

    const etab = pts.map((p, i) => ({
      x: xs[i],
      y: this.baselineY - (p.etablissements / this.maxEtab) * plotHeight,
      valeur: p.etablissements,
      mois: p.mois
    }));

    const parents = pts.map((p, i) => ({
      x: xs[i],
      y: this.baselineY - (p.parents / this.maxParents) * plotHeight,
      valeur: p.parents,
      mois: p.mois
    }));

    const boitiers = pts.map((p, i) => ({
      x: xs[i],
      y: this.baselineY - (p.boitiers / this.maxBoitiers) * plotHeight,
      valeur: p.boitiers,
      mois: p.mois
    }));

    return { etab, parents, boitiers, xs };
  });

  // Chemins SVG (splines & aires)
  readonly pathEtab = computed(() => this.construireCheminSpline(this.coords().etab));
  readonly areaEtab = computed(() => this.construireCheminAire(this.coords().etab));

  readonly pathParents = computed(() => this.construireCheminSpline(this.coords().parents));
  readonly areaParents = computed(() => this.construireCheminAire(this.coords().parents));

  readonly pathBoitiers = computed(() => this.construireCheminSpline(this.coords().boitiers));
  readonly areaBoitiers = computed(() => this.construireCheminAire(this.coords().boitiers));

  // Point actif (au survol ou dernier par défaut)
  readonly pointActif = computed(() => {
    if (!this.points || this.points.length === 0) return null;
    const idx = this.indexSurvol() !== null ? this.indexSurvol()! : this.points.length - 1;
    const current = this.points[idx];
    const prev = idx > 0 ? this.points[idx - 1] : null;

    const calcEvolution = (actuel: number, precedent: number | null) => {
      if (!precedent) return '+0.0%';
      const diff = ((actuel - precedent) / precedent) * 100;
      return (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
    };

    return {
      index: idx,
      data: current,
      x: this.coords().xs[idx] ?? 0,
      evolEtab: calcEvolution(current.etablissements, prev ? prev.etablissements : null),
      evolParents: calcEvolution(current.parents, prev ? prev.parents : null),
      evolBoitiers: calcEvolution(current.boitiers, prev ? prev.boitiers : null)
    };
  });

  // Statistiques globales de la période
  readonly statsGlobales = computed(() => {
    if (!this.points || this.points.length < 2) {
      return {
        croissanceEtab: '+0%',
        croissanceParents: '+0%',
        croissanceBoitiers: '+0%',
        totalEtab: 0,
        totalParents: 0,
        totalBoitiers: 0
      };
    }
    const premier = this.points[0];
    const dernier = this.points[this.points.length - 1];

    const pctEtab = (((dernier.etablissements - premier.etablissements) / premier.etablissements) * 100).toFixed(1);
    const pctParents = (((dernier.parents - premier.parents) / premier.parents) * 100).toFixed(1);
    const pctBoitiers = (((dernier.boitiers - premier.boitiers) / premier.boitiers) * 100).toFixed(1);

    return {
      croissanceEtab: `+${pctEtab}%`,
      croissanceParents: `+${pctParents}%`,
      croissanceBoitiers: `+${pctBoitiers}%`,
      totalEtab: dernier.etablissements,
      totalParents: dernier.parents,
      totalBoitiers: dernier.boitiers
    };
  });

  changerFiltre(filtre: FiltreIndicateur): void {
    this.filtreActif.set(filtre);
  }

  changerMode(mode: ModeVisualisation): void {
    this.modeVisualisation.set(mode);
  }

  survolerIndex(index: number | null): void {
    this.indexSurvol.set(index);
  }

  // Algorithme de Spline Cubique de Catmull-Rom
  private construireCheminSpline(points: Array<{ x: number; y: number }>): string {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }

  private construireCheminAire(points: Array<{ x: number; y: number }>): string {
    const linePath = this.construireCheminSpline(points);
    if (!linePath || points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    return `${linePath} L ${last.x.toFixed(1)} ${this.baselineY} L ${first.x.toFixed(1)} ${this.baselineY} Z`;
  }
}
