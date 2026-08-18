import { Injectable, signal, inject } from '@angular/core';
import { TableauBordRepository, DonneesTableauBordDTO } from '@donnees/repositories/tableau-bord.repository';
import { NotificationService } from '@partage/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class TableauBordService {
  private readonly repository = inject(TableauBordRepository);
  private readonly notificationService = inject(NotificationService);

  readonly donnees = signal<DonneesTableauBordDTO | null>(null);
  readonly chargement = signal<boolean>(false);
  readonly derniereMiseAJour = signal<string>('13 août 2026 - 10h34');

  chargerDonnees(): void {
    this.chargement.set(true);
    this.repository.recupererDonnees().subscribe({
      next: (resultat) => {
        this.donnees.set(resultat);
        this.derniereMiseAJour.set(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' - Actualisé');
        this.chargement.set(false);
      },
      error: () => {
        this.chargement.set(false);
        this.notificationService.erreur('Impossible de charger les donnees du tableau de bord.');
      }
    });
  }

  telechargerRapport(): void {
    this.notificationService.succes('Le rapport d\'activité de l\'écosystème Alternia est prêt au téléchargement.');
  }
}
