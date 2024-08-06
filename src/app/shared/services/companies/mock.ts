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

export const mockedAssets = {
  '662fd0ee639069143a8fc387': {
    id: '662fd0ee639069143a8fc387',
    name: 'Jaguar',
    children: {
      '656734821f4664001f296973': {
        gatewayId: 'QHI640',
        id: '656734821f4664001f296973',
        locationId: null,
        name: 'Fan - External',
        parentId: null,
        sensorId: 'MTC052',
        sensorType: 'energy',
        status: 'operating',
        children: {},
        type: 'SENSOR',
      },
      '656733611f4664001f295dd0': {
        id: '656733611f4664001f295dd0',
        name: 'Empty Machine house',
        parentId: null,
        children: {},
        type: 'LOCATION',
      },
      '656733b1664c41001e91d9ed': {
        id: '656733b1664c41001e91d9ed',
        name: 'Machinery house',
        parentId: null,
        children: {
          '656734448eb037001e474a62': {
            id: '656734448eb037001e474a62',
            locationId: '656733b1664c41001e91d9ed',
            name: 'Fan H12D',
            parentId: null,
            sensorType: null,
            status: null,
            children: {},
            type: 'ASSET',
          },
          '656734968eb037001e474d5a': {
            id: '656734968eb037001e474d5a',
            locationId: '656733b1664c41001e91d9ed',
            name: 'Motors H12D',
            parentId: null,
            sensorType: null,
            status: null,
            children: {
              '6567340c1f4664001f29622e': {
                gatewayId: 'QBK282',
                id: '6567340c1f4664001f29622e',
                locationId: null,
                name: 'Motor H12D- Stage 1',
                parentId: '656734968eb037001e474d5a',
                sensorId: 'CFX848',
                sensorType: 'vibration',
                status: 'alert',
                children: {},
                type: 'SENSOR',
              },
              '6567340c664c41001e91dceb': {
                gatewayId: 'VHS387',
                id: '6567340c664c41001e91dceb',
                locationId: null,
                name: 'Motor H12D-Stage 2',
                parentId: '656734968eb037001e474d5a',
                sensorId: 'GYB119',
                sensorType: 'vibration',
                status: 'alert',
                children: {},
                type: 'SENSOR',
              },
              '656733921f4664001f295e9b': {
                gatewayId: 'VZO694',
                id: '656733921f4664001f295e9b',
                locationId: null,
                name: 'Motor H12D-Stage 3',
                parentId: '656734968eb037001e474d5a',
                sensorId: 'SIF016',
                sensorType: 'vibration',
                status: 'alert',
                children: {},
                type: 'SENSOR',
              },
            },
            type: 'ASSET',
          },
        },
        type: 'LOCATION',
      },
      '65674204664c41001e91ecb4': {
        id: '65674204664c41001e91ecb4',
        name: 'PRODUCTION AREA - RAW MATERIAL',
        parentId: null,
        children: {
          '656a07b3f2d4a1001e2144bf': {
            id: '656a07b3f2d4a1001e2144bf',
            name: 'CHARCOAL STORAGE SECTOR',
            parentId: '65674204664c41001e91ecb4',
            children: {
              '656a07bbf2d4a1001e2144c2': {
                id: '656a07bbf2d4a1001e2144c2',
                locationId: '656a07b3f2d4a1001e2144bf',
                name: 'CONVEYOR BELT ASSEMBLY',
                parentId: null,
                sensorType: null,
                status: null,
                children: {
                  '656a07c3f2d4a1001e2144c5': {
                    id: '656a07c3f2d4a1001e2144c5',
                    locationId: null,
                    name: 'MOTOR TC01 COAL UNLOADING AF02',
                    parentId: '656a07bbf2d4a1001e2144c2',
                    sensorType: null,
                    status: null,
                    children: {
                      '656a07cdc50ec9001e84167b': {
                        gatewayId: 'FRH546',
                        id: '656a07cdc50ec9001e84167b',
                        locationId: null,
                        name: 'MOTOR RT COAL AF01',
                        parentId: '656a07c3f2d4a1001e2144c5',
                        sensorId: 'FIJ309',
                        sensorType: 'vibration',
                        status: 'operating',
                        children: {},
                        type: 'SENSOR',
                      },
                    },
                    type: 'ASSET',
                  },
                },
                type: 'ASSET',
              },
            },
            type: 'SUB-LOCATION',
          },
        },
        type: 'LOCATION',
      },
    },
    type: 'COMPANY',
  },
  '662fd0fab3fd5656edb39af5': {
    id: '662fd0fab3fd5656edb39af5',
    name: 'Tobias',
    children: {
      '6a9b4171b62cbf0062dd8a67': {
        id: '6a9b4171b62cbf0062dd8a67',
        name: 'Corn Cooking Facility',
        parentId: null,
        children: {
          '6a9b41afa2555c0067916b94': {
            id: '6a9b41afa2555c0067916b94',
            name: 'Mixer for Soaking',
            parentId: '6a9b4171b62cbf0062dd8a67',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6a9b4172b62cbf0062dd8a6c': {
            id: '6a9b4172b62cbf0062dd8a6c',
            name: 'Disk Mill',
            parentId: '6a9b4171b62cbf0062dd8a67',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6092c8f567679000665ed5d2': {
            id: '6092c8f567679000665ed5d2',
            name: 'Collector Tank',
            parentId: '6a9b4171b62cbf0062dd8a67',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6080f8526511f8001eb2c722': {
            id: '6080f8526511f8001eb2c722',
            name: 'Soaking Tank',
            parentId: '6a9b4171b62cbf0062dd8a67',
            children: {},
            type: 'SUB-LOCATION',
          },
        },
        type: 'LOCATION',
      },
      '6080fa1b2515c0001e62cf87': {
        id: '6080fa1b2515c0001e62cf87',
        name: 'Storage',
        parentId: null,
        children: {
          '6080fcbe98ac51001e7d440d': {
            id: '6080fcbe98ac51001e7d440d',
            name: 'Mechanical Unit 1',
            parentId: '6080fa1b2515c0001e62cf87',
            children: {},
            type: 'SUB-LOCATION',
          },
        },
        type: 'LOCATION',
      },
      '6a944484aac55c0062464050': {
        id: '6a944484aac55c0062464050',
        name: 'Distillery Unit 1',
        parentId: null,
        children: {
          '6a9b31a1b62cbf0062dd8a89': {
            id: '6a9b31a1b62cbf0062dd8a89',
            name: 'Processing Unit 1',
            parentId: '6a944484aac55c0062464050',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6a9b47a5aac55c006246402d': {
            id: '6a9b47a5aac55c006246402d',
            name: 'Vaporization Unit 1',
            parentId: '6a944484aac55c0062464050',
            children: {},
            type: 'SUB-LOCATION',
          },
        },
        type: 'LOCATION',
      },
      '6a9b47f2cac55c0062464076': {
        id: '6a9b47f2cac55c0062464076',
        name: 'Evaporator',
        parentId: null,
        children: {
          '6a9b4417a2555c0067916bd0': {
            id: '6a9b4417a2555c0067916bd0',
            name: 'Processing Unit 2',
            parentId: '6a9b47f2cac55c0062464076',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6a9b4914aac55c0062464050': {
            id: '6a9b4914aac55c0062464050',
            name: 'Processing Unit 5',
            parentId: '6a9b47f2cac55c0062464076',
            children: {},
            type: 'SUB-LOCATION',
          },
        },
        type: 'LOCATION',
      },
      '6a98ffb52615e600676e09f7': {
        id: '6a98ffb52615e600676e09f7',
        name: 'Power Generation',
        parentId: null,
        children: {
          '60a988e24a1ac0001e8009e2': {
            id: '60a988e24a1ac0001e8009e2',
            name: 'Electric Generator',
            parentId: '6a98ffb52615e600676e09f7',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6a98fff76117bd0062dcb484': {
            id: '6a98fff76117bd0062dcb484',
            name: 'Generator 1 Reducer',
            parentId: '6a98ffb52615e600676e09f7',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6a9901186117bd0062dcbdda': {
            id: '6a9901186117bd0062dcbdda',
            name: 'Generator 2 Reducer',
            parentId: '6a98ffb52615e600676e09f7',
            children: {},
            type: 'SUB-LOCATION',
          },
        },
        type: 'LOCATION',
      },
      '6a9b4711a2555c0067916c27': {
        id: '6a9b4711a2555c0067916c27',
        name: 'St2cm Generation',
        parentId: null,
        children: {
          '6a9b4770a2555c0067916c24': {
            id: '6a9b4770a2555c0067916c24',
            name: 'Processing Unit 7',
            parentId: '6a9b4711a2555c0067916c27',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6a9b4712c2555c0067916c25': {
            id: '6a9b4712c2555c0067916c25',
            name: 'Production Unit 1',
            parentId: '6a9b4711a2555c0067916c27',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6a9b1722aac55c00624640a0': {
            id: '6a9b1722aac55c00624640a0',
            name: 'Extraction Unit 1',
            parentId: '6a9b4711a2555c0067916c27',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6a9b477fb62cbf0062dd8aeb': {
            id: '6a9b477fb62cbf0062dd8aeb',
            name: 'Extraction Unit 7',
            parentId: '6a9b4711a2555c0067916c27',
            children: {},
            type: 'SUB-LOCATION',
          },
          '60fa15c1111e49001dbd2497': {
            id: '60fa15c1111e49001dbd2497',
            name: 'Mechanical Unit 2',
            parentId: '6a9b4711a2555c0067916c27',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6a9b474da2555c0067916c2e': {
            id: '6a9b474da2555c0067916c2e',
            name: 'Evaporation Unit 1',
            parentId: '6a9b4711a2555c0067916c27',
            children: {},
            type: 'SUB-LOCATION',
          },
          '606975924062a1001e2a70a6': {
            id: '606975924062a1001e2a70a6',
            name: 'Evaporation Unit 7',
            parentId: '6a9b4711a2555c0067916c27',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6a9b4725c62cbf0062dd8ae4': {
            id: '6a9b4725c62cbf0062dd8ae4',
            name: 'Extraction Unit 4',
            parentId: '6a9b4711a2555c0067916c27',
            children: {},
            type: 'SUB-LOCATION',
          },
        },
        type: 'LOCATION',
      },
      '6a9b45c2a2555c0067916c62': {
        id: '6a9b45c2a2555c0067916c62',
        name: 'Milling',
        parentId: null,
        children: {
          '6a9b45c2cac55c00624640fc': {
            id: '6a9b45c2cac55c00624640fc',
            name: 'Milling Unit 1',
            parentId: '6a9b45c2a2555c0067916c62',
            children: {},
            type: 'SUB-LOCATION',
          },
        },
        type: 'LOCATION',
      },
      '6b21f6fa9e497d001e2d4fcf': {
        id: '6b21f6fa9e497d001e2d4fcf',
        name: 'Dryer',
        parentId: null,
        children: {
          '6b245a175832e7001ecac62d': {
            id: '6b245a175832e7001ecac62d',
            name: 'Decantation Unit 1',
            parentId: '6b21f6fa9e497d001e2d4fcf',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6b245caa7696b1001e047bef': {
            id: '6b245caa7696b1001e047bef',
            name: 'Extraction Unit 2',
            parentId: '6b21f6fa9e497d001e2d4fcf',
            children: {},
            type: 'SUB-LOCATION',
          },
          '6b245cbc89efeb001ef87004': {
            id: '6b245cbc89efeb001ef87004',
            name: 'Extraction Unit 5',
            parentId: '6b21f6fa9e497d001e2d4fcf',
            children: {},
            type: 'SUB-LOCATION',
          },
        },
        type: 'LOCATION',
      },
      '60e0fbe2d5cef6001d8d165c': {
        id: '60e0fbe2d5cef6001d8d165c',
        name: 'Industrial Workshop and Maintenance',
        parentId: null,
        children: {
          '60e0fca566e01e001fc2c172': {
            id: '60e0fca566e01e001fc2c172',
            name: 'Mechanical Assembly Office',
            parentId: '60e0fbe2d5cef6001d8d165c',
            children: {},
            type: 'SUB-LOCATION',
          },
        },
        type: 'LOCATION',
      },
      '6a9b4995a2555c0067916c9c': {
        id: '6a9b4995a2555c0067916c9c',
        name: 'Water Cooling',
        parentId: null,
        children: {
          '6a9b49b0b62cbf0062dd5c46': {
            id: '6a9b49b0b62cbf0062dd5c46',
            name: 'Evaporation Unit 2',
            parentId: '6a9b4995a2555c0067916c9c',
            children: {},
            type: 'SUB-LOCATION',
          },
        },
        type: 'LOCATION',
      },
      '607a1184f70f5b001e041ba4': {
        id: '607a1184f70f5b001e041ba4',
        name: 'Water Cooling',
        parentId: null,
        children: {
          '607a11a07a51520020945cd6': {
            id: '607a11a07a51520020945cd6',
            name: 'Processing Unit 4',
            parentId: '607a1184f70f5b001e041ba4',
            children: {},
            type: 'SUB-LOCATION',
          },
        },
        type: 'LOCATION',
      },
    },
    type: 'COMPANY',
  },
  '662fd100f990557384756e58': {
    id: '662fd100f990557384756e58',
    name: 'Apex',
    children: {},
    type: 'COMPANY',
  },
};
