import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { VirtualListComponent } from '@app/components/list/virtual-list/virtual-list.component';
import { NodeAsset, TreeOfAssets } from '@app/shared/interfaces/companies';
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
  private companiesService = inject(CompaniesService);
  public selectedCompany = signal<string | null>(null);
  public selectedChields = signal<TreeOfAssets | null>(null);

  public company = signal<NodeAsset | null>(null);

  private router = inject(ActivatedRoute);

  public async ngOnInit() {
    this.onCurrentCompany();
  }

  public get isLoading$() {
    return this.companiesService.isLoading$;
  }

  public get listOfAssets$() {
    return this.companiesService.listOfAssets$;
  }

  public loadCurrentCompanyChildren() {
    this.companiesService.listOfAssets$.subscribe(async () => {
      console.log('loadCurrentCompanyChildren');
      if (!this.company()?.id) return;
      this.selectedChields.set(
        await this.companiesService.getChieldsOfCompany(
          this.company()?.id || ''
        )
      );
    });
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
      this.loadCurrentCompanyChildren();
    });
  }

  public toggleAccordion(companyId?: string) {
    this.selectedCompany.set(companyId || null);
  }

  public get showAccordion() {
    return this.selectedCompany();
  }

  public onSubmit() {
    console.log('Submit');
  }
}
