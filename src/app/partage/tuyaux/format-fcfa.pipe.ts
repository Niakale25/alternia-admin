import { Pipe, PipeTransform } from '@angular/core';

/**
 * Tuyau de formatage pour les montants en Franc CFA (XOF / FCFA).
 */
@Pipe({
  name: 'formatFcfa',
  standalone: true
})
export class FormatFcfaPipe implements PipeTransform {
  transform(montant: number | string | null | undefined, suffixe: boolean = true): string {
    if (montant === null || montant === undefined || isNaN(Number(montant))) {
      return suffixe ? '0 FCFA' : '0';
    }

    const num = Number(montant);
    const formatee = new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0
    }).format(num);

    return suffixe ? `${formatee} FCFA` : formatee;
  }
}
