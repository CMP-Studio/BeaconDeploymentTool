import { List, Map } from 'immutable';

import { Beacon } from './actions/beacons';
import type { BeaconType } from './actions/beacons';
import type { AllBeaconsType, RegionsByFloorType } from './reducers/beacons';

export function beaconJSONToBeaconMap(beaconsJSON) {
  const beaconsJS = JSON.parse(beaconsJSON);
  let allBeacons = Map({});

  for (const key of Object.keys(beaconsJS)) {
    const beacon = beaconsJS[key];
    const { name, uuid, floor, blocks, region } = beacon;

    const beaconRecord = Beacon({
      name,
      uuid,
      floor,
      region,
      blocks: List(blocks),
    });

    allBeacons = allBeacons.set(uuid, beaconRecord);
  }

  return allBeacons;
}

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
    if (beacon.region === '') {
      regionsByFloor = setRegions(beacon, 'Unassigned', regionsByFloor);
    } else {
      regionsByFloor = setRegions(beacon, beacon.region, regionsByFloor);
    }
  });

  return regionsByFloor.sortBy(
    (value, key) => {
      return key;
    },
    (a, b) => {
      const numA = parseInt(a.replace(/[^0-9]/g, ''), 10);
      const numB = parseInt(b.replace(/[^0-9]/g, ''), 10);

      if (isNaN(numA) || isNaN(numB)) {
        return 0;
      }

      if (numA < numB) {
        return -1;
      } else if (numA > numB) {
        return 1;
      }

      return 0;
    },
  );
}
