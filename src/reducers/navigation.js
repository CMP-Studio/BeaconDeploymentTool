import { TabRouter, StackRouter } from 'react-navigation';

import { SCREEN_ONE, SCREEN_TWO, TAB_ONE, TAB_TWO } from '../actions/navigation';

export const tabOneState = [
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

export const tabState = [
  {
    TAB_ONE: {
      getScreen: () => require('../containers/tabOne').default,
    },
    TAB_TWO: {
      getScreen: () => require('../components/tabTwo').default,
    },
  },
  {
    initialRouteName: TAB_ONE,
  },
];

const tabRouter = TabRouter(...tabState);
const tabOneRouter = StackRouter(...tabOneState);

const navigation = (state = {}, action) => {
  const tabOneState = tabOneRouter.getStateForAction(action, state.tabOneState);
  const tabState = tabRouter.getStateForAction(action, state.tabState);

  return {
    tabOneState,
    tabState,
  };
};

export default navigation;
