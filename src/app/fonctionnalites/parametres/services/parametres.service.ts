import { Injectable, signal, inject } from '@angular/core';
import { ParametresRepository, ParametresPlateformeDTO } from '@donnees/repositories/parametres.repository';
import { NotificationService } from '@partage/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ParametresService {
  private readonly repository = inject(ParametresRepository);
  private readonly notificationService = inject(NotificationService);

  readonly parametres = signal<ParametresPlateformeDTO | null>(null);
  readonly sectionActive = signal<string>('plateforme');

  readonly sections = [
    {
      id: 'plateforme',
      label: 'Plateforme & Général',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    },
    {
      id: 'securite',
      label: 'Sécurité & Accès',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
    },
    {
      id: 'ia',
      label: 'Paramètres IA & Pédagogie',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 3.4 2.1 6.3 5.1 7.4L9 21h6l-.1-3.6C17.9 16.3 20 13.4 20 10a8 8 0 0 0-8-8z"/></svg>'
    }
  ];

  chargerParametres(): void {
    this.repository.recupererParametres().subscribe({
      next: (params) => this.parametres.set(params),
      error: () => this.notificationService.erreur('Impossible de charger les paramètres.')
    });
  }

  enregistrer(nouveaux: Partial<ParametresPlateformeDTO>): void {
    this.repository.enregistrerParametres(nouveaux).subscribe({
      next: (maj) => {
        this.parametres.set(maj);
        this.notificationService.succes('Paramètres enregistrés avec succès.');
      },
      error: () => this.notificationService.erreur('Erreur lors de la sauvegarde.')
    });
  }
}
