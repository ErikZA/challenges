import { Routes } from '@angular/router';
import { RoutesEnum } from '@shared/interfaces/routes-enum';

import { CompaniesComponent } from './pages/companies/companies.component';

export const routes: Routes = [
  {
    path: RoutesEnum.locations,
    component: CompaniesComponent,
  },
  {
    path: RoutesEnum.locationsByCompanyId,
    component: CompaniesComponent,
  },
];
