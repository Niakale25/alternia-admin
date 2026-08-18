/**
 * Enveloppe standard pour les réponses REST de l'API Spring Boot (ApiResponse<T>).
 */
export interface ReponseApi<T> {
  horodatage: string;
  statutHttp: number;
  succes: boolean;
  message: string;
  donnees: T;
  erreurs?: Array<{
    champ?: string;
    message: string;
  }>;
}
