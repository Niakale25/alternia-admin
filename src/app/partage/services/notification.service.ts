import { Injectable, signal, computed } from '@angular/core';

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

const NOTIFICATIONS_INITIALES: NotificationDTO[] = [
  {
    id: 'NOTIF-01',
    type: 'erreur',
    categorie: 'hardware',
    titre: 'Alerte Batterie Faible — Boîtier ALT-BOX-5520',
    message: 'Le boîtier Edge du Lycée Ba Aminata Diallo (Bamako) est passé sous le seuil critique de 18% d\'autonomie batterie.',
    date: 'Aujourd\'hui',
    heure: '14:32',
    lu: false,
    source: 'Boîtier ALT-BOX-5520-ML',
    lienRoute: '/boitiers',
    lienLabel: 'Inspecter le Boîtier'
  },
  {
    id: 'NOTIF-02',
    type: 'succes',
    categorie: 'business',
    titre: 'Souscription Confirmée — Orange Money Mali',
    message: 'Nouveau pack trimestriel activé pour la famille de Fatoumata Traoré (Élève 11S, Lycée Sankoré).',
    date: 'Aujourd\'hui',
    heure: '13:15',
    lu: false,
    source: 'Orange Money Mali API',
    lienRoute: '/abonnements',
    lienLabel: 'Voir l\'Abonnement'
  },
  {
    id: 'NOTIF-03',
    type: 'info',
    categorie: 'ia',
    titre: 'Mise à jour Profils Enseignants IA',
    message: 'Les profils des enseignants virtuels et les voix de synthèse TTS ont été synchronisés sur 1 202 boîtiers Edge.',
    date: 'Aujourd\'hui',
    heure: '11:04',
    lu: false,
    source: 'Studio Avatars & Voix',
    lienRoute: '/pedagogie-ia',
    lienLabel: 'Voir le Studio'
  },
  {
    id: 'NOTIF-04',
    type: 'avertissement',
    categorie: 'gouvernance',
    titre: 'Abonnement Établissement Proche de l\'Expiration',
    message: 'Le contrat du Lycée Excellence Saint-Louis expire dans 14 jours (120 élèves actifs).',
    date: 'Hier',
    heure: '17:45',
    lu: true,
    source: 'Gouvernance Éducative',
    lienRoute: '/abonnements',
    lienLabel: 'Gérer les Abonnements'
  },
  {
    id: 'NOTIF-05',
    type: 'succes',
    categorie: 'systeme',
    titre: 'Sauvegarde Cloud & Synchronisation Edge Complète',
    message: 'L\'ensemble des télémétries et des progressions d\'élèves a été synchronisé avec la base centrale Alta DB.',
    date: 'Hier',
    heure: '03:00',
    lu: true,
    source: 'Alta DB Master Server'
  },
  {
    id: 'NOTIF-06',
    type: 'info',
    categorie: 'hardware',
    titre: 'Campagne OTA v2.4.2-Edge Planifiée',
    message: 'La diffusion du nouveau firmware à ultra-faible latence débutera ce vendredi à minuit sur le parc national.',
    date: '30/08/2026',
    heure: '09:20',
    lu: true,
    source: 'Serveur OTA AlternIA',
    lienRoute: '/boitiers',
    lienLabel: 'Voir la Campagne OTA'
  }
];

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _notifications = signal<NotificationDTO[]>(NOTIFICATIONS_INITIALES);
  readonly notifications = this._notifications.asReadonly();

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
  }

  marquerToutCommeLu(): void {
    this._notifications.update(liste =>
      liste.map(n => ({ ...n, lu: true }))
    );
  }

  supprimer(id: string): void {
    this._notifications.update(liste => liste.filter(n => n.id !== id));
  }

  fermer(id: string): void {
    this.supprimer(id);
  }

  viderHistorique(): void {
    this._notifications.set([]);
  }
}

