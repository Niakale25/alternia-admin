import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametresService } from '../services/parametres.service';
import { SectionPlateformeComponent } from '../composants/section-plateforme/section-plateforme.component';
import { SectionSecuriteComponent } from '../composants/section-securite/section-securite.component';
import { SectionIaComponent } from '../composants/section-ia/section-ia.component';
import { HtmlSecurisePipe } from '@partage/tuyaux/html-securise.pipe';
import { ParametresPlateformeDTO } from '../modeles/parametres.model';

@Component({
  selector: 'app-parametres-page',
  standalone: true,
  imports: [
    CommonModule,
    SectionPlateformeComponent,
    SectionSecuriteComponent,
    SectionIaComponent,
    HtmlSecurisePipe
  ],
  templateUrl: './parametres-page.component.html',
  styleUrls: ['./parametres-page.component.scss']
})
export class ParametresPageComponent implements OnInit {
  readonly service = inject(ParametresService);

  ngOnInit(): void {
    this.service.chargerParametres();
  }

  onEnregistrer(nouveaux: Partial<ParametresPlateformeDTO>): void {
    this.service.enregistrer(nouveaux);
  }
}
