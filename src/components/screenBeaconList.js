// @flow
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import ImmutableListView from 'react-native-immutable-list-view';

import type { NavigateType } from '../actions/navigation';
import type { BeaconIDType } from '../actions/beacons';
import type { allBeaconsType, RegionsByFloorType } from '../reducers/beacons';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
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

const renderFloorTitle = (floorTitle) => {
  return (
    <View style={[styles.rowItem, styles.floorTitleRow]}>
      <Text style={styles.floorTitle}>
        {`Floor ${floorTitle}`}
      </Text>
    </View>
  );
};

const renderRegionTitle = (regionTitle) => {
  return (
    <View style={[styles.rowItem, styles.regionTitleRow]}>
      <Text style={styles.regionTitle}>
        {`${regionTitle}`}
      </Text>
    </View>
  );
};

const renderBeaconRow = (
  beaconID: BeaconIDType,
  allBeacons: allBeaconsType,
  navigate: NavigateType,
) => {
  const beacon = allBeacons.get(beaconID);
  const beaconName = beacon.get('name');

  return (
    <DisclosureCell
      title={beaconName}
      onPress={() => {
        navigate(SCREEN_BEACON_INFO_BEACONS, {
          beaconUuid: beaconID,
          screenTitle: beaconName,
        });
      }}
    />
  );
};

type ScreenBeaconListProps = {
  allBeacons: allBeaconsType,
  regionsByFloor: RegionsByFloorType,
  screenProps: {
    navActions: {
      navigate: NavigateType, // eslint-disable-line
    },
  },
};

const ScreenBeaconList = (props: ScreenBeaconListProps) => {
  const { allBeacons, screenProps } = props;
  const { navigate } = screenProps.navActions;
  const renderedFloors = [];

  return (
    <View style={styles.container}>
      <ImmutableListView
        immutableData={props.regionsByFloor}
        renderSectionHeader={(_, floorTitle) => {
          return renderFloorTitle(floorTitle);
        }}
        renderRow={(data, category) => {
          if (renderedFloors.includes(category)) {
            return null;
          }

          // Super hackey... :(
          const regions = props.regionsByFloor.get(category);
          renderedFloors.push(category);

          return (
            <ImmutableListView
              immutableData={regions}
              renderSectionHeader={(_, regionTitle) => {
                return renderRegionTitle(regionTitle);
              }}
              renderRow={(beaconID) => {
                return renderBeaconRow(beaconID, allBeacons, navigate);
              }}
              renderSeparator={(sectionID, rowID) => {
                return <View key={`${sectionID}${rowID}Separator`} style={styles.rowSeparator} />;
              }}
            />
          );
        }}
      />
    </View>
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

export default ScreenBeaconList;
