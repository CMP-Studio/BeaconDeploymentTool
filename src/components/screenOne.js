import React from 'react';
import { View } from 'react-native';

const screenOne = (props) => {
  return (
    <View
      style={{
        backgroundColor: '#FF9F',
        flex: 1,
      }}
    />
  );
};

screenOne.navigationOptions = {
  title: 'Screen One',
};

export default screenOne;
