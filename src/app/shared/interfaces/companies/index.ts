export interface Asset {
  id: string;
  name: string;
  parentId: string | null;
  sensorId: string;
  sensorType: string;
  status: string;
  gatewayId: string;
  locationId: string | null;
}

export type Companies = Array<Pick<Asset, 'id' | 'name'>>;

export type Locations = Array<Pick<Asset, 'id' | 'name' | 'parentId'>>;

export type Assets = Array<Asset>;

export type TreeOfAssets = Array<{
  company: Companies[0];
  children: Array<{
    company: TreeOfAssets[0];
    location: Locations[0];
    children: Array<Asset>;
  }>;
}>;
