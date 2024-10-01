import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { VirtualListComponent } from '@app/components/list/virtual-list/virtual-list.component';
import { NodeAsset, TreeOfAssets } from '@app/shared/interfaces/companies';
import { ActiveFilter } from '@app/shared/interfaces/core/menu.interface';
import { CompaniesService } from '@app/shared/services/companies';

import { firstValueFrom } from 'rxjs';

import { DetailsComponent } from './components/details/details.component';
import { FormComponent } from './components/form/form.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FormComponent,
    DetailsComponent,
    VirtualListComponent,
  ],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
})
export class CompaniesComponent implements OnInit {
  public selectedCompany = signal<string | null>(null);
  public selectedChields = signal<TreeOfAssets | null>(null);
  public searchWord = signal<string>('');
  public company = signal<NodeAsset | null>(null);
  public activeFilter = signal<ActiveFilter | null>(null);

  private router = inject(ActivatedRoute);
  private companiesService = inject(CompaniesService);

  public async ngOnInit() {
    this.onCurrentCompany();
    this.loadCurrentCompanyChildren();
  }

  public get isLoading$() {
    return this.companiesService.isLoading$;
  }

  public get listOfAssets$() {
    return this.companiesService.listOfAssets$;
  }

  public get filteredAssetsCritical() {
    return this.companiesService.criticalAssets;
  }

  public get filteredAssetsEnergy() {
    return this.companiesService.energyAssets;
  }

  public get filteredAssetsEnergyCritical() {
    return this.companiesService.criticalAndEnergyAssets;
  }

  private get chieldsOfCompany() {
    return this.companiesService.getChieldsOfCompany(this.company()?.id || '');
  }

  public loadCurrentCompanyChildren() {
    this.companiesService.listOfAssets$.subscribe(async () => {
      this.selectedChields.set(null);
      if (!this.company()?.id) return;

      await this.changeFilter(this.activeFilter());
    });
  }

  public get showList() {
    return !!this.selectedChields();
  }

  private get companies() {
    return firstValueFrom(this.companiesService.listCompanies$);
  }

  private onCurrentCompany() {
    this.router.paramMap.subscribe(async (params: Params) => {
      const { id } = params['params'];
      const companies = await this.companies;

      const current = companies[id];

      this.company.set(current);
      this.companiesService.onLoadAssets(current.id);
    });
  }

  public toggleAccordion(companyId?: string) {
    this.selectedCompany.set(companyId || null);
  }

  public get showAccordion() {
    return this.selectedCompany();
  }

  public async changeFilter(props: ActiveFilter | null) {
    this.activeFilter.set(props);
    if (props?.energy && props?.critical) {
      this.selectedChields.set(this.filteredAssetsEnergyCritical);
    } else if (props?.energy) {
      this.selectedChields.set(this.filteredAssetsEnergy);
    } else if (props?.critical) {
      this.selectedChields.set(this.filteredAssetsCritical);
    } else {
      this.selectedChields.set(await this.chieldsOfCompany);
    }
  }

  public onSubmit(props: { search: string }) {
    this.searchWord.set(props.search);
  }
}
