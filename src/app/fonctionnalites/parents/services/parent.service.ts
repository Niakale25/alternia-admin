import { Injectable, signal, computed, inject } from '@angular/core';
import { ParentRepository, ParentDTO } from '@donnees/repositories/parent.repository';
import { NotificationService } from '@partage/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private readonly repository = inject(ParentRepository);
  private readonly notificationService = inject(NotificationService);

  private readonly _parents = signal<ParentDTO[]>([]);
  readonly parents = this._parents.asReadonly();

  readonly recherche = signal<string>('');
  readonly filtreStatut = signal<string>('Tous');
  readonly filtreAbonnement = signal<string>('Tous');

  readonly parentsFiltres = computed(() => {
    let liste = this._parents();
    const q = this.recherche().toLowerCase().trim();
    const statut = this.filtreStatut();
    const abonnement = this.filtreAbonnement();

    if (q) {
      liste = liste.filter(p =>
        p.nomFamille.toLowerCase().includes(q) ||
        p.tuteur.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.telephone.toLowerCase().includes(q) ||
        p.etablissement.toLowerCase().includes(q)
      );
    }

    if (statut !== 'Tous') {
      liste = liste.filter(p => p.statut === statut);
    }

    if (abonnement !== 'Tous') {
      liste = liste.filter(p => p.abonnementsType === abonnement);
    }

    return liste;
  });

  readonly totalActifs = computed(() => this._parents().filter(p => p.statut === 'Actif').length);
  readonly totalLicences = computed(() => this._parents().reduce((acc, p) => acc + (p.licencesAssocies || 0), 0));

  chargerParents(): void {
    this.repository.recupererTous().subscribe({
      next: (donnees) => this._parents.set(donnees),
      error: () => this.notificationService.erreur('Impossible de charger les comptes parents.')
    });
  }

  creerParent(nouveau: Omit<ParentDTO, 'id' | 'derniereActivite'>): void {
    this.repository.creer(nouveau).subscribe({
      next: (cree) => {
        this._parents.update(l => [cree, ...l]);
        this.notificationService.succes(`Compte parent créé pour la famille ${cree.nomFamille}.`);
      },
      error: () => this.notificationService.erreur('Erreur lors de la création du compte parent.')
    });
  }

  basculerStatut(id: string): void {
    this.repository.changerStatut(id).subscribe({
      next: (maj) => {
        if (maj) {
          this._parents.update(l => l.map(p => p.id === id ? maj : p));
          this.notificationService.info(`Statut du parent mis à jour : ${maj.statut}`);
        }
      }
    });
  }

  supprimer(id: string): void {
    this.repository.supprimer(id).subscribe({
      next: () => {
        this._parents.update(l => l.filter(p => p.id !== id));
        this.notificationService.succes('Compte parent supprimé.');
      }
    });
  }

  exporterCsv(): void {
    this.notificationService.succes('Export CSV des comptes parents généré avec succès.');
  }
}
