import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from '@core/services/authentification/authentification.service';

@Component({
  selector: 'app-connexion-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './connexion-page.component.html',
  styleUrls: ['./connexion-page.component.scss']
})
export class ConnexionPageComponent implements OnInit, OnDestroy {
  readonly formulaireConnexion: FormGroup;

  enChargement = false;
  erreurServeur: string | null = null;
  motDePasseVisible = false;
  focusEmail = false;
  focusMotDePasse = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthentificationService,
    private readonly router: Router
  ) {
    this.formulaireConnexion = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Bloque le scroll du body sur la page de connexion
    document.body.classList.add('connexion-active');
  }

  ngOnDestroy(): void {
    // Restaure le scroll normal en quittant la page
    document.body.classList.remove('connexion-active');
  }

  soumettre(): void {
    if (this.formulaireConnexion.invalid) {
      this.formulaireConnexion.markAllAsTouched();
      return;
    }

    this.enChargement = true;
    this.erreurServeur = null;

    const { email, motDePasse } = this.formulaireConnexion.value;

    this.authService.seConnecter({ email, motDePasse }).subscribe({
      next: () => {
        this.enChargement = false;
        this.router.navigate(['/tableau-bord']);
      },
      error: (err) => {
        this.enChargement = false;
        if (err?.status === 401 || err?.status === 403) {
          this.erreurServeur = 'Email ou mot de passe incorrect.';
        } else if (err?.status === 0) {
          this.erreurServeur = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
        } else {
          this.erreurServeur = err?.error?.message ?? 'Une erreur inattendue est survenue.';
        }
      }
    });
  }

  basculerVisibilite(): void {
    this.motDePasseVisible = !this.motDePasseVisible;
  }

  estChampInvalide(nomChamp: string): boolean {
    const champ = this.formulaireConnexion.get(nomChamp);
    return !!(champ && champ.invalid && (champ.dirty || champ.touched));
  }

  obtenirMessageErreurEmail(): string {
    const ctrl = this.formulaireConnexion.get('email');
    if (ctrl?.hasError('required')) return 'L\'adresse e-mail est obligatoire.';
    if (ctrl?.hasError('email')) return 'Veuillez saisir une adresse e-mail valide.';
    return '';
  }

  obtenirMessageErreurMotDePasse(): string {
    const ctrl = this.formulaireConnexion.get('motDePasse');
    if (ctrl?.hasError('required')) return 'Le mot de passe est obligatoire.';
    if (ctrl?.hasError('minlength')) return 'Le mot de passe doit contenir au moins 6 caractères.';
    return '';
  }
}
