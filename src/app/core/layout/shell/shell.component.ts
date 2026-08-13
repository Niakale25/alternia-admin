import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { ToastContainerComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, ToastContainerComponent],
  template: `
    <div class="shell">
      <app-sidebar [collapsed]="sidebarCollapsed" (collapsedChange)="sidebarCollapsed = $event" />
      
      <!-- Backdrop for mobile overlay sidebar -->
      @if (!sidebarCollapsed) {
        <div class="shell__backdrop" (click)="sidebarCollapsed = true"></div>
      }
      
      <div class="shell__main" [class.shell__main--collapsed]="sidebarCollapsed">
        <app-topbar [sidebarCollapsed]="sidebarCollapsed" (toggleSidebar)="sidebarCollapsed = !sidebarCollapsed" />
        <main class="shell__content">
          <router-outlet />
        </main>
      </div>
      <app-toast-container />
    </div>
  `,
  styles: [`
    .shell {
      display: flex;
      height: 100vh;
      background: var(--c-surface);
      overflow: hidden;
      position: relative;
    }

    .shell__backdrop {
      display: none;
      @media (max-width: 768px) {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.4);
        backdrop-filter: blur(2px);
        z-index: 95;
      }
    }

    .shell__main {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: var(--sidebar-width);
      transition: margin-left var(--t-slow);
      overflow: hidden;

      &--collapsed {
        margin-left: var(--sidebar-collapsed);
      }
    }

    .shell__content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
    }
  `]
})
export class ShellComponent implements OnInit {
  sidebarCollapsed = false;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.sidebarCollapsed = window.innerWidth <= 768;
    }
  }
}

