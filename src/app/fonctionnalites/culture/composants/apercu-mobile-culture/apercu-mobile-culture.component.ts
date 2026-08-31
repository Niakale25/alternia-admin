import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenuCulturelDTO, SceneConteDTO } from '../../modeles/culture.modele';

@Component({
  selector: 'app-apercu-mobile-culture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apercu-mobile-culture.component.html',
  styleUrls: ['./apercu-mobile-culture.component.scss']
})
export class ApercuMobileCultureComponent {
  @Input({ required: true }) item!: ContenuCulturelDTO;
  @Output() fermer = new EventEmitter<void>();

  // État interactif pour le lecteur de conte
  readonly sceneActuelleId = signal<string>('');
  
  // État interactif pour devinette
  readonly indicesRevele = signal<number>(0);
  readonly reponseSelectionnee = signal<string | null>(null);

  // État interactif pour quiz
  readonly optionQuizChoisie = signal<number | null>(null);

  ngOnInit(): void {
    if (this.item.type === 'conte' && this.item.scenes?.length) {
      this.sceneActuelleId.set(this.item.scenes[0].id);
    }
  }

  get sceneCourante(): SceneConteDTO | null {
    if (this.item.type !== 'conte' || !this.item.scenes?.length) return null;
    return this.item.scenes.find(s => s.id === this.sceneActuelleId()) || this.item.scenes[0];
  }

  choisirScene(id: string): void {
    this.sceneActuelleId.set(id);
  }

  recommencerConte(): void {
    if (this.item.type === 'conte' && this.item.scenes?.length) {
      this.sceneActuelleId.set(this.item.scenes[0].id);
    }
  }

  revelerProchainIndice(): void {
    if (this.item.type === 'devinette') {
      const max = this.item.indices?.length || 0;
      if (this.indicesRevele() < max) {
        this.indicesRevele.update(v => v + 1);
      }
    }
  }

  testerReponseDevinette(option: string): void {
    this.reponseSelectionnee.set(option);
  }

  reinitialiserDevinette(): void {
    this.indicesRevele.set(0);
    this.reponseSelectionnee.set(null);
  }

  choisirOptionQuiz(index: number): void {
    this.optionQuizChoisie.set(index);
  }
}
