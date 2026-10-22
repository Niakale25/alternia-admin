import { Injectable, inject } from '@angular/core';
import { NotificationService } from './notification.service';

export interface ColonneExport<T = any> {
  cle: keyof T | string;
  entete: string;
  formater?: (valeur: any, item: T) => string | number;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private readonly notificationService = inject(NotificationService);

  /**
   * Génère et déclenche le téléchargement immédiat et garanti d'un fichier CSV encodé en UTF-8 avec BOM.
   * Compatible avec Excel Windows (séparateur point-virgule), LibreOffice, Google Sheets et Numbers.
   */
  exporterCsv<T>(
    colonnes: ColonneExport<T>[],
    donnees: T[],
    prefixeNomFichier: string,
    messageSucces?: string
  ): void {
    if (!donnees || donnees.length === 0) {
      this.notificationService.avertissement('Aucune donnée à exporter.');
      return;
    }

    try {
      // 1. En-tête CSV
      const separateur = ';'; // Standard pour Excel en environnement francophone
      const ligneEntetes = colonnes.map(c => this.echapperCsv(c.entete)).join(separateur);

      // 2. Lignes de données
      const lignesDonnees = donnees.map(item => {
        return colonnes.map(col => {
          let val: any;
          if (typeof col.cle === 'string' && col.cle.includes('.')) {
            val = col.cle.split('.').reduce((acc: any, part: string) => acc?.[part], item);
          } else {
            val = (item as any)[col.cle];
          }

          if (col.formater) {
            try {
              val = col.formater(val, item);
            } catch (errFormater) {
              console.warn(`Erreur de formatage sur la colonne ${col.entete}:`, errFormater);
            }
          }

          return this.echapperCsv(val);
        }).join(separateur);
      });

      // 3. Assemblage avec BOM UTF-8 (\uFEFF)
      const contenuComplet = '\uFEFF' + [ligneEntetes, ...lignesDonnees].join('\r\n');
      const blob = new Blob([contenuComplet], { type: 'text/csv;charset=utf-8' });

      // 4. Déclenchement du téléchargement dans le navigateur avec nom propre
      const dateStr = new Date().toISOString().slice(0, 10);
      const nomFichierFinal = this.assainirNomFichier(`${prefixeNomFichier}_${dateStr}`, 'csv');
      this.declencherTelechargement(blob, nomFichierFinal);

      const msg = messageSucces || `Fichier CSV "${nomFichierFinal}" exporté avec succès (${donnees.length} enregistrements).`;
      this.notificationService.succes(msg);
    } catch (err) {
      console.error("Erreur critique lors de l'export CSV:", err);
      this.notificationService.erreur("Échec de la génération de l'export CSV.");
    }
  }

  /**
   * Télécharge un contenu texte ou rapport formaté.
   */
  exporterRapportTexte(
    contenu: string,
    nomFichier: string,
    typeMime: string = 'text/plain;charset=utf-8'
  ): void {
    try {
      const blob = new Blob(['\uFEFF' + contenu], { type: typeMime });
      const nomAssaini = this.assainirNomFichier(nomFichier, 'txt');
      this.declencherTelechargement(blob, nomAssaini);
      this.notificationService.succes(`Rapport "${nomAssaini}" téléchargé.`);
    } catch (err) {
      console.error("Erreur lors de l'export texte:", err);
      this.notificationService.erreur("Échec du téléchargement du rapport.");
    }
  }

  private echapperCsv(valeur: any): string {
    if (valeur === null || valeur === undefined) {
      return '""';
    }
    // Nettoie les retours à la ligne internes pour ne pas corrompre les lignes CSV
    const str = String(valeur).replace(/[\r\n]+/g, ' ').trim();
    // Remplace les guillemets doubles par deux guillemets doubles
    const echappe = str.replace(/"/g, '""');
    return `"${echappe}"`;
  }

  private assainirNomFichier(nom: string, extension: string = 'csv'): string {
    // Supprime les accents et remplace les caractères non alphanumériques par des underscores
    const sansAccents = nom.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const propre = sansAccents.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    return `${propre}.${extension}`;
  }

  private declencherTelechargement(blob: Blob, nomFichier: string): void {
    // 1. Compatibilité navigateurs Microsoft (IE / Edge si msSaveOrOpenBlob existe)
    const nav = window.navigator as any;
    if (typeof nav?.msSaveOrOpenBlob === 'function') {
      nav.msSaveOrOpenBlob(blob, nomFichier);
      return;
    }

    // 2. Création de l'URL objet Blob
    const url = window.URL.createObjectURL(blob);

    // 3. Ancre DOM hors écran (NON display: none pour éviter l'invalidation par certains moteurs de rendu)
    const ancre = document.createElement('a');
    ancre.style.position = 'fixed';
    ancre.style.left = '-9999px';
    ancre.style.top = '-9999px';
    ancre.style.opacity = '0';
    ancre.style.pointerEvents = 'none';
    ancre.setAttribute('href', url);
    ancre.setAttribute('download', nomFichier);
    ancre.setAttribute('rel', 'noopener noreferrer');
    ancre.setAttribute('target', '_blank');
    document.body.appendChild(ancre);

    // 4. Déclenchement du clic
    try {
      ancre.click();
    } catch (errClic) {
      console.warn('Erreur ancre.click(), tentative via MouseEvent:', errClic);
      const clic = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      ancre.dispatchEvent(clic);
    }

    // 5. CRUCIAL : Garder l'ancre et l'URL actives pendant 60 secondes.
    // Sous Chromium / Edge / Windows, détruire l'URL ou retirer l'ancre immédiatement
    // coupe le flux de streaming du gestionnaire de téléchargement et provoque "Échec - Erreur réseau".
    setTimeout(() => {
      try {
        if (ancre.parentNode) {
          document.body.removeChild(ancre);
        }
        window.URL.revokeObjectURL(url);
      } catch (errNettoyage) {
        console.debug('Nettoyage blob:', errNettoyage);
      }
    }, 60000);
  }
}
