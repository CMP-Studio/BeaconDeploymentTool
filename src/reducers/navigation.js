import { TabRouter, StackRouter } from 'react-navigation';

export const tabOneState = [
  {
    ScreenOne: {
      getScreen: () => require('../components/screenOne').default,
    },
    ScreenTwo: {
      getScreen: () => require('../components/screenTwo').default,
    },
  },
  {
    initialRouteName: 'ScreenOne',
  },
];

export const tabState = [
  {
    TabOne: {
      getScreen: () => require('../containers/tabOne').default,
    },
    TabTwo: {
      getScreen: () => require('../components/screenOne').default,
    },
  },
  {
    initialRouteName: 'TabOne',
  },
];

const tabRouter = TabRouter(...tabState);
const tabOneRouter = StackRouter(...tabOneState);

const navigation = (state = {}, action) => {
  const tabOneState = tabOneRouter.getStateForAction(action, state.tabOneState);
  const tabState = tabRouter.getStateForAction(action, state.tabState);
  return {
    tabState,
    tabOneState,
  };
};

export default navigation;
