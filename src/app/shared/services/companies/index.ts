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

import { distinctUntilChanged, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private baseUrl = environment.api;
  public listCompanies$: ReplaySubject<TreeOfAssets> =
    new ReplaySubject<TreeOfAssets>(1);
  private listOfLocations$: ReplaySubject<TreeOfAssets> =
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

  public onLoadLocationsByCompanyId() {
    this.isLoading$.next(true);
    this.listCompanies$.pipe(distinctUntilChanged()).subscribe(companies => {
      const keys = Object.keys(companies);

      for (const key of keys) {
        this.getLocationsByCompanyId(key)
          .subscribe(l => {
            const { locations, subLocations } = this.categorizeLocations(l);

            this.populateLocations(locations, companies, key);

            this.populateSubLocations(subLocations, companies, key);

            this.listOfLocations$.next(companies);
          })
          .add(() => this.isLoading$.next(false));
      }
    });
  }

  public onLoadAssetsByCompanyId() {
    this.isLoading$.next(true);
    this.listCompanies$.pipe(distinctUntilChanged()).subscribe(companies => {
      const keys = Object.keys(companies);

      for (const key of keys) {
        this.getAssetsByCompanyId(key)
          .subscribe(assets => {
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

            this.listOfAssets$.next(companies);
          })
          .add(() => this.isLoading$.next(false));
      }
    });
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
    this.listOfLocations$ = new ReplaySubject<TreeOfAssets>(size);
    this.listOfAssets$ = new ReplaySubject<TreeOfAssets>(size);
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
}
