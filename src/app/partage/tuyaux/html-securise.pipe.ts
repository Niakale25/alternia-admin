import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Tuyau sécurisé pour injecter des SVG ou du code HTML de confiance.
 */
@Pipe({
  name: 'htmlSecurise',
  standalone: true
})
export class HtmlSecurisePipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value) {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
