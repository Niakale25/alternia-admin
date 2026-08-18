import { Pipe, PipeTransform } from '@angular/core';

/**
 * Tuyau de formatage de date en français (ex: "Il y a 5 min", "Aujourd'hui à 14:30").
 */
@Pipe({
  name: 'dateRelative',
  standalone: true
})
export class DateRelativePipe implements PipeTransform {
  transform(valeur: string | Date | null | undefined): string {
    if (!valeur) return '—';
    return String(valeur);
  }
}
