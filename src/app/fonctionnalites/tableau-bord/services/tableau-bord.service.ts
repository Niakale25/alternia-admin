import { Injectable, signal, inject } from '@angular/core';
import { TableauBordRepository, DonneesTableauBordDTO } from '@donnees/repositories/tableau-bord.repository';
import { NotificationService } from '@partage/services/notification.service';
import { ExportService } from '@partage/services/export.service';

@Injectable({
  providedIn: 'root'
})
export class TableauBordService {
  private readonly repository = inject(TableauBordRepository);
  private readonly notificationService = inject(NotificationService);
  private readonly exportService = inject(ExportService);

  readonly donnees = signal<DonneesTableauBordDTO | null>(null);
  readonly chargement = signal<boolean>(false);
  readonly derniereMiseAJour = signal<string>('En attente...');

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
    const d = this.donnees();
    if (!d || !d.kpis || d.kpis.length === 0) {
      this.notificationService.avertissement('Synthèse du tableau de bord non disponible.');
      return;
    }

    const lignes = d.kpis.map(k => ({
      indicateur: k.label || 'N/A',
      valeur: k.valeur ?? '0',
      description: k.sousTexte || '',
      statut: k.badgeLive || 'En direct',
      tendance: `${(k.tendance ?? 0) >= 0 ? '+' : ''}${k.tendance ?? 0}% (${k.tendanceLabel || 'Stable'})`
    }));

    this.exportService.exporterCsv(
      [
        { cle: 'indicateur', entete: 'Indicateur Clé' },
        { cle: 'valeur', entete: 'Valeur Actuelle' },
        { cle: 'description', entete: 'Détail' },
        { cle: 'statut', entete: 'Statut Télémétrie' },
        { cle: 'tendance', entete: 'Évolution' }
      ],
      lignes,
      'rapport_global_synthese_alternia'
    );
  }
}
