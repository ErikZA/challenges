import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MenuItems } from '@app/shared/interfaces/core/menu.interface';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  @Input() public menus: MenuItems[] | null = [];

  public isNavbarCollapsed = true;
  public activeMenu: string | null = null;

  private router = inject(Router);

  constructor() {
    this.onCollapseNavbar();
    this.onGetActiveMenu();
  }

  private onGetActiveMenu() {
    this.router.events.subscribe(() => {
      this.activeMenu = this.router.url.slice(1);
    });
  }

  private onCollapseNavbar() {
    this.router.events.subscribe(() => {
      this.isNavbarCollapsed = true;
    });
  }

  public toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
