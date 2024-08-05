import { of } from 'rxjs';

export const motorOne = of({
  id: '1',
  name: 'Motor Elétrico (Trifásico)',
  local: 'Elétrica',
  localType: 'E',
  sensor: 'HIO4510',
  receptor: 'EUH4R27',
  image: 'assets/images/motor1.png',
});

export const motorTwo = of({
  id: '2',
  name: 'Motor Elétrico (Trifásico)',
  local: 'Elétrica',
  localType: 'E',
  sensor: 'TFV655',
  receptor: 'YTF265',
  image: 'assets/images/motor2.png',
});

export const motorThree = of({
  id: '3',
  name: 'Motor Elétrico (Trifásico)',
  local: 'Mecânica',
  localType: 'M',
  sensor: 'RWET667',
  receptor: '86GTFD7',
  image: null,
});

export interface MockedAssets {
  id: string;
  name: string;
  local: string;
  localType: string;
  sensor: string;
  receptor: string;
  image: string | null;
}
