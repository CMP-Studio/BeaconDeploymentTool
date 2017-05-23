import fs from 'react-native-fs';

import { beaconJSONToBeaconMap } from '../utilities';

export const SAVE_BEACONS_TO_FILE = 'SAVE_BEACONS_TO_FILE';
export const LOAD_BEACONS_FROM_FILE = 'LOAD_BEACONS_FROM_FILE';

const FILE_NAME = 'beaconBlockRules.json';

export function saveBeaconsToFile() {
  return async (dispatch, getState) => {
    const allBeacons = getState().beacons.allBeacons;
    const filePath = `${fs.DocumentDirectoryPath}/${FILE_NAME}`;

    const beaconsJSON = JSON.stringify(allBeacons.toJS(), null, 2);

    try {
      await fs.writeFile(filePath, beaconsJSON, 'utf8');
    } catch (e) {
      console.log(e);
    }

    return dispatch({
      type: SAVE_BEACONS_TO_FILE,
      FILE_NAME,
    });
  };
}

export function loadBeaconsFromFile() {
  return async (dispatch, getState) => {
    const filePath = `${fs.DocumentDirectoryPath}/${FILE_NAME}`;

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
