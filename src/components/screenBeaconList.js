// @flow
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

import type { NavigateType } from '../actions/navigation';
import type { BeaconType, DeleteBeaconType } from '../actions/beacons';
import type { RegionsByFloorType } from '../reducers/beacons';

import {
  activeColor,
  listHeaderColor,
  listSeparatorColor,
  textSupportingColor,
  screenBackgroundColor,
  headingTextSize,
  largeTextSize,
  plusTextSize,
} from '../styles';
import { SCREEN_BEACON_INFO_BEACONS } from '../actions/navigation';
import DisclosureCell from './disclosureCell';
import { pureStatelessComponent } from '../utilities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: screenBackgroundColor,
  },
  rowItem: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  floorTitleRow: {
    backgroundColor: screenBackgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: listSeparatorColor,
  },
  floorTitle: {
    fontSize: largeTextSize,
    color: textSupportingColor,
  },
  regionTitleRow: {
    height: 30,
    backgroundColor: listHeaderColor,
  },
  regionTitle: {
    fontSize: headingTextSize,
    color: textSupportingColor,
  },
  rowSeparator: {
    marginLeft: 10,
    height: 0.5,
    backgroundColor: listSeparatorColor,
  },
});

const renderFloorTitle = (floorTitle, currentIndex) => {
  return (
    <View key={currentIndex} style={[styles.rowItem, styles.floorTitleRow]}>
      <Text style={styles.floorTitle}>
        {`Floor ${floorTitle}`}
      </Text>
    </View>
  );
};

const renderRegionTitle = (regionTitle, currentIndex) => {
  return (
    <View key={currentIndex} style={[styles.rowItem, styles.regionTitleRow]}>
      <Text style={styles.regionTitle}>
        {`${regionTitle}`}
      </Text>
    </View>
  );
};

const renderBeaconRow = (
  beacon: BeaconType,
  currentIndex: number,
  renderSeparator: boolean,
  navigate: NavigateType,
  deleteBeacon: DeleteBeaconType,
) => {
  const beaconName = beacon.name;

  return (
    <DisclosureCell
      key={currentIndex}
      title={beaconName}
      renderSeparator={renderSeparator}
      onPress={() => {
        navigate(SCREEN_BEACON_INFO_BEACONS, {
          beaconUuid: beacon.uuid,
          screenTitle: beaconName,
          deleteBeacon,
        });
      }}
    />
  );
};

type ScreenBeaconListProps = {
  regionsByFloor: RegionsByFloorType,
  screenProps: {
    navActions: {
      navigate: NavigateType, // eslint-disable-line
    },
  },
  deleteBeacon: DeleteBeaconType,
};

const ScreenBeaconList = (props: ScreenBeaconListProps) => {
  const { screenProps, deleteBeacon } = props;
  const { navigate } = screenProps.navActions;
  const renderedFloors = [];
  const content = [];
  let currentIndex = 0;
  const stickyHeaderIndices = [];

  if (props.regionsByFloor.size === 0) {
    content.push(
      <DisclosureCell
        key={'emptyMessage'}
        title={'No Beacons yet. Tap to create one.'}
        renderSeparator={false}
        onPress={() => {
          navigate(SCREEN_BEACON_INFO_BEACONS, {
            text: 'New Beacon',
            screenTitle: 'New Beacon',
          });
        }}
      />,
    );
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const [floorTitle, regions] of props.regionsByFloor.entries()) {
    if (!renderedFloors.includes(floorTitle)) {
      content.push(renderFloorTitle(floorTitle, currentIndex));
      renderedFloors.push(floorTitle);
      stickyHeaderIndices.push(currentIndex);
      currentIndex += 1;

      // eslint-disable-next-line no-restricted-syntax
      for (const [regionTitle, beaconList] of regions.entries()) {
        content.push(renderRegionTitle(regionTitle, currentIndex));
        currentIndex += 1;

        // eslint-disable-next-line no-loop-func
        beaconList.forEach((beacon, index) => {
          const renderSeparator = beaconList.size === 1 ? false : beaconList.size - 1 !== index;

          content.push(
            renderBeaconRow(beacon, currentIndex, renderSeparator, navigate, deleteBeacon),
          );
          currentIndex += 1;
        });
      }
    }
  }

  return (
    <ScrollView stickyHeaderIndices={stickyHeaderIndices} style={styles.container}>
      {content}
    </ScrollView>
  );
};

ScreenBeaconList.navigationOptions = ({ navigation, screenProps }) => {
  const { navigate } = screenProps.navActions;

  return {
    title: 'Beacons',
    headerRight: (
      <View
        style={{
          width: 40,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigate(SCREEN_BEACON_INFO_BEACONS, {
              text: 'New Beacon',
              screenTitle: 'New Beacon',
            });
          }}
        >
          <Text style={{ color: activeColor, fontSize: plusTextSize }}>
            {'+'}
          </Text>
        </TouchableOpacity>
      </View>
    ),
  };
};

export default pureStatelessComponent(ScreenBeaconList, (oldProps, newProps) => {
  return oldProps.regionsByFloor !== newProps.regionsByFloor;
});
