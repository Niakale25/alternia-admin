import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { JETON_CONFIG_API, ConfigurationApi } from '@core/configuration/api.config';
import { ReponseApi } from '../modeles/reponse-api.model';
import { CriteresPagination, PageReponse } from '../modeles/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ClientApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject<ConfigurationApi>(JETON_CONFIG_API);

  /**
   * Construit une URL complète vers un endpoint Spring Boot.
   */
  private construireUrl(chemin: string): string {
    const base = this.config.urlBase.replace(/\/$/, '');
    const path = chemin.replace(/^\//, '');
    return `${base}/${path}`;
  }

  /**
   * Convertit un objet de critères en HttpParams conformes à Spring Data Pageable.
   */
  private construireParametresPage(criteres?: CriteresPagination): HttpParams {
    let params = new HttpParams();
    if (!criteres) return params;

    params = params.set('page', criteres.page.toString());
    params = params.set('size', criteres.taille.toString());

    if (criteres.tri) {
      const direction = criteres.direction || 'ASC';
      params = params.set('sort', `${criteres.tri},${direction}`);
    }

    if (criteres.recherche) {
      params = params.set('q', criteres.recherche);
    }

    if (criteres.filtres) {
      for (const [cle, valeur] of Object.entries(criteres.filtres)) {
        if (valeur !== undefined && valeur !== null && valeur !== '') {
          params = params.set(cle, valeur.toString());
        }
      }
    }

    return params;
  }

  /**
   * Effectue un appel GET typé avec déballage de l'enveloppe ReponseApi.
   */
  get<T>(chemin: string, params?: HttpParams | Record<string, any>): Observable<T> {
    const url = this.construireUrl(chemin);
    return this.http.get<ReponseApi<T> | T>(url, { params: params as any }).pipe(
      map(res => {
        if (res && typeof res === 'object' && 'donnees' in res) {
          return (res as ReponseApi<T>).donnees;
        }
        return res as T;
      })
    );
  }

  /**
   * Effectue un appel GET paginé vers un contrôleur Spring Data REST.
   */
  getPage<T>(chemin: string, criteres?: CriteresPagination): Observable<PageReponse<T>> {
    const url = this.construireUrl(chemin);
    const params = this.construireParametresPage(criteres);

    return this.http.get<ReponseApi<PageReponse<T>> | PageReponse<T>>(url, { params }).pipe(
      map(res => {
        if (res && typeof res === 'object' && 'donnees' in res) {
          return (res as ReponseApi<PageReponse<T>>).donnees;
        }
        return res as PageReponse<T>;
      })
    );
  }

  /**
   * Effectue un appel POST vers un endpoint Spring Boot.
   */
  post<T, D = any>(chemin: string, corps: D): Observable<T> {
    const url = this.construireUrl(chemin);
    return this.http.post<ReponseApi<T> | T>(url, corps).pipe(
      map(res => {
        if (res && typeof res === 'object' && 'donnees' in res) {
          return (res as ReponseApi<T>).donnees;
        }
        return res as T;
      })
    );
  }

  /**
   * Effectue un appel PUT vers un endpoint Spring Boot.
   */
  put<T, D = any>(chemin: string, corps: D): Observable<T> {
    const url = this.construireUrl(chemin);
    return this.http.put<ReponseApi<T> | T>(url, corps).pipe(
      map(res => {
        if (res && typeof res === 'object' && 'donnees' in res) {
          return (res as ReponseApi<T>).donnees;
        }
        return res as T;
      })
    );
  }

  /**
   * Effectue un appel DELETE vers un endpoint Spring Boot.
   */
  delete<T = void>(chemin: string): Observable<T> {
    const url = this.construireUrl(chemin);
    return this.http.delete<ReponseApi<T> | T>(url).pipe(
      map(res => {
        if (res && typeof res === 'object' && 'donnees' in res) {
          return (res as ReponseApi<T>).donnees;
        }
        return res as T;
      })
    );
  }
}
