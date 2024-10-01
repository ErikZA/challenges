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

import { delay, ReplaySubject, firstValueFrom, take, first } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private baseUrl = environment.api;

  public listCompanies$ = new ReplaySubject<TreeOfAssets>(1);
  public listOfLocations$ = new ReplaySubject<TreeOfAssets>(1);
  public listOfAssets$ = new ReplaySubject<TreeOfAssets>(1);

  public isLoading$ = new ReplaySubject<boolean>(1);

  /**
   * @description List of assets filtered by critical status
   */
  private listOfCriticalAssets: TreeOfAssets | null = null;

  /**
   * @description List of assets filtered by energy sensor type
   */
  private listOfEnergyAssets: TreeOfAssets | null = null;

  /**
   * @description List of assets filtered by critical status and energy sensor type
   */
  private listOfCriticalAndEnergyAssets: TreeOfAssets | null = null;

  constructor(private http: HttpClient) {}

  public get criticalAssets() {
    return this.listOfCriticalAssets;
  }

  public get energyAssets() {
    return this.listOfEnergyAssets;
  }

  public get criticalAndEnergyAssets() {
    return this.listOfCriticalAndEnergyAssets;
  }

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

  /**
   * @description Load companies and populate the list of companies;
   * @summary This method loads the list of companies, this companies will be used to populate the header of the page.
   */
  public loadCompanies() {
    this.isLoading$.next(true);
    this.listCompanies()
      .subscribe(companies => {
        const response = this.buildCompanyTree(companies);

        this.listCompanies$.next(response);
      })
      .add(() => this.isLoading$.next(false));
  }

  /**
   * @description Load assets and locations by company id;
   * @summary This method receives a company id and load the locations and assets of this company.
   * It will show a alert if the company id is not provided. It will also reset the asset lists.
   * It will populate the list of locations and assets.
   * */
  public onLoadAssets(key?: string | null) {
    if (!key) {
      alert('Please select a company');

      return;
    }
    this.resetAssetLists();

    this.onLoadLocationsByCompanyId(key);

    this.isLoading$.next(true);
    this.listOfLocations$
      .pipe(first())
      .subscribe(() => this.onLoadAssetsByCompanyId(key));
  }

  /**
   * @description Reset the asset lists;
   * @summary This method reset the list of critical assets, energy assets and critical and energy assets.
   */
  private resetAssetLists() {
    this.listOfCriticalAssets = null;
    this.listOfEnergyAssets = null;
    this.listOfCriticalAndEnergyAssets = null;
  }

  /**
   * @description Load locations by company id; This method receives a company id and load the locations of this company.
   * @summary When the locations are loaded, it will categorize the locations into locations and sub-locations.
   */
  private onLoadLocationsByCompanyId(key: string) {
    this.getLocationsByCompanyId(key).subscribe(l => {
      this.listCompanies$.pipe(take(1)).subscribe(companies => {
        const { locations, subLocations } = this.categorizeLocations(l);

        this.populateLocations(locations, companies, key);

        this.populateSubLocations(subLocations, companies, key);

        this.listOfLocations$.next(companies);
      });
    });
  }

  /**
   * @description Load assets by company id; This method receives a company id and load the assets of this company.
   * @summary When the assets are loaded, it will filter the assets into assets with parent, assets with location, sensors without location and sensors with location.
   * After that, it will populate the sensors without location,
   * the location assets, the assets parents and the sensors with location.
   */
  private onLoadAssetsByCompanyId(key: string) {
    this.getAssetsByCompanyId(key).subscribe(assets => {
      this.listCompanies$
        .pipe(take(1))
        .pipe(delay(500))
        .subscribe(companies => {
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
    });
  }

  /**
   * @description Populate sensors; This method receives a list of sensors and populate the sensors into the companies tree.
   * @summary Using the method populateNode, it will populate the sensors into the companies tree.
   */
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

  /**
   * @description Build a tree of companies;
   * @summary This method receives a list of companies and transform it into a tree of companies that are composed an hash that is the key of the company and the value is the company itself.
   * */
  private buildCompanyTree(companies: Companies) {
    return companies.reduce((acc, company) => {
      acc[company.id] = { ...company, children: {}, type: 'COMPANY' };

      return acc;
    }, {} as TreeOfAssets);
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

  /**
   * @description Populate a node; This method receives a node and call the recursive getKeyOfNodesOfChild method to get the keys of the nodes util the index is found.
   * @summary If the path is found, the node will be inserted into the companies tree and the filtered lists will be updated.
   * If the keys are not found, the node will not be inserted into the companies tree.
   */
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

      this.updateFilteredList(asset, companies, key, keys, node);

      return true;
    } else {
      return false;
    }
  }

  private updateFilteredList(
    asset: Asset,
    companies: TreeOfAssets,
    key: string,
    keys: string[],
    node: TreeOfAssets
  ) {
    if (asset.sensorType === 'energy')
      this.updateEnergyAssetsList(asset, companies, key, [...keys], node);

    if (asset.status === 'alert')
      this.updateListOfCriticalAssets(asset, companies, key, [...keys], node);

    if (asset.sensorType === 'energy' && asset.status === 'alert') {
      this.updateListOfCriticalAndEnergyAssets(
        asset,
        companies,
        key,
        [...keys],
        node
      );
    }
  }

  private updateListOfCriticalAndEnergyAssets(
    asset: Asset,
    companies: TreeOfAssets,
    key: string,
    keys: string[],
    node: TreeOfAssets
  ) {
    this.listOfCriticalAndEnergyAssets = {
      ...this.listOfCriticalAndEnergyAssets,
      ...this.pickFilteredAsset(
        this.listOfCriticalAndEnergyAssets,
        companies[key].children,
        keys,
        node[asset.id]
      ),
    };
  }

  private updateEnergyAssetsList(
    asset: Asset,
    companies: TreeOfAssets,
    key: string,
    keys: string[],
    node: TreeOfAssets
  ) {
    this.listOfEnergyAssets = {
      ...this.listOfEnergyAssets,
      ...this.pickFilteredAsset(
        this.listOfEnergyAssets,
        companies[key].children,
        keys,
        node[asset.id]
      ),
    };
  }

  private updateListOfCriticalAssets(
    asset: Asset,
    companies: TreeOfAssets,
    key: string,
    keys: string[],
    node: TreeOfAssets
  ) {
    this.listOfCriticalAssets = {
      ...this.listOfCriticalAssets,
      ...this.pickFilteredAsset(
        this.listOfCriticalAssets,
        companies[key].children,
        keys,
        node[asset.id]
      ),
    };
  }

  private pickFilteredAsset(
    listOfAsset: TreeOfAssets | null,
    rootNode: TreeOfAssets,
    keys: string[],
    asset: NodeAsset
  ) {
    let nextRootNode = rootNode;
    let memoryFilteredNode = listOfAsset;

    keys.forEach((k, i, arr) => {
      if (!listOfAsset) {
        listOfAsset = {
          [k]: { ...nextRootNode[k], children: {} },
        } as TreeOfAssets;
        memoryFilteredNode = listOfAsset;
      } else if (!!listOfAsset && !listOfAsset[k] && !!nextRootNode) {
        listOfAsset[k] = {
          ...nextRootNode[k],
          children: {},
        };
      }

      if (i === arr.length - 1 && listOfAsset && i !== 0) {
        listOfAsset[k].children[asset.id as string] = asset;
      }

      nextRootNode = nextRootNode[k].children;
      listOfAsset = listOfAsset ? listOfAsset[k].children : null;
    });

    return memoryFilteredNode;
  }

  /**
   * @description The method receives a root node and an index and return the keys of the nodes that are children of the root node.
   */
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
      const asset = {
        ...sensor,
        children: {},
        type: 'SENSOR',
      };

      companies[key].children[sensor.id] = asset as NodeAsset;
      this.updateFilteredList(
        sensor,
        companies,
        key,
        [sensor.id],
        companies[key].children[sensor.id] as any
      );
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
