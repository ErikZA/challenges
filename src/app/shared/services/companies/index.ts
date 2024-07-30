import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assets, Companies, Locations, TreeOfAssets } from '@app/shared/interfaces/companies';
import { environment } from '@env/environment';

import { delay, pipe, ReplaySubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private baseUrl = environment.api;

  public listOfAssets$: ReplaySubject<TreeOfAssets> = new ReplaySubject<TreeOfAssets>(1);
  public isLoading$ = new ReplaySubject<boolean>(1);

  constructor(private http: HttpClient) {}

  public listCompanies() {
    return this.http.get<Companies>(`${this.baseUrl}/companies`);
  }

  public getLocationsByCompanyId(id: string) {
    return this.http.get<Locations>(`${this.baseUrl}/companies/${id}/locations`);
  }

  public getAssetsByCompanyId(id: string) {
    return this.http.get<Assets>(`${this.baseUrl}/companies/${id}`);
  }

  public loadTreeOfAssets() {
    this.isLoading$.next(true);
    this.listCompanies()
      .pipe(delay(4000))
      .subscribe(companies => {
        const treeOfAssets = companies.reduce((acc, company) => {
          acc[company.id] = { ...company, children: {} };

          return acc;
        }, {} as TreeOfAssets);

        this.listOfAssets$.next(treeOfAssets);
      })
      .add(() => {
        this.isLoading$.next(false);
      });
  }

  public onLoadLocationsByCompanyId() {
    this.isLoading$.next(true);
    this.listOfAssets$
      .pipe(take(1))
      .subscribe(oldCompanies => {
        const keys = Object.keys(oldCompanies);

        for (const key of keys) {
          this.getLocationsByCompanyId(key).subscribe(locations => {
            const haveParents = locations.filter(location => location.parentId);
            const dontHaveParents = locations.filter(location => !location.parentId);

            const newTreeOfAssets = dontHaveParents.reduce((acc, company) => {
              acc[company.id] = { ...company, children: {} };

              return acc;
            }, oldCompanies);

            const aggregatedTree = haveParents.reduce((acc, location) => {
              if (newTreeOfAssets[location.parentId as string]) {
                newTreeOfAssets[location.parentId as string].children[location.id] = { ...location, children: {} };
              } else {
                acc[location.id] = { ...location, children: {} };
              }

              return acc;
            }, newTreeOfAssets);

            this.listOfAssets$.next(aggregatedTree);
          });
        }
      })
      .add(() => {
        this.isLoading$.next(false);
      });
  }
}
