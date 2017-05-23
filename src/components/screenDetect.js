// @flow
import React from 'react';
import { View, Button, Text, StyleSheet, Linking, Alert, ScrollView } from 'react-native';

import type { NavigateType } from '../actions/navigation';

import {
  activeColor,
  screenBackgroundColor,
  headingTextSize,
  textSize,
  largeTextSize,
  textSupportingColor,
  listSeparatorColor,
  listHeaderColor,
  headerFontWeight,
} from '../styles';
import { SCREEN_BEACON_INFO_DETECT } from '../actions/navigation';

import {
  LOCATION_SERVICES_STATUS_NOTDETERMINED,
  LOCATION_SERVICES_STATUS_DENIED,
} from '../actions/wayfinding';

import DisclosureCell from './disclosureCell';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: screenBackgroundColor,
  },
  blueToothMessage: {
    fontSize: headingTextSize,
  },
  notDetectingContainer: {
    margin: 10,
  },
  bluetoothMessageContainer: {
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 5,
  },
  detectedContainer: {
    marginVertical: 10,
  },
  detectedHeadingText: {
    textAlign: 'center',
    fontSize: headingTextSize,
    color: textSupportingColor,
    marginBottom: 8,
  },
  detectedDataText: {
    textAlign: 'center',
    fontSize: largeTextSize,
    marginBottom: 8,
  },
  detectedBeaconsText: {
    textAlign: 'left',
    fontSize: headingTextSize,
    color: textSupportingColor,
    marginTop: 8,
    marginLeft: 10,
  },
  detectedBeaconsContainer: {
    width: '100%',
  },
  scrollContainer: {
    flexDirection: 'column',
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
  noBeaconsDetectedRow: {
    height: 44,
    justifyContent: 'center',
    marginLeft: 10,
  },
  noBeaconsDetectedRowText: {
    fontSize: textSize,
    textAlign: 'left',
    fontWeight: headerFontWeight,
  },
});

type ScreenDetectProps = {
  screenProps: {
    navActions: {
      navigate: NavigateType, // eslint-disable-line
    },
  },
};

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
  beaconName: string,
  beaconUUID: string,
  blockedBy: ?any,
  currentIndex: number,
  renderSeparator: boolean,
  navigate: NavigateType,
  deleteBeacon: DeleteBeaconType,
) => {
  let subtitle;
  if (blockedBy) {
    const blocked = blockedBy.get(beaconUUID);
    if (blocked) {
      subtitle = `Blocked by: ${blocked.join(', ')}`;
    }
  }

  return (
    <DisclosureCell
      key={currentIndex}
      title={beaconName}
      subtitle={subtitle}
      renderSeparator={renderSeparator}
      onPress={() => {
        navigate(
          SCREEN_BEACON_INFO_DETECT,
          {
            beaconUuid: beaconUUID,
            screenTitle: blockedBy ? beaconName : 'Unnamed',
            deleteBeacon,
          },
          beaconUUID,
        );
      }}
    />
  );
};

function renderKnownBeacons(regionsByFloor, blockedBy, screenProps, deleteBeacon, unknownBeacons) {
  const { navigate } = screenProps.navActions;
  const renderedFloors = [];
  const content = [];
  let currentIndex = 0;
  const stickyHeaderIndices = [];

  if (regionsByFloor.size === 0) {
    if (unknownBeacons.size === 0) {
      return (
        <View style={[styles.detectedBeaconsContainer]}>
          <Text style={styles.detectedBeaconsText}>
            {'Detected Beacons'}
          </Text>
          <View style={styles.noBeaconsDetectedRow}>
            <Text style={styles.noBeaconsDetectedRowText}>
              {'None'}
            </Text>
          </View>
        </View>
      );
    }

    return;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const [floorTitle, regions] of regionsByFloor.entries()) {
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
            renderBeaconRow(
              beacon.name,
              beacon.uuid,
              blockedBy,
              currentIndex,
              renderSeparator,
              navigate,
              deleteBeacon,
            ),
          );
          currentIndex += 1;
        });
      }
    }
  }

  return (
    <View style={[styles.detectedBeaconsContainer, { flex: 2 }]}>
      <Text style={styles.detectedBeaconsText}>
        {'Detected Beacons'}
      </Text>
      <ScrollView stickyHeaderIndices={stickyHeaderIndices} style={styles.scrollContainer}>
        {content}
      </ScrollView>
    </View>
  );
}

function renderUnknownBeacons(unknownBeacons, screenProps, deleteBeacon) {
  const { navigateAndCreateBeacon } = screenProps.navActions;
  const content = [];
  let currentIndex = 0;

  if (unknownBeacons.size === 0) {
    return;
  }

  // eslint-disable-next-line no-loop-func
  unknownBeacons.forEach((beaconUUID, index) => {
    const renderSeparator = unknownBeacons.size === 1 ? false : unknownBeacons.size - 1 !== index;

    content.push(
      renderBeaconRow(
        `Add Beacon ${beaconUUID}`,
        beaconUUID,
        null,
        currentIndex,
        renderSeparator,
        navigateAndCreateBeacon,
        deleteBeacon,
      ),
    );
    currentIndex += 1;
  });

  return (
    <View style={[styles.detectedBeaconsContainer, { flex: 1 }]}>
      <Text style={styles.detectedBeaconsText}>
        {'Unknown Beacons'}
      </Text>
      <ScrollView style={styles.scrollContainer}>
        {content}
      </ScrollView>
    </View>
  );
}

const ScreenDetect = (props: ScreenDetectProps) => {
  const {
    bluetoothOn,
    locationServicesStatus,
    requestLocationServicesAuthorization,
    currentlyDetecting,
    detectedRegions,
    detectedFloor,
    unknownBeacons,
    blockedBy,
    regionsByFloor,
    screenProps,
    deleteBeacon,
  } = props;

  let content;

  // if (!currentlyDetecting) {
  if (false) {
    let blueToothMessage;
    let locationServicesMessage;

    if (!bluetoothOn) {
      blueToothMessage = (
        <View style={styles.bluetoothMessageContainer}>
          <Text style={styles.blueToothMessage}>
            {'Enable bluetooth'}
          </Text>
        </View>
      );
    }

    if (locationServicesStatus === LOCATION_SERVICES_STATUS_NOTDETERMINED) {
      locationServicesMessage = (
        <Button
          title={'Allow app to use your Location'}
          color={activeColor}
          onPress={() => {
            requestLocationServicesAuthorization();
          }}
        />
      );
    } else if (locationServicesStatus === LOCATION_SERVICES_STATUS_DENIED) {
      locationServicesMessage = (
        <Button
          title={'Allow app to use your Location'}
          color={activeColor}
          onPress={() => {
            Alert.alert(
              'Location Access',
              'Go to Settings, then Privacy, then Location Services, then Beacon Deployment Tool to allow location access while using this app.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Settings',
                  onPress: () => {
                    const url = 'app-settings:';
                    Linking.canOpenURL(url).then((supported) => {
                      Linking.openURL(url);
                    });
                  },
                },
              ],
            );
          }}
        />
      );
    }

    content = (
      <View style={styles.notDetectingContainer}>
        <Text>
          {'Cannot detect any beacons.\nPlease follow the instructions below to fix this issuie.'}
        </Text>
        {blueToothMessage}
        {locationServicesMessage}
      </View>
    );
  } else {
    const detectedRegionsText = detectedRegions.size !== 0 ? detectedRegions.join(', ') : 'None';
    const detectedFloorsText = detectedFloor || 'None';

    content = (
      <View style={styles.detectedContainer}>
        <View>
          <View>
            <Text style={styles.detectedHeadingText}>
              {'Detected Regions'}
            </Text>
            <Text style={styles.detectedDataText}>
              {detectedRegionsText}
            </Text>
          </View>
          <View>
            <Text style={styles.detectedHeadingText}>
              {'Detected Floor'}
            </Text>
            <Text style={styles.detectedDataText}>
              {detectedFloorsText}
            </Text>
          </View>
        </View>
        {renderKnownBeacons(regionsByFloor, blockedBy, screenProps, deleteBeacon, unknownBeacons)}
        {renderUnknownBeacons(unknownBeacons, screenProps, deleteBeacon)}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {content}
    </View>
  );
};

ScreenDetect.navigationOptions = {
  title: 'Detect',
};

export default ScreenDetect;
