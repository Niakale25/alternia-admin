import { Injectable, signal, computed, inject } from '@angular/core';
import { EtablissementRepository, EtablissementDTO } from '@donnees/repositories/etablissement.repository';
import { NotificationService } from '@partage/services/notification.service';
import { InfoRegionDTO } from '../modeles/etablissement.model';

@Injectable({
  providedIn: 'root'
})
export class EtablissementService {
  private readonly repository = inject(EtablissementRepository);
  private readonly notificationService = inject(NotificationService);

  private readonly _etablissements = signal<EtablissementDTO[]>([]);
  readonly etablissements = this._etablissements.asReadonly();

  readonly recherche = signal<string>('');
  readonly filtreStatut = signal<string>('Tous');
  readonly filtreOffre = signal<string>('Toutes');
  readonly filtreRegion = signal<string>('Toutes');
  readonly pageCourante = signal<number>(0);
  readonly taillePage = signal<number>(10);

  readonly regions = signal<InfoRegionDTO[]>([
    { region: 'District de Bamako', villePhares: 'Bamako', count: 480 },
    { region: 'Sikasso', villePhares: 'Sikasso, Koutiala, Bougouni', count: 210 },
    { region: 'Ségou', villePhares: 'Ségou, San, Markala', count: 175 },
    { region: 'Koulikoro', villePhares: 'Koulikoro, Kati, Kolokani', count: 145 },
    { region: 'Kayes', villePhares: 'Kayes, Kita, Nioro', count: 110 },
    { region: 'Mopti', villePhares: 'Mopti, Sévaré, Djenné', count: 85 },
    { region: 'Gao & Tombouctou', villePhares: 'Gao, Tombouctou', count: 42 }
  ]);

  readonly etablissementsFiltres = computed(() => {
    let liste = this._etablissements();
    const q = this.recherche().toLowerCase().trim();
    const statut = this.filtreStatut();
    const offre = this.filtreOffre();
    const region = this.filtreRegion();

    if (q) {
      liste = liste.filter(e =>
        e.nom.toLowerCase().includes(q) ||
        e.ville.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.directeurEmail.toLowerCase().includes(q)
      );
    }

    if (statut !== 'Tous') {
      liste = liste.filter(e => e.statut === statut);
    }

    if (offre !== 'Toutes') {
      liste = liste.filter(e => e.offre === offre);
    }

    if (region !== 'Toutes') {
      liste = liste.filter(e => e.region === region);
    }

    return liste;
  });

  readonly totalActifs = computed(() => this._etablissements().filter(e => e.statut === 'Actif').length);
  readonly totalEnAttente = computed(() => this._etablissements().filter(e => e.statut === 'En attente').length);
  readonly totalBoitiers = computed(() => this._etablissements().reduce((acc, e) => acc + (e.boitiersCount || 0), 0));
  readonly totalLicences = computed(() => this._etablissements().reduce((acc, e) => acc + (e.licencesCount || 0), 0));

  chargerEtablissements(): void {
    this.repository.recupererTous().subscribe({
      next: (donnees) => this._etablissements.set(donnees),
      error: () => this.notificationService.erreur('Impossible de charger la liste des établissements.')
    });
  }

  creerEtablissement(nouveau: Omit<EtablissementDTO, 'id' | 'dateInscription'>): void {
    this.repository.creer(nouveau).subscribe({
      next: (cree) => {
        this._etablissements.update(l => [cree, ...l]);
        this.notificationService.succes(`L'établissement ${cree.nom} a été créé avec succès.`);
      },
      error: () => this.notificationService.erreur('Erreur lors de la création de l\'établissement.')
    });
  }

  basculerStatut(id: string): void {
    this.repository.changerStatut(id).subscribe({
      next: (maj) => {
        if (maj) {
          this._etablissements.update(l => l.map(e => e.id === id ? maj : e));
          this.notificationService.info(`Statut mis à jour pour l'établissement : ${maj.statut}`);
        }
      }
    });
  }

  supprimer(id: string): void {
    this.repository.supprimer(id).subscribe({
      next: () => {
        this._etablissements.update(l => l.filter(e => e.id !== id));
        this.notificationService.succes('Établissement supprimé avec succès.');
      }
    });
  }
}
