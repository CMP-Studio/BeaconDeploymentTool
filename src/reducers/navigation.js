import { TabRouter } from 'react-navigation';

export const initialState = [
  {
    Home: {
      getScreen: () => require('../components/screenOne').default,
    },
    HomeTwo: {
      getScreen: () => require('../components/screenOne').default,
    },
  },
  {
    initialRouteName: 'Home',
  },
];

const router = TabRouter(...initialState);

const navigation = (state, action) => {
  const newState = router.getStateForAction(action, state);
  return state || newState;
};

export default navigation;
