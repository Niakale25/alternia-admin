import { Injectable, signal, computed, inject } from '@angular/core';
import { ClientApiService } from '@donnees/services/client-api.service';

export type TypeNotification = 'succes' | 'erreur' | 'info' | 'avertissement';
export type CategorieNotification = 'hardware' | 'gouvernance' | 'business' | 'ia' | 'systeme';

export interface NotificationDTO {
  id: string;
  type: TypeNotification;
  categorie: CategorieNotification;
  titre: string;
  message: string;
  date: string;
  heure: string;
  lu: boolean;
  source: string;
  lienRoute?: string;
  lienLabel?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly clientApi = inject(ClientApiService);
  private readonly _notifications = signal<NotificationDTO[]>([]);
  readonly notifications = this._notifications.asReadonly();

  constructor() {
    this.chargerNotifications();
  }

  chargerNotifications(): void {
    this.clientApi.get<NotificationDTO[]>('/notifications').subscribe({
      next: (donnees) => {
        this._notifications.set(donnees || []);
      },
      error: () => {
        this._notifications.set([]);
      }
    });
  }

  readonly filtreCategorie = signal<CategorieNotification | 'toutes'>('toutes');
  readonly filtreStatut = signal<'toutes' | 'non-lues' | 'lues'>('toutes');
  readonly filtreType = signal<TypeNotification | 'tous'>('tous');
  readonly recherche = signal<string>('');

  readonly totalNonLues = computed(() =>
    this._notifications().filter(n => !n.lu).length
  );

  readonly notificationsFiltrees = computed(() => {
    let list = this._notifications();
    const cat = this.filtreCategorie();
    const stat = this.filtreStatut();
    const type = this.filtreType();
    const q = this.recherche().toLowerCase().trim();

    if (cat !== 'toutes') {
      list = list.filter(n => n.categorie === cat);
    }

    if (stat === 'non-lues') {
      list = list.filter(n => !n.lu);
    } else if (stat === 'lues') {
      list = list.filter(n => n.lu);
    }

    if (type !== 'tous') {
      list = list.filter(n => n.type === type);
    }

    if (q) {
      list = list.filter(n =>
        n.titre.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.source.toLowerCase().includes(q)
      );
    }

    return list;
  });

  enregistrer(
    message: string,
    type: TypeNotification = 'info',
    titre: string = 'Notification',
    categorie: CategorieNotification = 'systeme',
    lienRoute?: string,
    lienLabel?: string
  ): void {
    const dateNow = new Date();
    const nouvelle: NotificationDTO = {
      id: `NOTIF-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type,
      categorie,
      titre,
      message,
      date: 'À l\'instant',
      heure: dateNow.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      lu: false,
      source: 'Système AlternIA',
      lienRoute,
      lienLabel
    };

    this._notifications.update(liste => [nouvelle, ...liste]);
  }

  succes(message: string, titre: string = 'Succès', categorie: CategorieNotification = 'systeme', lienRoute?: string, lienLabel?: string): void {
    this.enregistrer(message, 'succes', titre, categorie, lienRoute, lienLabel);
  }

  erreur(message: string, titre: string = 'Erreur', categorie: CategorieNotification = 'systeme', lienRoute?: string, lienLabel?: string): void {
    this.enregistrer(message, 'erreur', titre, categorie, lienRoute, lienLabel);
  }

  info(message: string, titre: string = 'Information', categorie: CategorieNotification = 'systeme', lienRoute?: string, lienLabel?: string): void {
    this.enregistrer(message, 'info', titre, categorie, lienRoute, lienLabel);
  }

  avertissement(message: string, titre: string = 'Attention', categorie: CategorieNotification = 'systeme', lienRoute?: string, lienLabel?: string): void {
    this.enregistrer(message, 'avertissement', titre, categorie, lienRoute, lienLabel);
  }

  marquerCommeLu(id: string): void {
    this._notifications.update(liste =>
      liste.map(n => n.id === id ? { ...n, lu: true } : n)
    );
    this.clientApi.patch(`/notifications/${id}/lu`, {}).subscribe({ error: () => {} });
  }

  marquerToutCommeLu(): void {
    this._notifications.update(liste =>
      liste.map(n => ({ ...n, lu: true }))
    );
    this.clientApi.patch('/notifications/marquer-tout-lu', {}).subscribe({ error: () => {} });
  }

  supprimer(id: string): void {
    this._notifications.update(liste => liste.filter(n => n.id !== id));
    this.clientApi.delete(`/notifications/${id}`).subscribe({ error: () => {} });
  }

  fermer(id: string): void {
    this.supprimer(id);
  }

  viderHistorique(): void {
    this._notifications.set([]);
  }
}

