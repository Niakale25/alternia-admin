import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.sidebar--collapsed]="collapsed">

      <!-- LOGO -->
      <div class="sidebar__logo">
        <div class="sidebar__logo-mark">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#314999"/>
            <path d="M14 5L22 22H6L14 5Z" fill="white" opacity="0.9"/>
            <path d="M14 10L19 22H9L14 10Z" fill="#40BBCC" opacity="0.7"/>
          </svg>
        </div>
        @if (!collapsed) {
          <div class="sidebar__logo-text">
            <span class="sidebar__logo-name">Alternia</span>
            <span class="sidebar__logo-role">Super Admin</span>
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
              <span class="sidebar__item-icon" [innerHTML]="item.icon"></span>
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
      <button class="sidebar__collapse" (click)="toggleCollapse()" [attr.aria-label]="collapsed ? 'Déplier' : 'Replier'">
        <span [innerHTML]="collapsed ? iconChevronRight : iconChevronLeft"></span>
        @if (!collapsed) {
          <span>Replier</span>
        }
      </button>

      <!-- FOOTER -->
      @if (!collapsed) {
        <div class="sidebar__footer">
          <div class="sidebar__user">
            <div class="sidebar__user-avatar">SA</div>
            <div class="sidebar__user-info">
              <div class="sidebar__user-name">Super Admin</div>
              <div class="sidebar__user-role">admin&#64;alternia.io</div>
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

    .sidebar__logo {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 14px;
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

    .sidebar__logo-role {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--c-brand);
      margin-top: 2px;
      white-space: nowrap;
    }

    .sidebar__nav {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .sidebar__group-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--c-subtle);
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
      padding: 8px 9px;
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
        background: var(--c-surface);
        color: var(--c-text);
      }

      &--active {
        background: var(--c-brand-bg);
        color: var(--c-brand);

        .sidebar__item-icon {
          color: var(--c-brand);
        }

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 4px;
          bottom: 4px;
          width: 3px;
          background: var(--c-brand);
          border-radius: 0 var(--r-xs) var(--r-xs) 0;
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

    .sidebar__footer {
      padding: 10px 12px;
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
      truncate: true;
    }

    .sidebar__user-role {
      font-size: 11px;
      color: var(--c-subtle);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Tooltip for collapsed mode */
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

  readonly navGroups: NavGroup[] = [
    {
      label: 'Principale',
      items: [
        {
          label: 'Centre de Commandement',
          route: '/commandement',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`
        },
        {
          label: 'Boîtiers',
          route: '/boitiers',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
        },
        {
          label: 'Établissements',
          route: '/etablissements',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
        },
        {
          label: 'Parents',
          route: '/parents',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
        }
      ]
    },
    {
      label: 'Commercial',
      items: [
        {
          label: 'Licences & Abonnements',
          route: '/licences',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`
        }
      ]
    },
    {
      label: 'Technique',
      items: [
        {
          label: 'Intelligence Artificielle',
          route: '/ia',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5 5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z"/><path d="M9 13v1a3 3 0 0 0 6 0v-1"/><path d="M6.5 21h11"/><path d="M12 17v4"/></svg>`
        },
        {
          label: 'Infrastructure Cloud',
          route: '/infrastructure',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`
        },
        {
          label: 'Déploiements',
          route: '/deploiements',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
        },
        {
          label: 'Maintenance & Support',
          route: '/maintenance',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
          badge: 3
        }
      ]
    },
    {
      label: 'Données',
      items: [
        {
          label: 'Analytics Globales',
          route: '/analytics',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>`
        }
      ]
    }
  ];
}
