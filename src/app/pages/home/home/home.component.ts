import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from '@app/components/nav-bar/nav-bar/nav-bar.component';
import { TreeOfAssets } from '@app/shared/interfaces/companies';
import { MenuItems } from '@app/shared/interfaces/core/menu.interface';
import { RoutesEnum } from '@app/shared/interfaces/routes-enum';
import { CompaniesService } from '@app/shared/services/companies';

import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private companiesService = inject(CompaniesService);
  private changeRef = inject(ChangeDetectorRef);

  public async ngOnInit() {
    this.updateCompaniesUI();
    this.companiesService.loadCompanies();
  }

  private updateCompaniesUI() {
    this.changeRef.detectChanges();
    this.companiesService.isLoading$.subscribe(() => {
      this.changeRef.detectChanges();
    });
  }

  public get loadingStatus() {
    return this.companiesService.isLoading$;
  }

  public ngOnDestroy(): void {
    this.companiesService.isLoading$.unsubscribe();
  }

  public get companies$() {
    return this.companiesService.listCompanies$.pipe(
      map(companies => this.mapCompaniesToMenuItems(companies))
    );
  }

  private mapCompaniesToMenuItems(companies: TreeOfAssets): MenuItems[] | null {
    if (!companies) {
      return null;
    } else {
      return Object.values(companies).map(company => {
        return {
          title: company.name,
          link: `${RoutesEnum.locations}/${company.id}`,
        } as MenuItems;
      });
    }
  }
}
