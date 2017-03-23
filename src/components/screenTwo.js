import React from 'react';
import { View } from 'react-native';

const screenTwo = (props) => {
  return (
    <View
      style={{
        backgroundColor: '#1FFF',
        flex: 1,
      }}
    />
  );
};

screenTwo.navigationOptions = {
  title: 'Screen Two',
};

export default screenTwo;
