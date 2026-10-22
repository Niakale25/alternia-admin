import { Injectable, signal, computed, inject } from '@angular/core';
import { ClientApiService } from '@donnees/services/client-api.service';
import {
  ContenuCulturelDTO,
  CultureContributionDTO,
  RegionCode,
  RegionMalienne,
  StatistiquesCultureDTO,
  TamponPasseportDTO,
  NiveauExplorateurDTO,
  TypeContenuCulturel
} from '../modeles/culture.modele';
import { REGIONS_MALI } from './regions-mali.const';

@Injectable({
  providedIn: 'root'
})
export class CultureService {
  // ── État principal ───────────────────────────────────────────────
  private readonly _contenus = signal<ContenuCulturelDTO[]>([]);
  readonly contenus = this._contenus.asReadonly();

  readonly regions = signal<RegionMalienne[]>(REGIONS_MALI);

  readonly tamponsPasseport = signal<TamponPasseportDTO[]>([]);
  readonly niveauxExplorateur = signal<NiveauExplorateurDTO[]>([]);
  readonly sousOngletActif = signal<'cms' | 'passeport' | 'moderation'>('cms');

  // ── Contributions Citoyennes & Modération ────────────────────────
  private readonly _contributions = signal<CultureContributionDTO[]>([]);
  readonly contributions = this._contributions.asReadonly();

  readonly contributionsEnAttente = computed(() =>
    this._contributions().filter(c => c.statut === 'EN_ATTENTE')
  );

  readonly totalContributionsEnAttente = computed(() =>
    this.contributionsEnAttente().length
  );

  private readonly clientApi = inject(ClientApiService);

  constructor() {
    this.chargerContenusDepuisApi();
  }

  chargerContenusDepuisApi(): void {
    this.chargement.set(true);
    this.clientApi.get<ContenuCulturelDTO[]>('/culture').subscribe({
      next: (donnees) => {
        this._contenus.set(donnees || []);
        this.chargement.set(false);
      },
      error: () => {
        this._contenus.set([]);
        this.chargement.set(false);
      }
    });

    this.clientApi.get<TamponPasseportDTO[]>('/culture/tampons').subscribe({
      next: (tampons) => {
        this.tamponsPasseport.set(tampons || []);
      },
      error: () => {
        this.tamponsPasseport.set([]);
      }
    });

    this.clientApi.get<NiveauExplorateurDTO[]>('/culture/niveaux').subscribe({
      next: (niveaux) => {
        this.niveauxExplorateur.set(niveaux || []);
      },
      error: () => {
        this.niveauxExplorateur.set([]);
      }
    });

    this.chargerContributions();
  }

  chargerContributions(): void {
    this.clientApi.get<CultureContributionDTO[]>('/culture/contributions').subscribe({
      next: (donnees) => {
        const items = Array.isArray(donnees) ? donnees : ((donnees as any)?.items || []);
        this._contributions.set(items);
      },
      error: () => {
        this._contributions.set([]);
      }
    });
  }

  modererContribution(id: string, decision: 'APPROUVE' | 'REJETE', motif?: string): void {
    const adminInfo = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('alternia_admin_info') || '{}') : {};
    const adminId = adminInfo.id || 'usr-super-admin';

    this.clientApi.post<CultureContributionDTO>(`/culture/contributions/${id}/decision`, {
      decision,
      motif: motif || (decision === 'APPROUVE' ? 'Validé par le Super Admin' : 'Non retenu pour le catalogue officiel'),
      admin_id: adminId
    }).subscribe({
      next: (res) => {
        this._contributions.update(list =>
          list.map(c => c.id === id ? { ...c, statut: decision, motifModeration: motif, dateModeration: new Date().toISOString() } : c)
        );
        if (decision === 'APPROUVE') {
          this.clientApi.get<ContenuCulturelDTO[]>('/culture').subscribe({
            next: (data) => this._contenus.set(data || [])
          });
        }
      },
      error: () => {
        this._contributions.update(list =>
          list.map(c => c.id === id ? { ...c, statut: decision, motifModeration: motif, dateModeration: new Date().toISOString() } : c)
        );
      }
    });
  }

  // ── Filtres réactifs ─────────────────────────────────────────────
  readonly filtreType = signal<TypeContenuCulturel | 'tous'>('tous');
  readonly filtreRegion = signal<RegionCode>('all');
  readonly filtreRecherche = signal<string>('');
  readonly filtreStatut = signal<'tous' | 'publie' | 'brouillon'>('tous');

  // ── État UI & Tiroir Détail ──────────────────────────────────────
  readonly chargement = signal<boolean>(false);
  readonly tiroirDetailOuvert = signal<boolean>(false);
  readonly elementEnDetail = signal<ContenuCulturelDTO | null>(null);

  // ── Contenus Filtrés (Computed) ──────────────────────────────────
  readonly contenusFiltres = computed(() => {
    const list = this._contenus();
    const type = this.filtreType();
    const region = this.filtreRegion();
    const recherche = this.filtreRecherche().trim().toLowerCase();
    const statut = this.filtreStatut();

    return list.filter(item => {
      // Filtre par type
      if (type !== 'tous' && item.type !== type) {
        return false;
      }

      // Filtre par région
      if (region !== 'all' && item.regionId !== region) {
        return false;
      }

      // Filtre par statut
      if (statut === 'publie' && !item.publie) return false;
      if (statut === 'brouillon' && item.publie) return false;

      // Filtre textuel
      if (recherche) {
        const nomOuTitre = ('nom' in item ? item.nom : 'titre' in item ? item.titre : 'question' in item ? item.question : 'titreHistoire' in item ? item.titreHistoire : '').toLowerCase();
        const tag = ('tag' in item ? item.tag : 'categorie' in item ? item.categorie : '').toLowerCase();
        const regionNom = item.regionNom.toLowerCase();
        const resume = ('resume' in item ? item.resume : 'explicationCulturelle' in item ? item.explicationCulturelle : 'extrait' in item ? item.extrait : '').toLowerCase();

        return (
          nomOuTitre.includes(recherche) ||
          tag.includes(recherche) ||
          regionNom.includes(recherche) ||
          resume.includes(recherche)
        );
      }

      return true;
    });
  });

  // ── Statistiques Réactives (Computed) ────────────────────────────
  readonly statistiques = computed<StatistiquesCultureDTO>(() => {
    const list = this._contenus();
    const total = list.length;
    const figures = list.filter(i => i.type === 'figure').length;
    const monuments = list.filter(i => i.type === 'monument').length;
    const villes = list.filter(i => i.type === 'ville').length;
    const contes = list.filter(i => i.type === 'conte').length;
    const devinettes = list.filter(i => i.type === 'devinette').length;
    const quiz = list.filter(i => i.type === 'quiz').length;
    const temoignages = list.filter(i => i.type === 'temoignage').length;

    const regionsContenus = list.map(i => i.regionId);
    const regionsTampons = this.tamponsPasseport().map(t => t.regionId);
    const regionsCouvertes = new Set([...regionsContenus, ...regionsTampons]).size || 1;

    const publies = list.filter(i => i.publie).length;
    const tauxPublication = total > 0 ? Math.round((publies / total) * 100) : 0;

    const totalTampons = this.tamponsPasseport().reduce((acc, t) => acc + (t.totalDebloquesParEleves || 0), 0);
    const totalXp = this.tamponsPasseport().reduce((acc, t) => acc + ((t.xpRecompense || 0) * (t.totalDebloquesParEleves || 0)), 0);
    const xpTotalDistribue = totalXp >= 1_000_000
      ? `${(totalXp / 1_000_000).toFixed(1)} M XP`
      : `${totalXp.toLocaleString('fr-FR')} XP`;

    return {
      totalContenus: total,
      totalFigures: figures,
      totalMonuments: monuments,
      totalVilles: villes,
      totalContenusContes: contes,
      totalDevinettes: devinettes,
      totalQuiz: quiz,
      totalTemoignages: temoignages,
      regionsCouvertes,
      tauxPublication,
      totalTamponsDebloques: totalTampons,
      xpTotalDistribue
    };
  });

  basculerActifTampon(id: string): void {
    this.tamponsPasseport.update(list =>
      list.map(t => t.id === id ? { ...t, actif: !t.actif } : t)
    );
    this.clientApi.patch(`/culture/tampons/${id}/actif`, {}).subscribe({ error: () => {} });
  }

  // ── Compteurs par type (Computed) ────────────────────────────────
  readonly compteursParType = computed(() => {
    const list = this._contenus();
    return {
      tous: list.length,
      figure: list.filter(i => i.type === 'figure').length,
      monument: list.filter(i => i.type === 'monument').length,
      ville: list.filter(i => i.type === 'ville').length,
      conte: list.filter(i => i.type === 'conte').length,
      devinette: list.filter(i => i.type === 'devinette').length,
      quiz: list.filter(i => i.type === 'quiz').length,
      temoignage: list.filter(i => i.type === 'temoignage').length
    };
  });

  // ── Méthodes CRUD ────────────────────────────────────────────────

  ajouterContenu(nouveau: ContenuCulturelDTO): void {
    const itemAvecDates: ContenuCulturelDTO = {
      ...nouveau,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString()
    } as ContenuCulturelDTO;

    this._contenus.update(actuels => [itemAvecDates, ...actuels]);
    this.clientApi.post('/culture', itemAvecDates).subscribe({ error: () => {} });
  }

  mettreAJourContenu(contenuMisAJour: ContenuCulturelDTO): void {
    const avecDate = {
      ...contenuMisAJour,
      dateModification: new Date().toISOString()
    } as ContenuCulturelDTO;

    this._contenus.update(actuels =>
      actuels.map(item => (item.id === avecDate.id ? avecDate : item))
    );

    if (this.elementEnDetail()?.id === avecDate.id) {
      this.elementEnDetail.set(avecDate);
    }
    this.clientApi.put(`/culture/${avecDate.id}`, avecDate).subscribe({ error: () => {} });
  }

  supprimerContenu(id: string): void {
    this._contenus.update(actuels => actuels.filter(item => item.id !== id));
    if (this.elementEnDetail()?.id === id) {
      this.fermerDetail();
    }
    this.clientApi.delete(`/culture/${id}`).subscribe({ error: () => {} });
  }

  dupliquerContenu(id: string): void {
    const original = this._contenus().find(i => i.id === id);
    if (!original) return;

    const copie: ContenuCulturelDTO = {
      ...JSON.parse(JSON.stringify(original)),
      id: `copie-${Date.now()}`,
      publie: false,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString()
    };

    if ('nom' in copie) {
      copie.nom = `${copie.nom} (Copie)`;
    } else if ('titre' in copie) {
      copie.titre = `${copie.titre} (Copie)`;
    } else if ('question' in copie) {
      copie.question = `${copie.question} (Copie)`;
    } else if ('titreHistoire' in copie) {
      copie.titreHistoire = `${copie.titreHistoire} (Copie)`;
    }

    this._contenus.update(actuels => [copie, ...actuels]);
    this.clientApi.post('/culture', copie).subscribe({ error: () => {} });
  }

  basculerPublication(id: string): void {
    this._contenus.update(actuels =>
      actuels.map(item => {
        if (item.id === id) {
          const modifie = {
            ...item,
            publie: !item.publie,
            dateModification: new Date().toISOString()
          } as ContenuCulturelDTO;

          if (this.elementEnDetail()?.id === id) {
            this.elementEnDetail.set(modifie);
          }

          return modifie;
        }
        return item;
      })
    );
    this.clientApi.patch(`/culture/${id}/statut`, {}).subscribe({ error: () => {} });
  }

  // ── Gestion du Tiroir Détail ─────────────────────────────────────
  ouvrirDetail(contenu: ContenuCulturelDTO): void {
    this.elementEnDetail.set(contenu);
    this.tiroirDetailOuvert.set(true);
  }

  fermerDetail(): void {
    this.tiroirDetailOuvert.set(false);
    this.elementEnDetail.set(null);
  }

  reinitialiserFiltres(): void {
    this.filtreType.set('tous');
    this.filtreRegion.set('all');
    this.filtreRecherche.set('');
    this.filtreStatut.set('tous');
  }

  getRegionInfo(code: RegionCode): RegionMalienne | undefined {
    return this.regions().find(r => r.id === code);
  }
}
