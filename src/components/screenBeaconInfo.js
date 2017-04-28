// @flow
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { List } from 'immutable';

import type { BeaconType, AddNewBeaconType } from '../actions/beacons';

import { Beacon } from '../actions/beacons';
import { activeColor, screenBackgroundColor } from '../styles';
import { paramsToProps } from '../utilities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: screenBackgroundColor,
  },
});

type ScreenBeaconInfoProps = {
  text: string,
  beacon: BeaconType,
  actions: {
    addNewBeacon: AddNewBeaconType,
  },
};

const ScreenBeaconInfo = (props: ScreenBeaconInfoProps) => {
  let content;

  if (props.beacon) {
    content = (
      <Text>
        {props.text}
      </Text>
    );
  } else {
    content = (
      <Button
        title={'New Beacon'}
        color={activeColor}
        onPress={() => {
          props.actions.addNewBeacon(
            Beacon({
              name: 'Testing Beacon 2',
              uuid: '20668:13234',
              region: 'green',
              floor: 6,
              blocks: List([]),
            }),
          );
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {content}
    </View>
  );
};

ScreenBeaconInfo.navigationOptions = ({ navigation }) => {
  const screenTitle = navigation.state.params.screenTitle || 'Beacon Info';
  return {
    title: screenTitle,
  };
};

export default paramsToProps(ScreenBeaconInfo);
