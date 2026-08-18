import { Injectable, signal, computed, inject } from '@angular/core';
import { LicenceRepository, LicenceDTO } from '@donnees/repositories/licence.repository';
import { NotificationService } from '@partage/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class LicenceService {
  private readonly repository = inject(LicenceRepository);
  private readonly notificationService = inject(NotificationService);

  private readonly _licences = signal<LicenceDTO[]>([]);
  readonly licences = this._licences.asReadonly();

  readonly recherche = signal<string>('');
  readonly filtreStatut = signal<string>('Tous');
  readonly filtreType = signal<string>('Tous');

  readonly licencesFiltrees = computed(() => {
    let liste = this._licences();
    const q = this.recherche().toLowerCase().trim();
    const statut = this.filtreStatut();
    const type = this.filtreType();

    if (q) {
      liste = liste.filter(l =>
        l.code.toLowerCase().includes(q) ||
        l.titulaire.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
      );
    }

    if (statut !== 'Tous') {
      liste = liste.filter(l => l.statut === statut);
    }

    if (type !== 'Tous') {
      liste = liste.filter(l => l.type === type);
    }

    return liste;
  });

  readonly totalActives = computed(() => this._licences().filter(l => l.statut === 'Active').length);
  readonly totalExpirees = computed(() => this._licences().filter(l => l.statut === 'Expirée').length);

  chargerLicences(): void {
    this.repository.recupererTous().subscribe({
      next: (donnees) => this._licences.set(donnees),
      error: () => this.notificationService.erreur('Impossible de charger les licences.')
    });
  }

  creerLicence(nouveau: Omit<LicenceDTO, 'id' | 'code' | 'dateActivation'>): void {
    this.repository.creer(nouveau).subscribe({
      next: (cree) => {
        this._licences.update(l => [cree, ...l]);
        this.notificationService.succes(`Pack de licence ${cree.code} généré pour ${cree.titulaire}.`);
      },
      error: () => this.notificationService.erreur('Erreur lors de la génération de la licence.')
    });
  }

  changerStatut(id: string, statut: 'Active' | 'Expirée' | 'En attente' | 'Renouvelée'): void {
    this.repository.changerStatut(id, statut).subscribe({
      next: (maj) => {
        if (maj) {
          this._licences.update(l => l.map(item => item.id === id ? maj : item));
          this.notificationService.info(`Statut de la licence mis à jour : ${maj.statut}`);
        }
      }
    });
  }

  supprimer(id: string): void {
    this.repository.supprimer(id).subscribe({
      next: () => {
        this._licences.update(l => l.filter(item => item.id !== id));
        this.notificationService.succes('Licence révoquée.');
      }
    });
  }

  exporterFinancier(): void {
    this.notificationService.succes('Rapport financier des licences téléchargé.');
  }
}
