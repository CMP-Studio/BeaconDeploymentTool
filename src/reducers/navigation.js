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

const emptyAction = { type: '' };
const initalState = {
  tabState: tabRouter.getStateForAction(emptyAction),
  tabDetectState: tabDetectRouter.getStateForAction(emptyAction),
  tabBeaconsState: tabBeaconsRouter.getStateForAction(emptyAction),
  tabDataState: tabDataRouter.getStateForAction(emptyAction),
};

let cachedRoutes;
function tabRoutes(tabState) {
  if (!cachedRoutes) {
    const routes = tabState.routes.map((route) => {
      return route.routeName;
    });
    cachedRoutes = routes;
  }
  return cachedRoutes;
}

function flattenTabsState(tabsState) {
  return Object.entries(tabsState).reduce(
    (obj, item) => {
      const itemData = item[1];
      // eslint-disable-next-line no-param-reassign
      obj[itemData.name] = itemData.state;
      return obj;
    },
    {},
  );
}

function updateTabsState(action, tabState, tabsState) {
  let newTabState;
  let newTabsState;

  const routes = tabRoutes(tabState);

  if (routes.includes(action.routeName)) {
    newTabState = tabRouter.getStateForAction(action, tabState);
  } else {
    const activeTab = routes[tabState.index];

    newTabsState = tabsState;
    const router = newTabsState[activeTab].router;
    const state = newTabsState[activeTab].state;

    newTabsState[activeTab].state = router.getStateForAction(action, state);
  }

  return {
    tabState: newTabState || tabState,
    ...flattenTabsState(newTabsState || tabsState),
  };
}

const navigation = (state = initalState, action) => {
  return updateTabsState(action, state.tabState, {
    TAB_DETECT: {
      router: tabDetectRouter,
      state: state.tabDetectState,
      name: 'tabDetectState',
    },
    TAB_BEACONS: {
      router: tabBeaconsRouter,
      state: state.tabBeaconsState,
      name: 'tabBeaconsState',
    },
    TAB_DATA: {
      router: tabDataRouter,
      state: state.tabDataState,
      name: 'tabDataState',
    },
  });
};

export default navigation;
