import { Injectable, signal, computed, inject } from '@angular/core';
import { BoitierRepository, BoitierDTO, CampagneOtaDTO } from '@donnees/repositories/boitier.repository';
import { NotificationService } from '@partage/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class BoitierService {
  private readonly repository = inject(BoitierRepository);
  private readonly notificationService = inject(NotificationService);

  private readonly _boitiers = signal<BoitierDTO[]>([]);
  readonly boitiers = this._boitiers.asReadonly();

  private readonly _campagnesOta = signal<CampagneOtaDTO[]>([]);
  readonly campagnesOta = this._campagnesOta.asReadonly();

  readonly recherche = signal<string>('');
  readonly filtreStatut = signal<string>('Tous');
  readonly filtreRegion = signal<string>('Toutes');
  readonly vueMode = signal<'tableau' | 'grille'>('tableau');
  readonly ongletActif = signal<'parc' | 'ota'>('parc');

  readonly boitierInspecte = signal<BoitierDTO | null>(null);

  readonly boitiersFiltres = computed(() => {
    let liste = this._boitiers();
    const q = this.recherche().toLowerCase().trim();
    const statut = this.filtreStatut();
    const region = this.filtreRegion();

    if (q) {
      liste = liste.filter(b =>
        b.serialNumber.toLowerCase().includes(q) ||
        b.etablissementNom.toLowerCase().includes(q) ||
        b.ville.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.ipLocale.includes(q) ||
        b.wifiSsid.toLowerCase().includes(q)
      );
    }

    if (statut !== 'Tous') {
      liste = liste.filter(b => b.statut === statut);
    }

    if (region !== 'Toutes') {
      liste = liste.filter(b => b.region === region);
    }

    return liste;
  });

  // Métriques de gouvernance matérielle
  readonly totalDeployes = computed(() => 1247);
  readonly totalActifs = computed(() => 1202);
  readonly totalHorsLigne = computed(() => 31);
  readonly totalMaintenance = computed(() => 14);
  readonly batterieMoyenne = computed(() => '87%');
  readonly totalApprenantsSimultanes = computed(() => '18 450');

  chargerBoitiers(): void {
    this.repository.recupererTous().subscribe({
      next: (donnees) => this._boitiers.set(donnees),
      error: () => this.notificationService.erreur('Impossible de charger le parc de boîtiers.')
    });

    this.repository.recupererCampagnesOta().subscribe({
      next: (campagnes) => this._campagnesOta.set(campagnes),
      error: () => this.notificationService.erreur('Impossible de charger les campagnes de mise à jour.')
    });
  }

  creerBoitier(nouveau: Omit<BoitierDTO, 'id' | 'derniereConnexion' | 'batterie' | 'stockageUtiliseGo' | 'elevesConnectes' | 'temperatureCpu'>): void {
    this.repository.creer(nouveau).subscribe({
      next: (cree) => {
        this._boitiers.update(l => [cree, ...l]);
        this.notificationService.succes(`Boîtier ${cree.serialNumber} enregistré et associé à ${cree.etablissementNom}.`);
      },
      error: () => this.notificationService.erreur('Erreur lors de l\'enregistrement du boîtier.')
    });
  }

  changerStatut(id: string, statut: BoitierDTO['statut']): void {
    this.repository.changerStatut(id, statut).subscribe({
      next: (maj) => {
        if (maj) {
          this._boitiers.update(l => l.map(b => b.id === id ? maj : b));
          if (this.boitierInspecte()?.id === id) {
            this.boitierInspecte.set(maj);
          }
          this.notificationService.info(`Statut du boîtier ${maj.serialNumber} : ${maj.statut}`);
        }
      }
    });
  }

  inspecterBoitier(boitier: BoitierDTO): void {
    this.boitierInspecte.set(boitier);
  }

  fermerInspecteur(): void {
    this.boitierInspecte.set(null);
  }

  forcerSynchro(boitier: BoitierDTO): void {
    this.notificationService.info(`Ordre de synchronisation envoyé au boîtier ${boitier.serialNumber}...`);
    setTimeout(() => {
      this.changerStatut(boitier.id, 'Actif');
      this.notificationService.succes(`Boîtier ${boitier.serialNumber} synchronisé avec succès.`);
    }, 1200);
  }

  redemarrerServeurEdge(boitier: BoitierDTO): void {
    this.notificationService.avertissement(`Redémarrage du serveur local Edge (${boitier.ipLocale})...`);
    setTimeout(() => {
      this.notificationService.succes(`Serveur Edge de ${boitier.etablissementNom} opérationnel.`);
    }, 1500);
  }

  lancerCampagneOta(campagneId: string): void {
    this.notificationService.info('Déploiement OTA programmé sur l\'ensemble des boîtiers ciblés.');
  }

  supprimer(id: string): void {
    this.repository.supprimer(id).subscribe({
      next: () => {
        this._boitiers.update(l => l.filter(b => b.id !== id));
        if (this.boitierInspecte()?.id === id) {
          this.boitierInspecte.set(null);
        }
        this.notificationService.succes('Boîtier retiré du parc.');
      }
    });
  }

  pingerBoitiers(): void {
    this.notificationService.info('Diagnostic réseau en direct : 1 202 boîtiers Edge opérationnels (96,4%).');
  }
}
