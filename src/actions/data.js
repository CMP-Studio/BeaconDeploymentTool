import fs from 'react-native-fs';

import { beaconJSONToBeaconMap } from '../utilities';

export const SAVE_BEACONS_TO_FILE = 'SAVE_BEACONS_TO_FILE';
export const LOAD_BEACONS_FROM_FILE = 'LOAD_BEACONS_FROM_FILE';

export function saveBeaconsToFile(fileName) {
  return async (dispatch, getState) => {
    const allBeacons = getState().beacons.allBeacons;
    const filePath = `${fs.DocumentDirectoryPath}/${fileName}.json`;

    const beaconsJSON = JSON.stringify(allBeacons.toJS(), null, 2);

    try {
      await fs.writeFile(filePath, beaconsJSON, 'utf8');
    } catch (e) {
      console.log(e);
    }

    return dispatch({
      type: SAVE_BEACONS_TO_FILE,
      fileName,
    });
  };
}

export function loadBeaconsFromFile(fileName) {
  return async (dispatch, getState) => {
    const filePath = `${fs.DocumentDirectoryPath}/${fileName}.json`;

    try {
      const beaconsJSON = await fs.readFile(filePath, 'utf8');
      const allBeacons = beaconJSONToBeaconMap(beaconsJSON);

      return dispatch({
        type: LOAD_BEACONS_FROM_FILE,
        allBeacons,
      });
    } catch (e) {
      console.log(e);
    }
  };
}
