import { Injectable, signal, computed, inject } from '@angular/core';
import {
  PedagogieIaRepository,
  AvatarPedagogiqueDTO
} from '@donnees/repositories/pedagogie-ia.repository';
import { NotificationService } from '@partage/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class PedagogieIaService {
  private readonly repository = inject(PedagogieIaRepository);
  private readonly notificationService = inject(NotificationService);

  private readonly _avatars = signal<AvatarPedagogiqueDTO[]>([]);
  readonly avatars = this._avatars.asReadonly();

  readonly kpis = signal({
    totalRequetesIa: '148 900',
    tempsMoyenReponseEdge: '142 ms',
    avatarsActifs: 4,
    voixTtsDisponibles: 4
  });

  readonly voixEnLecture = signal<string | null>(null);
  readonly avatarEnEdition = signal<AvatarPedagogiqueDTO | null>(null);
  readonly modalAvatarOuvert = signal<boolean>(false);
  readonly avatarEnTestLive = signal<AvatarPedagogiqueDTO | null>(null);
  readonly cleApiSimliDefaut = signal<string>('simli_live_livekit_cnce_edtech_99a8b');

  // Filtres Studio Avatars
  readonly rechercheAvatars = signal<string>('');
  readonly filtreMatiereAvatars = signal<string>('Toutes');

  readonly avatarsFiltres = computed(() => {
    let list = this._avatars();
    const q = this.rechercheAvatars().toLowerCase().trim();
    const mat = this.filtreMatiereAvatars();

    if (q) {
      list = list.filter(a =>
        a.nom.toLowerCase().includes(q) ||
        a.matiere.toLowerCase().includes(q) ||
        a.stylePedagogique.toLowerCase().includes(q) ||
        a.voixTts.toLowerCase().includes(q)
      );
    }

    if (mat !== 'Toutes') {
      list = list.filter(a => a.matiere.toLowerCase().includes(mat.toLowerCase()));
    }

    return list;
  });

  chargerDonnees(): void {
    this.repository.recupererDonnees().subscribe({
      next: (data) => {
        this._avatars.set(data.avatars);
        this.kpis.set(data.kpis);
      },
      error: () => this.notificationService.erreur('Impossible de charger les données du Studio IA.')
    });
  }

  lireExtraitVocal(id: string, texte: string, nom?: string): void {
    if (this.voixEnLecture() === id) {
      this.arreterLectureVocale();
      return;
    }

    this.voixEnLecture.set(id);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texte);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.95;
      utterance.pitch = nom === 'Vivienne' ? 1.1 : (nom === 'Kadiatou' ? 1.05 : 0.9);

      utterance.onend = () => this.voixEnLecture.set(null);
      utterance.onerror = () => this.voixEnLecture.set(null);

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        if (this.voixEnLecture() === id) {
          this.voixEnLecture.set(null);
        }
      }, 4000);
    }
  }

  arreterLectureVocale(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.voixEnLecture.set(null);
  }

  ouvrirCreationAvatar(): void {
    this.avatarEnEdition.set(null);
    this.modalAvatarOuvert.set(true);
  }

  ouvrirEditionAvatar(avatar: AvatarPedagogiqueDTO): void {
    this.avatarEnEdition.set({ ...avatar });
    this.modalAvatarOuvert.set(true);
  }

  fermerModalAvatar(): void {
    this.modalAvatarOuvert.set(false);
    this.avatarEnEdition.set(null);
  }

  ouvrirTestStreamSimli(avatar: AvatarPedagogiqueDTO): void {
    this.avatarEnTestLive.set({ ...avatar });
  }

  fermerTestStreamSimli(): void {
    this.avatarEnTestLive.set(null);
    this.arreterLectureVocale();
  }

  sauvegarderAvatar(avatarData: Omit<AvatarPedagogiqueDTO, 'id'>): void {
    const existant = this.avatarEnEdition();
    if (existant) {
      this.repository.modifierAvatar(existant.id, avatarData).subscribe({
        next: (maj) => {
          if (maj) {
            this._avatars.update(list => list.map(a => a.id === existant.id ? maj : a));
            this.kpis.update(k => ({ ...k, avatarsActifs: this._avatars().filter(a => a.actif).length }));
            this.notificationService.succes(`Avatar ${maj.nom} mis à jour avec succès.`);
          }
          this.fermerModalAvatar();
        }
      });
    } else {
      this.repository.creerAvatar(avatarData).subscribe({
        next: (cree) => {
          this._avatars.update(list => [...list, cree]);
          this.kpis.update(k => ({ ...k, avatarsActifs: this._avatars().filter(a => a.actif).length }));
          this.notificationService.succes(`Avatar ${cree.nom} créé et configuré.`);
          this.fermerModalAvatar();
        }
      });
    }
  }

  basculerActifAvatar(avatar: AvatarPedagogiqueDTO): void {
    const nouvelEtat = !avatar.actif;
    this.repository.modifierAvatar(avatar.id, { actif: nouvelEtat }).subscribe({
      next: (maj) => {
        if (maj) {
          this._avatars.update(list => list.map(a => a.id === avatar.id ? maj : a));
          this.kpis.update(k => ({ ...k, avatarsActifs: this._avatars().filter(a => a.actif).length }));
          this.notificationService.info(`Avatar ${maj.nom} ${nouvelEtat ? 'activé' : 'désactivé'}.`);
        }
      }
    });
  }

  definirAvatarParDefaut(avatar: AvatarPedagogiqueDTO): void {
    this._avatars.update(list =>
      list.map(a => ({
        ...a,
        parDefaut: a.id === avatar.id
      }))
    );
    this.notificationService.succes(`${avatar.nom} est maintenant l'enseignant IA par défaut.`);
  }

  supprimerAvatar(id: string): void {
    const avatar = this._avatars().find(a => a.id === id);
    this.repository.supprimerAvatar(id).subscribe({
      next: () => {
        this._avatars.update(list => list.filter(a => a.id !== id));
        this.kpis.update(k => ({ ...k, avatarsActifs: this._avatars().filter(a => a.actif).length }));
        this.notificationService.succes(`Enseignant IA ${avatar?.nom || ''} retiré.`);
      }
    });
  }
}
