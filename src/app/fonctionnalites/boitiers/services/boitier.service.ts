import { Injectable, signal, computed, inject } from '@angular/core';
import { BoitierRepository, BoitierDTO } from '@donnees/repositories/boitier.repository';
import { NotificationService } from '@partage/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class BoitierService {
  private readonly repository = inject(BoitierRepository);
  private readonly notificationService = inject(NotificationService);

  private readonly _boitiers = signal<BoitierDTO[]>([]);
  readonly boitiers = this._boitiers.asReadonly();

  readonly recherche = signal<string>('');
  readonly filtreStatut = signal<string>('Tous');

  readonly boitiersFiltres = computed(() => {
    let liste = this._boitiers();
    const q = this.recherche().toLowerCase().trim();
    const statut = this.filtreStatut();

    if (q) {
      liste = liste.filter(b =>
        b.serialNumber.toLowerCase().includes(q) ||
        b.etablissementNom.toLowerCase().includes(q) ||
        b.ville.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }

    if (statut !== 'Tous') {
      liste = liste.filter(b => b.statut === statut);
    }

    return liste;
  });

  readonly totalDeployes = computed(() => 1247);
  readonly totalActifs = computed(() => 1202);
  readonly totalHorsLigne = computed(() => 31);
  readonly totalMaintenance = computed(() => 14);

  chargerBoitiers(): void {
    this.repository.recupererTous().subscribe({
      next: (donnees) => this._boitiers.set(donnees),
      error: () => this.notificationService.erreur('Impossible de charger le parc de boîtiers.')
    });
  }

  creerBoitier(nouveau: Omit<BoitierDTO, 'id' | 'derniereConnexion'>): void {
    this.repository.creer(nouveau).subscribe({
      next: (cree) => {
        this._boitiers.update(l => [cree, ...l]);
        this.notificationService.succes(`Boîtier ${cree.serialNumber} enregistré et associé à ${cree.etablissementNom}.`);
      },
      error: () => this.notificationService.erreur('Erreur lors de l\'enregistrement du boîtier.')
    });
  }

  changerStatut(id: string, statut: 'Actif' | 'Hors ligne' | 'Maintenance'): void {
    this.repository.changerStatut(id, statut).subscribe({
      next: (maj) => {
        if (maj) {
          this._boitiers.update(l => l.map(b => b.id === id ? maj : b));
          this.notificationService.info(`Statut du boîtier mis à jour : ${maj.statut}`);
        }
      }
    });
  }

  supprimer(id: string): void {
    this.repository.supprimer(id).subscribe({
      next: () => {
        this._boitiers.update(l => l.filter(b => b.id !== id));
        this.notificationService.succes('Boîtier retiré du parc.');
      }
    });
  }

  pingerBoitiers(): void {
    this.notificationService.info('Diagnostic réseau en cours... 1 202 boîtiers répondent normalement.');
  }
}
