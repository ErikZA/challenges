export interface Asset {
  id: string;
  name: string;
  parentId: string | null;
  sensorId: string;
  sensorType: 'energy' | string | null;
  status: 'alert' | string | null;
  gatewayId: string;
  locationId: string | null;
  space?: number;
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
