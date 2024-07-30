import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CompaniesService } from '@app/shared/services/companies';

import { map } from 'rxjs';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesComponent implements OnInit {
  private companiesService = inject(CompaniesService);
  public selectedCompany = signal<string | null>(null);

  public async ngOnInit() {
    console.log('jeusus - 1');
    this.companiesService.loadTreeOfAssets();
    console.log('jeusus - 2');
    this.companiesService.onLoadLocationsByCompanyId();
    console.log('jeusus - 3');
    this.listOfAssets$.subscribe(list => {
      console.log('jeusus', list);
    });
  }

  public get isLoading$() {
    return this.companiesService.isLoading$;
  }

  public get listOfAssets$() {
    return this.companiesService.listOfAssets$;
  }

  public get companies$() {
    return this.listOfAssets$.pipe(map(companies => Object.values(companies)));
  }

  public toggleAccordion(companyId?: string) {
    this.selectedCompany.set(companyId || null);
  }

  public get showAccordion() {
    return this.selectedCompany();
  }
}
