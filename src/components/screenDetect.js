// @flow
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

import type { NavigateType } from '../actions/navigation';

import { SCREEN_BEACON_INFO_DETECT } from '../actions/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F',
  },
});

type ScreenDetectProps = {
  screenProps: {
    navActions: {
      navigate: NavigateType, // eslint-disable-line
    },
  },
};

const ScreenDetect = (props: ScreenDetectProps) => {
  return (
    <View style={styles.container}>
      <Button
        title={'Beacon Info'}
        onPress={() => {
          const { navigate } = props.screenProps.navActions;
          navigate(SCREEN_BEACON_INFO_DETECT, {
            text: 'Detect - Beacon info',
            screenTitle: 'Detect - Beacon info',
          });
        }}
      />
    </View>
  );
};

ScreenDetect.navigationOptions = {
  title: 'Detect',
};

export default ScreenDetect;
