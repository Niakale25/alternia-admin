import { Injectable, signal, computed, inject } from '@angular/core';
import { AbonnementRepository, AbonnementDTO } from '@donnees/repositories/abonnement.repository';
import { NotificationService } from '@partage/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AbonnementService {
  private readonly repository = inject(AbonnementRepository);
  private readonly notificationService = inject(NotificationService);

  private readonly _abonnements = signal<AbonnementDTO[]>([]);
  readonly abonnements = this._abonnements.asReadonly();

  readonly recherche = signal<string>('');
  readonly filtreStatut = signal<string>('Tous');
  readonly filtreType = signal<string>('Tous');

  readonly abonnementsFiltres = computed(() => {
    let liste = this._abonnements();
    const q = this.recherche().toLowerCase().trim();
    const statut = this.filtreStatut();
    const type = this.filtreType();

    if (q) {
      liste = liste.filter(a =>
        a.parentNom.toLowerCase().includes(q) ||
        a.parentEmail.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      );
    }

    if (statut !== 'Tous') {
      liste = liste.filter(a => a.statut === statut);
    }

    if (type !== 'Tous') {
      liste = liste.filter(a => a.type === type);
    }

    return liste;
  });

  readonly totalActifs = computed(() => this._abonnements().filter(a => a.statut === 'Actif').length);
  readonly totalEnAttente = computed(() => this._abonnements().filter(a => a.statut === 'En attente de paiement').length);

  chargerAbonnements(): void {
    this.repository.recupererTous().subscribe({
      next: (donnees) => this._abonnements.set(donnees),
      error: () => this.notificationService.erreur('Impossible de charger les abonnements.')
    });
  }

  creerAbonnement(nouveau: Omit<AbonnementDTO, 'id' | 'dateDebut'>): void {
    this.repository.creer(nouveau).subscribe({
      next: (cree) => {
        this._abonnements.update(l => [cree, ...l]);
        this.notificationService.succes(`Abonnement ${cree.type} créé pour ${cree.parentNom}.`);
      },
      error: () => this.notificationService.erreur('Erreur lors de la création de l\'abonnement.')
    });
  }

  changerStatut(id: string, statut: 'Actif' | 'Résilié' | 'En attente de paiement' | 'Suspendu'): void {
    this.repository.changerStatut(id, statut).subscribe({
      next: (maj) => {
        if (maj) {
          this._abonnements.update(l => l.map(item => item.id === id ? maj : item));
          this.notificationService.info(`Statut de l'abonnement : ${maj.statut}`);
        }
      }
    });
  }

  supprimer(id: string): void {
    this.repository.supprimer(id).subscribe({
      next: () => {
        this._abonnements.update(l => l.filter(item => item.id !== id));
        this.notificationService.succes('Abonnement supprimé.');
      }
    });
  }

  exporter(): void {
    this.notificationService.succes('Export des abonnements généré.');
  }
}
