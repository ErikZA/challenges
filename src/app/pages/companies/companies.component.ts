import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CustomButtonComponent } from '@app/components/button/custom-button/custom-button/custom-button.component';
import { CompaniesService } from '@app/shared/services/companies';

import { map } from 'rxjs';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, CustomButtonComponent],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
})
export class CompaniesComponent implements OnInit {
  private companiesService = inject(CompaniesService);
  public selectedCompany = signal<string | null>(null);

  public filterEnergySensorActive = signal<boolean>(false);
  public filterCriticalSensorActive = signal<boolean>(false);

  public async ngOnInit() {
    // this.companiesService.onLoadLocationsByCompanyId();
    // this.companiesService.onLoadAssetsByCompanyId();
    this.isLoading$.subscribe(assets => {
      this.listOfAssets$.subscribe(assets => {
        console.log(assets);
        // console.log(this.companiesService.lockArray);
      });
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

  public get nameCompany() {
    return 'Company Name';
  }

  public get activeStyle() {
    return 'bg-darkBlue-200 hover:bg-darkBlue-300 text-gray-50';
  }
}
