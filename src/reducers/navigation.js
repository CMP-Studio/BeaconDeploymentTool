/* eslint-disable global-require, no-unused-vars */

import { TabRouter, StackRouter } from 'react-navigation';

import {
  SCREEN_DETECT,
  SCREEN_BEACON_LIST,
  SCREEN_DATA,
  SCREEN_BEACON_INFO_DETECT,
  SCREEN_BEACON_INFO_BEACONS,
  TAB_BEACONS,
  TAB_DETECT,
  TAB_DATA,
} from '../actions/navigation';

export const tabDetectInitialState = [
  {
    SCREEN_DETECT: {
      getScreen: () => require('../components/screenDetect').default,
    },
    SCREEN_BEACON_INFO_DETECT: {
      getScreen: () => require('../components/screenBeaconInfo').default,
    },
  },
  {
    initialRouteName: SCREEN_DETECT,
  },
];

export const tabBeaconsInitialState = [
  {
    SCREEN_BEACON_LIST: {
      getScreen: () => require('../components/screenBeaconList').default,
    },
    SCREEN_BEACON_INFO_BEACONS: {
      getScreen: () => require('../components/screenBeaconInfo').default,
    },
  },
  {
    initialRouteName: SCREEN_BEACON_LIST,
  },
];

export const tabDataInitialState = [
  {
    SCREEN_DATA: {
      getScreen: () => require('../components/screenData').default,
    },
  },
  {
    initialRouteName: SCREEN_DATA,
  },
];

export const tabInitialState = [
  {
    TAB_DETECT: {
      getScreen: () => require('../containers/tabDetect').default,
    },
    TAB_BEACONS: {
      getScreen: () => require('../containers/tabBeacons').default,
    },
    TAB_DATA: {
      getScreen: () => require('../containers/tabData').default,
    },
  },
  {
    initialRouteName: TAB_DETECT,
  },
];

const tabRouter = TabRouter(...tabInitialState);
const tabDetectRouter = StackRouter(...tabDetectInitialState);
const tabBeaconsRouter = StackRouter(...tabBeaconsInitialState);
const tabDataRouter = StackRouter(...tabDataInitialState);

const navigation = (state = {}, action) => {
  const tabState = tabRouter.getStateForAction(action, state.tabState);
  const tabDetectState = tabDetectRouter.getStateForAction(action, state.tabDetectState);
  const tabBeaconsState = tabBeaconsRouter.getStateForAction(action, state.tabBeaconsState);
  const tabDataState = tabDataRouter.getStateForAction(action, state.tabDataState);

  return {
    tabState,
    tabDetectState,
    tabBeaconsState,
    tabDataState,
  };
};

export default navigation;
