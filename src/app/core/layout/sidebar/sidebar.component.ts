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

      <!-- LOGO -->
      <div class="sidebar__logo">
        <div class="sidebar__logo-mark">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <rect width="30" height="30" rx="9" fill="#314999"/>
            <path d="M15 6L23.5 23H6.5L15 6Z" fill="white" opacity="0.95"/>
            <path d="M15 11L20.5 23H9.5L15 11Z" fill="#40BBCC" opacity="0.8"/>
          </svg>
        </div>
        @if (!collapsed) {
          <div class="sidebar__logo-text">
            <span class="sidebar__logo-name">Alternia</span>
            <span class="sidebar__logo-tag">Super Admin</span>
          </div>
        }
      </div>

      <!-- NAVIGATION -->
      <nav class="sidebar__nav">
        @for (group of navGroups; track group.label) {
          @if (!collapsed) {
            <div class="sidebar__group-label">{{ group.label }}</div>
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

      <!-- COLLAPSE BUTTON -->
      <button
        class="sidebar__collapse"
        (click)="toggleCollapse()"
        [attr.aria-label]="collapsed ? 'Déplier le menu' : 'Replier le menu'"
      >
        <span [innerHTML]="(collapsed ? iconChevronRight : iconChevronLeft) | safeHtml"></span>
        @if (!collapsed) {
          <span>Replier</span>
        }
      </button>

      <!-- USER FOOTER -->
      @if (!collapsed) {
        <div class="sidebar__footer">
          <div class="sidebar__user">
            <div class="sidebar__user-avatar">SA</div>
            <div class="sidebar__user-info">
              <div class="sidebar__user-name">Super Admin</div>
              <div class="sidebar__user-email">admin&#64;alternia.io</div>
            </div>
          </div>
        </div>
      }
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
      transition: width var(--t-slow);
      overflow: hidden;

      &--collapsed {
        width: var(--sidebar-collapsed);
      }
    }

    /* ── LOGO ─────────────────────────────────────────────────── */
    .sidebar__logo {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 12px;
      border-bottom: 1px solid var(--c-border-light);
      min-height: 60px;
      flex-shrink: 0;
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
      font-family: var(--font-tight);
      font-size: 15px;
      font-weight: 700;
      color: var(--c-text);
      letter-spacing: -0.03em;
      line-height: 1;
      white-space: nowrap;
    }

    .sidebar__logo-tag {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--c-brand);
      margin-top: 3px;
      white-space: nowrap;
    }

    /* ── NAVIGATION ───────────────────────────────────────────── */
    .sidebar__nav {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 10px 8px;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .sidebar__group-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.10em;
      text-transform: uppercase;
      color: var(--c-muted);
      padding: 10px 8px 4px;
      white-space: nowrap;
    }

    .sidebar__separator {
      height: 1px;
      background: var(--c-border-light);
      margin: 6px 0;
    }

    .sidebar__item {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 6px 8px; // Adjusted for border
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
          color: var(--c-text);
        }
      }

      &--active {
        background: var(--c-surface-alt);
        color: var(--c-text);
        font-weight: 600;
        border-color: var(--c-border); // Trait fin
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);

        .sidebar__item-icon {
          color: var(--c-brand); // Icône accentuée
        }
      }
    }

    .sidebar__item-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      color: var(--c-subtle);
      transition: color var(--t-fast);

      ::ng-deep svg {
        width: 16px;
        height: 16px;
        stroke-width: 1.75;
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

    /* ── COLLAPSE BUTTON ──────────────────────────────────────── */
    .sidebar__collapse {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 14px;
      border: none;
      background: transparent;
      color: var(--c-subtle);
      font-size: 12px;
      font-weight: 500;
      font-family: var(--font-sans);
      cursor: pointer;
      border-top: 1px solid var(--c-border-light);
      transition: color var(--t-fast);
      text-align: left;
      width: 100%;

      &:hover { color: var(--c-text); }

      ::ng-deep svg { width: 14px; height: 14px; }
    }

    /* ── USER FOOTER ──────────────────────────────────────────── */
    .sidebar__footer {
      padding: 10px 10px;
      border-top: 1px solid var(--c-border-light);
      flex-shrink: 0;
    }

    .sidebar__user {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 4px;
      border-radius: var(--r-md);
      cursor: pointer;
      transition: background var(--t-fast);

      &:hover { background: var(--c-surface); }
    }

    .sidebar__user-avatar {
      width: 30px;
      height: 30px;
      border-radius: var(--r-md);
      background: linear-gradient(135deg, var(--c-brand) 0%, var(--c-cyan) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      flex-shrink: 0;
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

    /* ── TOOLTIP MODE COMPACT ─────────────────────────────────── */
    .sidebar--collapsed .sidebar__item[data-tooltip] {
      position: relative;

      &::after {
        content: attr(data-tooltip);
        position: absolute;
        left: calc(100% + 12px);
        top: 50%;
        transform: translateY(-50%);
        background: var(--c-text);
        color: var(--c-white);
        padding: 5px 10px;
        border-radius: var(--r-md);
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--t-fast);
        z-index: 200;
        box-shadow: var(--s-md);
      }

      &:hover::after { opacity: 1; }
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
