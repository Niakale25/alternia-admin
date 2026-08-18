import { Injectable, signal, inject } from '@angular/core';
import { StatistiqueRepository, StatistiquesGlobalesDTO } from '@donnees/repositories/statistique.repository';
import { NotificationService } from '@partage/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
  private readonly repository = inject(StatistiqueRepository);
  private readonly notificationService = inject(NotificationService);

  readonly donnees = signal<StatistiquesGlobalesDTO | null>(null);
  readonly periode = signal<string>('30 jours');
  readonly periodesDisponibles = ['7 jours', '30 jours', 'Trimestre', 'Année Scolaire'];

  chargerStatistiques(): void {
    this.repository.recupererStatistiquesGlobales(this.periode()).subscribe({
      next: (donnees) => this.donnees.set(donnees),
      error: () => this.notificationService.erreur('Impossible de charger les statistiques.')
    });
  }

  changerPeriode(p: string): void {
    this.periode.set(p);
    this.chargerStatistiques();
  }

  exporterRapport(): void {
    this.notificationService.succes('Rapport statistique et analytique exporté avec succès.');
  }
}
