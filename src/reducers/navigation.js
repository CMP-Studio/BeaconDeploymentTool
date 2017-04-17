/* eslint-disable global-require */

import { TabRouter, StackRouter } from 'react-navigation';

import { SCREEN_ONE, SCREEN_TWO, TAB_BEACONS, TAB_DETECT, TAB_DATA } from '../actions/navigation';

export const tabDetectInitialState = [
  {
    SCREEN_ONE: {
      getScreen: () => require('../components/screenOne').default,
    },
    SCREEN_TWO: {
      getScreen: () => require('../components/screenTwo').default,
    },
  },
  {
    initialRouteName: SCREEN_ONE,
  },
];

export const tabBeaconsInitialState = [
  {
    SCREEN_ONE: {
      getScreen: () => require('../components/screenOne').default,
    },
    SCREEN_TWO: {
      getScreen: () => require('../components/screenTwo').default,
    },
  },
  {
    initialRouteName: SCREEN_ONE,
  },
];

export const tabDataInitialState = [
  {
    SCREEN_ONE: {
      getScreen: () => require('../components/screenOne').default,
    },
    SCREEN_TWO: {
      getScreen: () => require('../components/screenTwo').default,
    },
  },
  {
    initialRouteName: SCREEN_ONE,
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
