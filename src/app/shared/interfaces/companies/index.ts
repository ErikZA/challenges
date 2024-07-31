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

export type NodeAsset = Partial<Asset> & {
  children: TreeOfAssets;
  type: Types;
};

export type Types =
  | 'COMPANY'
  | 'LOCATION'
  | 'SUB-LOCATION'
  | 'SENSOR'
  | 'ASSET';

export interface TreeOfAssets {
  [key: string]: NodeAsset;
}
