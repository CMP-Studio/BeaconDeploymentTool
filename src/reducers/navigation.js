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

// Not happy with this...
const tabRouter = TabRouter(...tabInitialState);
const tabDetectRouter = StackRouter(...tabDetectInitialState);
const tabBeaconsRouter = StackRouter(...tabBeaconsInitialState);
const tabDataRouter = StackRouter(...tabDataInitialState);

const emptyAction = { type: '' };
const initalState = {
  tabState: tabRouter.getStateForAction(emptyAction),
  tabDetectState: tabDetectRouter.getStateForAction(emptyAction),
  tabBeaconsState: tabBeaconsRouter.getStateForAction(emptyAction),
  tabDataState: tabDataRouter.getStateForAction(emptyAction),
};

const navigation = (state = initalState, action) => {
  let tabState;
  let tabDetectState;
  let tabBeaconsState;
  let tabDataState;

  switch (action.routeName) {
    case TAB_DETECT:
    case TAB_BEACONS:
    case TAB_DATA: {
      tabState = tabRouter.getStateForAction(action, state.tabState);
      break;
    }

    default: {
      tabState = state.tabState;
      const activeTab = state.tabState.routes[state.tabState.index].key;

      switch (activeTab) {
        case TAB_DETECT: {
          tabDetectState = tabDetectRouter.getStateForAction(action, state.tabDetectState);
          break;
        }

        case TAB_BEACONS: {
          tabBeaconsState = tabBeaconsRouter.getStateForAction(action, state.tabBeaconsState);
          break;
        }

        case TAB_DATA: {
          tabDataState = tabDataRouter.getStateForAction(action, state.tabDataState);
          break;
        }

        default: {
          // eslint-disable-next-line no-console
          console.warn('Unhandled navigation case!');
          break;
        }
      }
    }
  }

  return {
    tabState,
    tabDetectState: tabDetectState || state.tabDetectState,
    tabBeaconsState: tabBeaconsState || state.tabBeaconsState,
    tabDataState: tabDataState || state.tabDataState,
  };
};

export default navigation;
