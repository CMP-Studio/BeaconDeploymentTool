import { List, Map } from 'immutable';

import type { BeaconType } from './actions/beacons';
import type { AllBeaconsType, RegionsByFloorType } from './reducers/beacons';

export function generateRegionsByFloor(allBeacons: AllBeaconsType): RegionsByFloorType {
  let regionsByFloor = Map({});

  const setRegions = (beacon, region, regionsByFloorArg) => {
    let newRegionsByFloor = regionsByFloorArg;
    const regions = newRegionsByFloor.get(beacon.floor);

    if (!regions.has(region)) {
      newRegionsByFloor = newRegionsByFloor.setIn([beacon.floor, region], List([]));
    }

    // Set Beacons
    let beacons = newRegionsByFloor.getIn([beacon.floor, region]);
    if (!beacons.includes(beacon)) {
      beacons = beacons.push(beacon);
      newRegionsByFloor = newRegionsByFloor.setIn([beacon.floor, region], beacons);
    }

    return newRegionsByFloor;
  };

  allBeacons.forEach((beacon: BeaconType, key) => {
    // Set Floors
    if (!regionsByFloor.has(beacon.floor)) {
      regionsByFloor = regionsByFloor.set(beacon.floor, Map({}));
    }

    // Set Regions
    if (beacon.regions.size === 0) {
      regionsByFloor = setRegions(beacon, 'Unassigned', regionsByFloor);
    } else {
      beacon.regions.forEach((region: string) => {
        regionsByFloor = setRegions(beacon, region, regionsByFloor);
      });
    }
  });

  return regionsByFloor;
}
