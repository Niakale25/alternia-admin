import { Injectable, signal, inject } from '@angular/core';
import { StatistiqueRepository, StatistiquesGlobalesDTO } from '@donnees/repositories/statistique.repository';
import { NotificationService } from '@partage/services/notification.service';
import { ExportService } from '@partage/services/export.service';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {
  private readonly repository = inject(StatistiqueRepository);
  private readonly notificationService = inject(NotificationService);
  private readonly exportService = inject(ExportService);

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
    const stats = this.donnees();
    if (!stats || !stats.matieresPlusConsultees || stats.matieresPlusConsultees.length === 0) {
      this.notificationService.avertissement('Aucune donnée statistique disponible pour cette période.');
      return;
    }

    const matieres = stats.matieresPlusConsultees;
    this.exportService.exporterCsv(
      [
        { cle: 'matiere', entete: 'Matière / Discipline' },
        { cle: 'heuresTotal', entete: 'Heures d\'Usage (h)', formater: (val) => `${val || 0} h` },
        { cle: 'pourcentage', entete: 'Part d\'Utilisation (%)', formater: (val) => `${val || 0}%` },
        { cle: 'croissance', entete: 'Progression (%)', formater: (val) => `${val >= 0 ? '+' : ''}${val || 0}%` }
      ],
      matieres,
      `rapport_statistiques_${this.periode()}`
    );
  }
}
