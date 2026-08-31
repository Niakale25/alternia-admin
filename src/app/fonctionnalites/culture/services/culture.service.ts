import { Injectable, signal, computed } from '@angular/core';
import {
  ContenuCulturelDTO,
  RegionCode,
  RegionMalienne,
  StatistiquesCultureDTO,
  TypeContenuCulturel
} from '../modeles/culture.modele';
import { CONTENUS_CULTURELS_INITIAUX, REGIONS_MALI } from './culture-donnees.mock';

@Injectable({
  providedIn: 'root'
})
export class CultureService {
  // ── État principal ───────────────────────────────────────────────
  private readonly _contenus = signal<ContenuCulturelDTO[]>(CONTENUS_CULTURELS_INITIAUX);
  readonly contenus = this._contenus.asReadonly();

  readonly regions = signal<RegionMalienne[]>(REGIONS_MALI);

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

    const regionsUniques = new Set(list.map(i => i.regionId)).size;
    const publies = list.filter(i => i.publie).length;
    const tauxPublication = total > 0 ? Math.round((publies / total) * 100) : 0;

    return {
      totalContenus: total,
      totalFigures: figures,
      totalMonuments: monuments,
      totalVilles: villes,
      totalContenusContes: contes,
      totalDevinettes: devinettes,
      totalQuiz: quiz,
      totalTemoignages: temoignages,
      regionsCouvertes: regionsUniques,
      tauxPublication
    };
  });

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
  }

  supprimerContenu(id: string): void {
    this._contenus.update(actuels => actuels.filter(item => item.id !== id));
    if (this.elementEnDetail()?.id === id) {
      this.fermerDetail();
    }
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
