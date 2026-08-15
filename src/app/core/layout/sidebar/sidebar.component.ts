import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SafeHtmlPipe],
  template: `
    <aside class="sidebar" [class.sidebar--collapsed]="collapsed">

      <!-- HEADER (ChatGPT Style Toggle) -->
      <div class="sidebar__header">
        @if (!collapsed) {
          <div class="sidebar__logo">
            <div class="sidebar__logo-mark">
              <svg width="30" height="30" viewBox="0 0 34 34" fill="none">
                <rect width="34" height="34" rx="9" fill="#314999"/>
                <path d="M17 7L26.5 26H7.5L17 7Z" fill="white" opacity="0.95"/>
                <path d="M17 12.5L23 26H11L17 12.5Z" fill="#40BBCC" opacity="0.9"/>
              </svg>
            </div>
            <div class="sidebar__logo-text">
              <span class="sidebar__logo-name">Alternia</span>
              <span class="sidebar__logo-tag">SUPER ADMIN</span>
            </div>
          </div>
          <button
            class="sidebar__toggle-btn"
            (click)="toggleCollapse()"
            data-tooltip="Fermer la barre latérale"
            aria-label="Fermer la barre latérale"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>
            </svg>
          </button>
        } @else {
          <button
            class="sidebar__toggle-btn sidebar__toggle-btn--collapsed"
            (click)="toggleCollapse()"
            data-tooltip="Ouvrir la barre latérale"
            aria-label="Ouvrir la barre latérale"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>
            </svg>
          </button>
        }
      </div>

      <!-- NAVIGATION -->
      <nav class="sidebar__nav">
        @for (group of navGroups; track group.label) {
          @if (!collapsed) {
            <div class="sidebar__group-label">{{ group.label }}</div>
          } @else {
            <div class="sidebar__group-divider"></div>
          }
          @for (item of group.items; track item.route) {
            <a
              class="sidebar__item"
              [routerLink]="item.route"
              routerLinkActive="sidebar__item--active"
              [attr.data-tooltip]="collapsed ? item.label : null"
              [attr.aria-label]="item.label"
            >
              <span class="sidebar__item-icon" [innerHTML]="item.icon | safeHtml"></span>
              @if (!collapsed) {
                <span class="sidebar__item-label">{{ item.label }}</span>
                @if (item.badge) {
                  <span class="sidebar__item-badge">{{ item.badge }}</span>
                }
              }
            </a>
          }
          @if (!collapsed) {
            <div class="sidebar__separator"></div>
          }
        }
      </nav>

      <!-- USER FOOTER -->
      <div class="sidebar__footer">
        @if (!collapsed) {
          <div class="sidebar__user" routerLink="/parametres">
            <div class="sidebar__user-avatar">
              SA
              <span class="sidebar__user-dot"></span>
            </div>
            <div class="sidebar__user-info">
              <div class="sidebar__user-name">Super Admin</div>
              <div class="sidebar__user-email">admin&#64;alternia.io</div>
            </div>
          </div>
        } @else {
          <div class="sidebar__user-collapsed" routerLink="/parametres" data-tooltip="Super Admin (admin@alternia.io)">
            <div class="sidebar__user-avatar">
              SA
              <span class="sidebar__user-dot"></span>
            </div>
          </div>
        }
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--sidebar-width);
      background: var(--c-white);
      border-right: 1px solid var(--c-border);
      display: flex;
      flex-direction: column;
      z-index: 100;
      transition: width var(--t-slow) cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: var(--s-xs);
      overflow: visible;

      &--collapsed {
        width: var(--sidebar-collapsed);

        .sidebar__header {
          justify-content: center;
          padding: 0;
        }

        .sidebar__nav {
          padding: 10px 0;
          align-items: center;
        }

        .sidebar__item {
          width: 42px;
          height: 42px;
          padding: 0;
          justify-content: center;
          margin: 3px auto;
          border-radius: var(--r-md);

          &::before { display: none; }

          &:hover {
            background: var(--c-surface-alt);
            color: var(--c-brand);
            transform: scale(1.06);
          }

          &--active {
            background: var(--c-brand);
            color: white;
            box-shadow: 0 4px 12px rgba(49, 73, 153, 0.32);

            .sidebar__item-icon {
              color: white;
            }

            &:hover {
              background: var(--c-brand-hover);
              color: white;
            }
          }
        }

        .sidebar__footer {
          padding: 10px 0;
          justify-content: center;
        }
      }
    }

    .sidebar__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;
      height: var(--topbar-height);
      border-bottom: 1px solid var(--c-border-light);
      flex-shrink: 0;
    }

    .sidebar__logo {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .sidebar__logo-mark {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    .sidebar__logo-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow: hidden;
    }

    .sidebar__logo-name {
      font-family: var(--font-sans);
      font-size: 15px;
      font-weight: 700;
      color: var(--c-brand);
      letter-spacing: -0.02em;
      line-height: 1.1;
      white-space: nowrap;
    }

    .sidebar__logo-tag {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.10em;
      text-transform: uppercase;
      color: var(--c-secondary);
      margin-top: 1px;
      white-space: nowrap;
    }

    .sidebar__toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid transparent;
      border-radius: var(--r-md);
      background: transparent;
      color: var(--c-secondary);
      cursor: pointer;
      transition: all var(--t-fast);
      flex-shrink: 0;

      &:hover {
        background: var(--c-surface-alt);
        border-color: var(--c-border);
        color: var(--c-brand);
      }

      &--collapsed {
        width: 38px;
        height: 38px;
        background: var(--c-surface-alt);
        border-color: var(--c-border-light);
        color: var(--c-brand);

        &:hover {
          background: var(--c-brand-bg);
          border-color: var(--c-brand-border);
        }
      }
    }

    .sidebar__nav {
      flex: 1;
      overflow-y: auto;
      overflow-x: visible;
      padding: 12px 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .sidebar__group-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.10em;
      text-transform: uppercase;
      color: var(--c-subtle);
      padding: 12px 10px 4px;
      white-space: nowrap;
    }

    .sidebar__group-divider {
      width: 24px;
      height: 1px;
      background: var(--c-border-light);
      margin: 6px auto;
    }

    .sidebar__separator {
      height: 1px;
      background: var(--c-border-light);
      margin: 8px 6px;
    }

    .sidebar__item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border: 1px solid transparent;
      border-radius: var(--r-md);
      color: var(--c-secondary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--t-fast);
      white-space: nowrap;
      position: relative;

      &:hover {
        background: var(--c-surface-alt);
        color: var(--c-text);

        .sidebar__item-icon {
          color: var(--c-brand);
        }
      }

      &--active {
        background: var(--c-brand-bg);
        color: var(--c-brand);
        font-weight: 600;
        border-color: transparent;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 15%;
          bottom: 15%;
          width: 3.5px;
          background: var(--c-brand);
          border-radius: 0 4px 4px 0;
        }

        .sidebar__item-icon {
          color: var(--c-brand);
        }
      }
    }

    .sidebar__item-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      color: var(--c-subtle);
      transition: color var(--t-fast);

      ::ng-deep svg {
        width: 17px;
        height: 17px;
        stroke-width: 1.8;
      }
    }

    .sidebar__item-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sidebar__item-badge {
      background: var(--c-accent);
      color: white;
      font-size: 10px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: var(--r-full);
      flex-shrink: 0;
    }

    .sidebar__footer {
      padding: 10px 12px;
      border-top: 1px solid var(--c-border-light);
      flex-shrink: 0;
    }

    .sidebar__user {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 8px;
      border-radius: var(--r-md);
      cursor: pointer;
      transition: background var(--t-fast);

      &:hover { background: var(--c-surface-alt); }
    }

    .sidebar__user-collapsed {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 4px;
      border-radius: var(--r-md);
      transition: transform var(--t-fast);

      &:hover {
        transform: scale(1.08);
      }
    }

    .sidebar__user-avatar {
      position: relative;
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--c-brand) 0%, var(--c-cyan) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(49, 73, 153, 0.25);
    }

    .sidebar__user-dot {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 8px;
      height: 8px;
      background: var(--c-success);
      border: 1.5px solid var(--c-white);
      border-radius: 50%;
    }

    .sidebar__user-info { min-width: 0; }

    .sidebar__user-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--c-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .sidebar__user-email {
      font-size: 11px;
      color: var(--c-subtle);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── HIGH-END FLOATING TOOLTIP (COMPACT MODE) ─────────────── */
    .sidebar--collapsed [data-tooltip] {
      position: relative;

      &::after {
        content: attr(data-tooltip);
        position: absolute;
        left: calc(100% + 14px);
        top: 50%;
        transform: translateY(-50%) translateX(-4px);
        background: #0F172A;
        color: #FFFFFF;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 500;
        font-family: var(--font-sans);
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--t-fast), transform var(--t-fast);
        z-index: 999;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
        letter-spacing: normal;
      }

      &::before {
        content: '';
        position: absolute;
        left: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%) translateX(-4px);
        border-width: 5px 6px 5px 0;
        border-style: solid;
        border-color: transparent #0F172A transparent transparent;
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--t-fast), transform var(--t-fast);
        z-index: 999;
      }

      &:hover::after,
      &:hover::before {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
      }
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  toggleCollapse() {
    this.collapsedChange.emit(!this.collapsed);
  }

  readonly iconChevronLeft = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
  readonly iconChevronRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

  // ── ICÔNES LUCIDE (inline SVG — pas de dépendances externes) ──
  private readonly icons = {
    layoutDashboard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
    school: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    monitorSmartphone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="4" rx="2" ry="2"/><line x1="2" x2="22" y1="20" y2="20"/></svg>`,
    graduationCap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    brain: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>`,
    fileText: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
    shieldCheck: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
    barChart3: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
    settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  };

  readonly navGroups: NavGroup[] = [
    {
      label: 'Principale',
      items: [
        {
          label: 'Tableau de Bord',
          route: '/tableau-bord',
          icon: this.icons.layoutDashboard
        },
        {
          label: 'Établissements',
          route: '/etablissements',
          icon: this.icons.school
        },
        {
          label: 'Parents',
          route: '/parents',
          icon: this.icons.users
        },
        {
          label: 'Boîtiers',
          route: '/boitiers',
          icon: this.icons.monitorSmartphone
        }
      ]
    },
    {
      label: 'Pédagogie',
      items: [
        {
          label: 'Moteurs IA',
          route: '/moteurs-ia',
          icon: this.icons.brain
        }
      ]
    },
    {
      label: 'Commercial',
      items: [
        {
          label: 'Licences',
          route: '/licences',
          icon: this.icons.fileText
        },
        {
          label: 'Abonnements',
          route: '/abonnements',
          icon: this.icons.shieldCheck
        }
      ]
    },
    {
      label: 'Données & Config',
      items: [
        {
          label: 'Statistiques',
          route: '/statistiques',
          icon: this.icons.barChart3
        },
        {
          label: 'Paramètres',
          route: '/parametres',
          icon: this.icons.settings
        }
      ]
    }
  ];
}
