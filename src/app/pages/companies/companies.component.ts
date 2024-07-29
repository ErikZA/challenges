import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CompaniesService } from '@app/shared/services/companies';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesComponent implements OnInit {
  private companiesService = inject(CompaniesService);

  public async ngOnInit() {
    this.companiesService.loadTreeOfAssets();
  }

  public get isLoading$() {
    return this.companiesService.isLoading$;
  }

  public get listOfAssets$() {
    return this.companiesService.listOfAssets$;
  }
}
