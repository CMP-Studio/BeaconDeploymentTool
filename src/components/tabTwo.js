import React from 'react';
import { View } from 'react-native';

const TabTwo = (props) => {
  return (
    <View
      style={{
        backgroundColor: '#1EA',
        flex: 1,
      }}
    />
  );
};

TabTwo.navigationOptions = {
  title: 'Tab Two',
};

export default TabTwo;
