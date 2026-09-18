import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedagogieIaService } from '../services/pedagogie-ia.service';
import { StudioAvatarsComponent } from '../composants/studio-avatars/studio-avatars.component';
import { ModalAvatarComponent } from '../composants/modal-avatar/modal-avatar.component';
import { CarteStatistiqueComponent } from '@partage/composants/carte-statistique/carte-statistique.component';
import { ModalConfirmationComponent } from '@partage/composants/modal-confirmation/modal-confirmation.component';
import { AvatarPedagogiqueDTO } from '@donnees/repositories/pedagogie-ia.repository';

@Component({
  selector: 'app-pedagogie-ia-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StudioAvatarsComponent,
    ModalAvatarComponent,
    CarteStatistiqueComponent,
    ModalConfirmationComponent
  ],
  templateUrl: './pedagogie-ia-page.component.html',
  styleUrls: ['./pedagogie-ia-page.component.scss']
})
export class PedagogieIaPageComponent implements OnInit {
  readonly service = inject(PedagogieIaService);
  readonly avatarASupprimer = signal<AvatarPedagogiqueDTO | null>(null);

  ngOnInit(): void {
    this.service.chargerDonnees();
  }

  onLireVoixAvatar(avatar: AvatarPedagogiqueDTO): void {
    this.service.lireExtraitVocal(avatar.id, avatar.audioSampleText, avatar.nom);
  }

  onEditerAvatar(avatar: AvatarPedagogiqueDTO): void {
    this.service.ouvrirEditionAvatar(avatar);
  }

  onBasculerActif(avatar: AvatarPedagogiqueDTO): void {
    this.service.basculerActifAvatar(avatar);
  }

  demanderSuppressionAvatar(avatar: AvatarPedagogiqueDTO): void {
    this.avatarASupprimer.set(avatar);
  }

  confirmerSuppressionAvatar(): void {
    const a = this.avatarASupprimer();
    if (a) {
      this.service.supprimerAvatar(a.id);
      this.avatarASupprimer.set(null);
    }
  }

  onSauvegarderAvatar(avatarData: Omit<AvatarPedagogiqueDTO, 'id'>): void {
    this.service.sauvegarderAvatar(avatarData);
  }
}
