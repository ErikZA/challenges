import { RoutesEnum } from '@shared/interfaces/routes-enum';

export interface MenuItems {
  title: string;
  link: RoutesEnum;
}

export interface ActiveFilter {
  energy: boolean;
  critical: boolean;
}
