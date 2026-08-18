import { Injectable, signal } from '@angular/core';

export type TypeNotification = 'succes' | 'erreur' | 'info' | 'avertissement';

export interface NotificationItem {
  id: string;
  type: TypeNotification;
  titre?: string;
  message: string;
  dureeMs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _notifications = signal<NotificationItem[]>([]);
  readonly notifications = this._notifications.asReadonly();

  afficher(message: string, type: TypeNotification = 'info', titre?: string, dureeMs: number = 4000): void {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const notification: NotificationItem = { id, type, titre, message, dureeMs };

    this._notifications.update(liste => [...liste, notification]);

    if (dureeMs > 0) {
      setTimeout(() => {
        this.fermer(id);
      }, dureeMs);
    }
  }

  succes(message: string, titre: string = 'Succès'): void {
    this.afficher(message, 'succes', titre);
  }

  erreur(message: string, titre: string = 'Erreur'): void {
    this.afficher(message, 'erreur', titre);
  }

  info(message: string, titre: string = 'Information'): void {
    this.afficher(message, 'info', titre);
  }

  avertissement(message: string, titre: string = 'Attention'): void {
    this.afficher(message, 'avertissement', titre);
  }

  fermer(id: string): void {
    this._notifications.update(liste => liste.filter(n => n.id !== id));
  }
}
