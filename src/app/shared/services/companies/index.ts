import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assets, Companies, Locations, TreeOfAssets } from '@app/shared/interfaces/companies';
import { environment } from '@env/environment';

import { delay, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private baseUrl = environment.api;

  public listOfAssets$!: ReplaySubject<TreeOfAssets>;
  public isLoading$ = new ReplaySubject<boolean>(1);

  constructor(private http: HttpClient) {}

  public listCompanies() {
    return this.http.get<Companies>(`${this.baseUrl}/companies`);
  }

  public getLocationsByCompanyId(id: string) {
    return this.http.get<Locations>(`${this.baseUrl}/companies/${id}`);
  }

  public getAssetsByCompanyId(id: string) {
    return this.http.get<Assets>(`${this.baseUrl}/companies/${id}`);
  }

  public loadTreeOfAssets() {
    this.isLoading$.next(true);
    this.listCompanies()
      .subscribe(companies => {
        const treeOfAssets: TreeOfAssets = companies.map(company => {
          return {
            company,
            children: [],
          };
        });

        this.listOfAssets$ = new ReplaySubject<TreeOfAssets>(companies.length);
        this.listOfAssets$.next(treeOfAssets);
      })
      .add(() => {
        this.isLoading$.next(false);
      });
  }
}
