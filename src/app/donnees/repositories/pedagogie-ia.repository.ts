import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientApiService } from '../services/client-api.service';

export interface AvatarPedagogiqueDTO {
  id: string;
  nom: string;
  matiere: string;
  stylePedagogique: string;
  voixTts: string;
  photoUrl: string;
  audioSampleText: string;
  promptSysteme: string;
  actif: boolean;
  parDefaut: boolean;
  niveauClasse: string;
  accent: string;
  // Paramètres Simli Streaming à distance
  moteurRendu: 'simli' | 'statique';
  simliApiKey?: string;
  simliFaceId?: string;
  simliModel?: 'fasttalk' | 'trinity' | 'artalk';
  simliHandleSilence?: boolean;
  statutTraitement?: 'pret' | 'en_cours' | 'echec';
  qualiteVisage?: number;
  latenceEdgeMs?: number;
  dateTraitement?: string;
}

export interface DonneesPedagogieIaDTO {
  avatars: AvatarPedagogiqueDTO[];
  kpis: {
    totalRequetesIa: string;
    tempsMoyenReponseEdge: string;
    avatarsActifs: number;
    voixTtsDisponibles: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PedagogieIaRepository {
  private readonly clientApi = inject(ClientApiService);
  private readonly endpoint = '/pedagogie-ia';

  private donneesLocales: DonneesPedagogieIaDTO = {
    kpis: {
      totalRequetesIa: '148 900',
      tempsMoyenReponseEdge: '142 ms',
      avatarsActifs: 4,
      voixTtsDisponibles: 4
    },
    avatars: [
      {
        id: 'AVATAR-01',
        nom: 'Vivienne',
        matiere: 'Français & Littérature',
        stylePedagogique: 'Bienveillante, élocution soignée et interactive',
        voixTts: 'fr-FR-VivienneNeural',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        audioSampleText: 'Bonjour ! Je suis Vivienne, ton enseignante virtuelle sur AlternIA. Découvrons ensemble les grands auteurs et les subtilités de la langue.',
        promptSysteme: 'Tu es Vivienne, enseignante virtuelle d\'AlternIA au Mali. Tu t\'adresses aux élèves avec clarté, rigueur et bienveillance selon le programme CNCE.',
        actif: true,
        parDefaut: true,
        niveauClasse: 'Toutes classes (10e-12e)',
        accent: '#314999',
        moteurRendu: 'simli',
        simliApiKey: 'simli_live_livekit_cnce_edtech_99a8b',
        simliFaceId: 'f9b37c10-91ae-4b08-b6de-87d4bc9e1201',
        simliModel: 'trinity',
        simliHandleSilence: true,
        statutTraitement: 'pret',
        qualiteVisage: 99,
        latenceEdgeMs: 112,
        dateTraitement: '12/09/2026'
      },
      {
        id: 'AVATAR-02',
        nom: 'Professeur Amadou',
        matiere: 'Mathématiques & Sciences',
        stylePedagogique: 'Méthodique, étape par étape avec démonstrations concrètes',
        voixTts: 'fr-ML-AmadouNeural (Accent Ouest-Africain)',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        audioSampleText: 'Bienvenue au cours de mathématiques. Ne crains pas les équations, décomposons chaque calcul pas à pas.',
        promptSysteme: 'Tu es le Professeur Amadou, tuteur en mathématiques et physique. Fournis des explications claires et guide l\'élève pour qu\'il résolve l\'exercice par lui-même.',
        actif: true,
        parDefaut: false,
        niveauClasse: '11S & 12SE / 12SVT',
        accent: '#0284c7',
        moteurRendu: 'simli',
        simliApiKey: 'simli_live_livekit_cnce_edtech_99a8b',
        simliFaceId: 'a3d45e12-88ef-4172-bfa1-71e21b796403',
        simliModel: 'fasttalk',
        simliHandleSilence: true,
        statutTraitement: 'pret',
        qualiteVisage: 97,
        latenceEdgeMs: 124,
        dateTraitement: '10/09/2026'
      },
      {
        id: 'AVATAR-03',
        nom: 'Kadiatou',
        matiere: 'Histoire, Géographie & Culture',
        stylePedagogique: 'Narrative, passionnée, conteuse et pédagogue',
        voixTts: 'fr-ML-KadiatouWarm',
        photoUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
        audioSampleText: 'Explore avec moi l\'épopée mandingue, l\'histoire millénaire de nos empires et les grands trésors du Mali.',
        promptSysteme: 'Tu es Kadiatou, guide d\'histoire et de culture malienne. Raconte les récits historiques avec authenticité et fais le lien avec le programme officiel du CNCE.',
        actif: true,
        parDefaut: false,
        niveauClasse: '10e, 11L, 12LL',
        accent: '#f1851f',
        moteurRendu: 'simli',
        simliApiKey: 'simli_live_livekit_cnce_edtech_99a8b',
        simliFaceId: 'c7e812d4-34bb-4211-9a10-2f94b15099cd',
        simliModel: 'trinity',
        simliHandleSilence: true,
        statutTraitement: 'pret',
        qualiteVisage: 98,
        latenceEdgeMs: 118,
        dateTraitement: '11/09/2026'
      },
      {
        id: 'AVATAR-04',
        nom: 'Docteur Oumar',
        matiere: 'SVT & Biologie',
        stylePedagogique: 'Scientifique, axé sur les schémas et la démarche expérimentale',
        voixTts: 'fr-FR-OumarScience',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        audioSampleText: 'En SVT, observer c\'est comprendre. Analysons ensemble le métabolisme cellulaire et la géologie sahélienne.',
        promptSysteme: 'Tu es Docteur Oumar, enseignant en SVT. Explique les mécanismes du vivant de façon visuelle et rigoureuse.',
        actif: true,
        parDefaut: false,
        niveauClasse: '11S & 12SVT',
        accent: '#10b981',
        moteurRendu: 'statique',
        simliModel: 'fasttalk',
        statutTraitement: 'pret',
        qualiteVisage: 95
      }
    ]
  };

  recupererDonnees(): Observable<DonneesPedagogieIaDTO> {
    return of({ ...this.donneesLocales });
  }

  creerAvatar(nouveau: Omit<AvatarPedagogiqueDTO, 'id'>): Observable<AvatarPedagogiqueDTO> {
    const avatar: AvatarPedagogiqueDTO = {
      ...nouveau,
      id: `AVATAR-0${this.donneesLocales.avatars.length + 1}`
    };
    this.donneesLocales.avatars = [...this.donneesLocales.avatars, avatar];
    this.donneesLocales.kpis.avatarsActifs = this.donneesLocales.avatars.filter(a => a.actif).length;
    return of(avatar);
  }

  modifierAvatar(id: string, modifications: Partial<AvatarPedagogiqueDTO>): Observable<AvatarPedagogiqueDTO | null> {
    const idx = this.donneesLocales.avatars.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.donneesLocales.avatars[idx] = { ...this.donneesLocales.avatars[idx], ...modifications };
      this.donneesLocales.kpis.avatarsActifs = this.donneesLocales.avatars.filter(a => a.actif).length;
      return of({ ...this.donneesLocales.avatars[idx] });
    }
    return of(null);
  }

  supprimerAvatar(id: string): Observable<boolean> {
    this.donneesLocales.avatars = this.donneesLocales.avatars.filter(a => a.id !== id);
    this.donneesLocales.kpis.avatarsActifs = this.donneesLocales.avatars.filter(a => a.actif).length;
    return of(true);
  }
}
