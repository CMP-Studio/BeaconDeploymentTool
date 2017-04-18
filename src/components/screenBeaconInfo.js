import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { paramsToProps } from '../utilities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1FF',
  },
});

const ScreenBeaconInfo = (props) => {
  if (props.screenTitle) {
    ScreenBeaconInfo.navigationOptions.title = props.screenTitle;
  }

  return (
    <View style={styles.container}>
      <Text>
        {props.text}
      </Text>
    </View>
  );
};

ScreenBeaconInfo.navigationOptions = {
  title: 'Beacon Info',
};

export default paramsToProps(ScreenBeaconInfo);
