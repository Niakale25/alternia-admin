import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError } from 'rxjs';

export interface IdentifiantsConnexion {
  email: string;
  motDePasse: string;
}

export interface ReponseConnexion {
  jeton: string;
  admin: {
    id: string;
    email: string;
    nom: string;
  };
}

const CLE_JETON = 'alternia_jeton_auth';
const CLE_ADMIN = 'alternia_admin_info';

@Injectable({ providedIn: 'root' })
export class AuthentificationService {
  private readonly _estConnecte = signal<boolean>(this._verifierJeton());
  private readonly _adminInfo = signal<ReponseConnexion['admin'] | null>(this._chargerAdmin());

  readonly estConnecte = computed(() => this._estConnecte());
  readonly adminInfo = computed(() => this._adminInfo());

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  seConnecter(identifiants: IdentifiantsConnexion) {
    return this.http.post<ReponseConnexion>('/api/v1/auth/login', identifiants).pipe(
      tap(reponse => {
        localStorage.setItem(CLE_JETON, reponse.jeton);
        localStorage.setItem(CLE_ADMIN, JSON.stringify(reponse.admin));
        this._estConnecte.set(true);
        this._adminInfo.set(reponse.admin);
      }),
      catchError(err => throwError(() => err))
    );
  }

  seDeconnecter(): void {
    localStorage.removeItem(CLE_JETON);
    localStorage.removeItem(CLE_ADMIN);
    this._estConnecte.set(false);
    this._adminInfo.set(null);
    this.router.navigate(['/connexion']);
  }

  obtenirJeton(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(CLE_JETON) : null;
  }

  private _verifierJeton(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(CLE_JETON);
  }

  private _chargerAdmin(): ReponseConnexion['admin'] | null {
    if (typeof window === 'undefined') return null;
    const donnees = localStorage.getItem(CLE_ADMIN);
    return donnees ? JSON.parse(donnees) : null;
  }
}
