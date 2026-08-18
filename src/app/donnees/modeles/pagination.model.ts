/**
 * Représentation typée d'une page retournée par Spring Data (Page<T>).
 */
export interface PageReponse<T> {
  contenu: T[];
  totalElements: number;
  totalPages: number;
  numeroPage: number;
  taillePage: number;
  estPremiere: boolean;
  estDerniere: boolean;
  estVide: boolean;
}

/**
 * Critères de pagination et tri pour les requêtes Spring Boot (Pageable).
 */
export interface CriteresPagination {
  page: number;
  taille: number;
  tri?: string;
  direction?: 'ASC' | 'DESC';
  recherche?: string;
  filtres?: Record<string, string | number | boolean | undefined>;
}
