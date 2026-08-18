import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BarreLateraleComponent } from '../barre-laterale/barre-laterale.component';
import { BarreSuperieureComponent } from '../barre-superieure/barre-superieure.component';
import { NotificationToastComponent } from '../../../partage/composants/notification-toast/notification-toast.component';

@Component({
  selector: 'app-structure-globale',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BarreLateraleComponent,
    BarreSuperieureComponent,
    NotificationToastComponent
  ],
  templateUrl: './structure-globale.component.html',
  styleUrls: ['./structure-globale.component.scss']
})
export class StructureGlobaleComponent {
  readonly barreRepliee = signal<boolean>(false);

  basculerRepliBarre(): void {
    this.barreRepliee.update(v => !v);
  }
}
