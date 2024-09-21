import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Asset,
  Assets,
  Companies,
  Locations,
  NodeAsset,
  TreeOfAssets,
  Types,
} from '@app/shared/interfaces/companies';
import { environment } from '@env/environment';

import { delay, ReplaySubject, firstValueFrom } from 'rxjs';

import { motorOne, motorThree, motorTwo } from './mock';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private baseUrl = environment.api;
  private _currentCompany_id: string | null = null;

  public listCompanies$: ReplaySubject<TreeOfAssets> =
    new ReplaySubject<TreeOfAssets>(1);
  public listOfLocations$: ReplaySubject<TreeOfAssets> =
    new ReplaySubject<TreeOfAssets>(1);
  public listOfAssets$: ReplaySubject<TreeOfAssets> =
    new ReplaySubject<TreeOfAssets>(1);

  public isLoading$ = new ReplaySubject<boolean>(1);

  constructor(private http: HttpClient) {}

  public listCompanies() {
    return this.http.get<Companies>(`${this.baseUrl}/companies`);
  }

  public getLocationsByCompanyId(id: string) {
    return this.http.get<Locations>(
      `${this.baseUrl}/companies/${id}/locations`
    );
  }

  public getAssetsByCompanyId(id: string) {
    return this.http.get<Assets>(`${this.baseUrl}/companies/${id}/assets`);
  }

  public loadCompanies() {
    this.isLoading$.next(true);
    this.listCompanies()
      .subscribe(companies => {
        const response = this.buildCompanyTree(companies);

        this.listCompanies$.next(response);
        this.initLists(companies.length);
      })
      .add(() => this.isLoading$.next(false));
  }

  public onLoadAssets(key?: string | null) {
    if (!key) {
      alert('Please select a company');

      return;
    }
    this.isLoading$.next(true);
    this.onLoadLocationsByCompanyId(key);
    this.listOfLocations$.subscribe(() => this.onLoadAssetsByCompanyId(key));
  }

  private onLoadLocationsByCompanyId(key: string) {
    this.getLocationsByCompanyId(key).subscribe(l => {
      this.listCompanies$.subscribe(companies => {
        const { locations, subLocations } = this.categorizeLocations(l);

        this.populateLocations(locations, companies, key);

        this.populateSubLocations(subLocations, companies, key);

        this.listOfLocations$.next(companies);
      });
    });
  }

  public async searchMockedAssets(value: string) {
    this.isLoading$.next(true);

    let result;

    if (value.endsWith('a') || value.endsWith('d') || value.endsWith('f')) {
      result = firstValueFrom(motorOne.pipe(delay(1000)));
    } else if (
      value.endsWith('1') ||
      value.endsWith('2') ||
      value.endsWith('3')
    ) {
      result = firstValueFrom(motorTwo.pipe(delay(2000)));
    } else {
      result = firstValueFrom(motorThree.pipe(delay(3000)));
    }

    this.isLoading$.next(false);

    return result as unknown as NodeAsset;
  }

  private onLoadAssetsByCompanyId(key: string) {
    this.getAssetsByCompanyId(key)
      .subscribe(assets => {
        this.listCompanies$.subscribe(companies => {
          console.time('start-end');

          const {
            sensorWithoutLocation,
            assetsWithLocation,
            assetsWithParent,
            sensorWithLocation,
          } = this.filterAssets(assets);

          this.populateSensorsWithoutLocation(
            sensorWithoutLocation,
            companies,
            key
          );

          this.populateLocationAssets(assetsWithLocation, companies, key);

          this.populateAssetsParents(assetsWithParent, companies, key);

          this.populateSensors(sensorWithLocation, companies, key);

          console.timeEnd('start-end');
          this.listOfAssets$.next(companies);
        });
      })
      .add(() => this.isLoading$.next(false));
  }

  private populateSensors(
    assets: Assets,
    companies: TreeOfAssets,
    key: string
  ) {
    assets.forEach(asset => {
      if (asset.parentId) {
        this.populateNode(companies, key, asset, `${asset.parentId}`, 'SENSOR');
      } else if (asset.locationId) {
        this.populateNode(
          companies,
          key,
          asset,
          `${asset.locationId}`,
          'SENSOR'
        );
      }
    });
  }

  private populateAssetsParents(
    assets: Assets,
    companies: TreeOfAssets,
    key: string
  ) {
    assets.forEach(asset =>
      this.populateNode(companies, key, asset, `${asset.parentId}`, 'ASSET')
    );
  }

  private buildCompanyTree(companies: Companies) {
    return companies.reduce((acc, company) => {
      acc[company.id] = { ...company, children: {}, type: 'COMPANY' };

      return acc;
    }, {} as TreeOfAssets);
  }

  private initLists(size: number) {
    // this.listOfLocations$ = new ReplaySubject<TreeOfAssets>(size);
    // this.listOfAssets$ = new ReplaySubject<TreeOfAssets>(size);
  }

  private populateLocationAssets(
    assets: Assets,
    companies: TreeOfAssets,
    key: string
  ) {
    assets.forEach(asset =>
      this.populateNode(companies, key, asset, `${asset.locationId}`, 'ASSET')
    );
  }

  private populateNode(
    companies: TreeOfAssets,
    key: string,
    asset: Asset,
    index: string,
    type: Types
  ) {
    const keys = this.getKeyOfNodesOfChild(companies[key], index).reverse();

    if (keys.length) {
      let node = companies[key].children;

      keys.forEach(k => {
        node = node[k].children;
      });

      node[asset.id] = { ...asset, children: {}, type };

      return true;
    } else {
      return false;
    }
  }

  private getKeyOfNodesOfChild(arg0: NodeAsset, index: string): string[] {
    for (const key in arg0.children) {
      if (key === index) {
        return [key];
      }

      const result = this.getKeyOfNodesOfChild(arg0.children[key], index);

      if (result.length) {
        return [...result, key];
      }
    }

    return [];
  }

  private populateSensorsWithoutLocation(
    assets: Assets,
    companies: TreeOfAssets,
    key: string
  ) {
    assets.forEach(sensor => {
      companies[key].children[sensor.id] = {
        ...sensor,
        children: {},
        type: 'SENSOR',
      };
    });
  }

  private populateSubLocations(
    subLocations: Pick<Asset, 'id' | 'name' | 'parentId'>[],
    companies: TreeOfAssets,
    key: string
  ) {
    const subLocationsWithoutParent = [] as Locations;
    let node = companies[key];

    subLocations.forEach(company => {
      if (node.children[company.parentId as string]) {
        node.children[company.parentId as string].children[company.id] = {
          ...company,
          children: {},
          type: 'SUB-LOCATION',
        };
        node = node.children[company.parentId as string];
      } else {
        const res = this.populateNode(
          companies,
          key,
          company as Asset,
          company.parentId as string,
          'SUB-LOCATION'
        );

        if (!res) {
          subLocationsWithoutParent.push(company);
        }
      }
    });

    if (subLocationsWithoutParent.length) {
      this.populateSubLocations(subLocationsWithoutParent, companies, key);
    }
  }

  private populateLocations(
    dontHaveParents: Pick<Asset, 'id' | 'name' | 'parentId'>[],
    companies: TreeOfAssets,
    key: string
  ) {
    dontHaveParents.forEach(company => {
      companies[key].children[company.id] = {
        ...company,
        children: {},
        type: 'LOCATION',
      };
    });
  }

  private categorizeLocations(allLocations: Locations) {
    const { locations, subLocations } = allLocations.reduce(
      (acc, location) => {
        if (
          location.parentId &&
          allLocations.find(l => l.id === location.parentId)
        ) {
          acc.subLocations.push(location);
        } else {
          acc.locations.push(location);
        }

        return acc;
      },
      { locations: [] as Locations, subLocations: [] as Locations }
    );

    return { locations, subLocations };
  }

  private filterAssets(assets: Assets) {
    const filteredAssets = assets.reduce(
      (acc, asset) => {
        if (asset.parentId && !asset.sensorId) {
          acc.assetsWithParent.push(asset);
        } else if (asset.locationId && !asset.sensorId) {
          acc.assetsWithLocation.push(asset);
        } else if (!asset.locationId && !asset.parentId && asset.sensorId) {
          acc.sensorWithoutLocation.push(asset);
        } else if (asset.sensorId && (asset.locationId || asset.parentId)) {
          acc.sensorWithLocation.push(asset);
        }

        return acc;
      },
      {
        assetsWithParent: [] as Assets,
        assetsWithLocation: [] as Assets,
        sensorWithoutLocation: [] as Assets,
        sensorWithLocation: [] as Assets,
      }
    );

    const {
      assetsWithParent,
      assetsWithLocation,
      sensorWithoutLocation,
      sensorWithLocation,
    } = filteredAssets;

    return {
      sensorWithoutLocation,
      assetsWithLocation,
      assetsWithParent,
      sensorWithLocation,
    };
  }

  public async getChieldsOfCompany(id: string) {
    const companies = await firstValueFrom(this.listCompanies$);

    return companies[id].children;
  }
}
