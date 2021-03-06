// @flow
import React, { Component } from 'react';
import {
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Text,
  Modal,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { List } from 'immutable';
import { Beacon } from '../actions/beacons';

import type {
  BeaconType,
  BeaconIDType,
  UpdateBeaconType,
  RecreateBeaconType,
  DeleteBeaconType,
} from '../actions/beacons';
import type { AllBeaconsType } from '../reducers/beacons';

import {
  activeColor,
  screenBackgroundColor,
  headingTextSize,
  textSupportingColor,
  textSize,
  textColor,
  listSeparatorColor,
  listHeaderColor,
  modalBackgroundColor,
  headerTextSize,
  headerFontWeight,
  headerBackgroundColor,
} from '../styles';
import { paramsToProps } from '../utilityViews';

const styles = StyleSheet.create({
  container: {
    backgroundColor: screenBackgroundColor,
  },
  contentContainer: {
    flexDirection: 'column',
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  row: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: screenBackgroundColor,
  },
  rowHeaderText: {
    fontSize: headingTextSize,
    color: textSupportingColor,
  },
  rowTitleItem: {
    flex: 0.3,
    alignItems: 'flex-start',
  },
  rowTitleText: {
    fontSize: textSize,
    color: textColor,
  },
  rowDataItem: {
    flex: 0.7,
    alignItems: 'flex-end',
  },
  rowDataText: {
    fontSize: textSize,
    color: activeColor,
  },
  rowDataEditableText: {
    textAlign: 'right',
  },
  rowListHeader: {
    backgroundColor: listHeaderColor,
    // TODO: Fix this latter...
    paddingHorizontal: 10,
    marginHorizontal: -10,
  },
  rowListText: {
    fontSize: textSize,
  },
  rowListTextBold: {
    fontWeight: '600',
  },
  removeButton: {
    borderColor: activeColor,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 15,
  },
  removeButtonTitle: {
    fontSize: textSize,
    color: activeColor,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: modalBackgroundColor,
  },
  modalBox: {
    height: '70%',
    width: '85%',
    borderRadius: 20,
    backgroundColor: screenBackgroundColor,
    overflow: 'hidden',
  },
  modalHeader: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: headerBackgroundColor,
    borderBottomColor: listSeparatorColor,
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    textAlign: 'center',
    fontSize: headerTextSize,
    fontWeight: headerFontWeight,
  },
});

function detectCycle(
  uuid: BeaconIDType,
  beacon: BeaconType,
  allBeacons: AllBeaconsType,
  visited: Array<BeaconIDType>,
) {
  if (beacon.blocks.size === 0) {
    return false;
  } else if (beacon.blocks.includes(uuid)) {
    return true;
  }

  let newVisited = [...visited, beacon.uuid];

  // eslint-disable-next-line no-restricted-syntax
  for (const currBeaconUUID of beacon.blocks.toArray()) {
    if (!newVisited.includes(currBeaconUUID)) {
      const currBeacon = allBeacons.get(currBeaconUUID);

      if (detectCycle(uuid, currBeacon, allBeacons, newVisited)) {
        return true;
      }

      newVisited = [...newVisited, currBeaconUUID];
    }
  }

  return false;
}

function wouldBlockingCauseACycle(uuid, currBeacon, allBeacons) {
  if (currBeacon.blocks.size === 0) {
    return false;
  } else if (currBeacon.blocks.includes(uuid)) {
    return true;
  }

  return detectCycle(uuid, currBeacon, allBeacons, [uuid]);
}

const REGION_MODAL = 'REGION_MODAL';
const BLOCKS_MODAL = 'BLOCKS_MODAL';
type ModalType = 'REGION_MODAL' | 'BLOCKS_MODAL';

class ScreenBeaconInfo extends Component {
  static navigationOptions = ({ navigation }) => {
    const { beaconUuid, deleteBeacon } = navigation.state.params;

    const disableDelete = !beaconUuid;
    const deleteBeaconAction = () => {
      Alert.alert(
        'Delete Beacon',
        'Are you sure you want to delete this beacon? This action cannot be undone.',
        [
          {
            text: 'Delete',
            onPress: () => {
              deleteBeacon(beaconUuid);
            },
            style: 'destructive',
          },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: false },
      );
    };

    const deleteButton = (
      <Button
        title="Delete"
        color={activeColor}
        disabled={disableDelete}
        onPress={deleteBeaconAction}
      />
    );

    const screenTitle = navigation.state.params.screenTitle || 'Beacon Info';
    return {
      title: screenTitle,
      headerRight: deleteButton,
    };
  };

  static defaultNewRegionTitle = 'Create New Region';

  constructor(props) {
    super(props);

    this.updateState.bind(this);
    this.updateBeacon.bind(this);

    this.cancelListStateChanges.bind(this);
    this.updateListItem.bind(this);
    this.setModalVisible.bind(this);
    this.renderModal.bind(this);

    this.updateHeader.bind(this);

    if (props.beaconUuid) {
      const beacon = props.allBeacons.get(props.beaconUuid);
      this.state = {
        name: beacon.name,
        uuid: beacon.uuid,
        floor: beacon.floor,
        region: beacon.region,
        blocks: beacon.blocks,
        modalVisible: false,
        newRegion: ScreenBeaconInfo.defaultNewRegionTitle,
      };
    } else {
      this.state = {
        name: 'Unnamed',
        uuid: 'None',
        floor: 'Unassigned',
        region: '',
        blocks: List(),
        modalVisible: false,
        newRegion: ScreenBeaconInfo.defaultNewRegionTitle,
      };
    }
  }

  // eslint-disable-next-line react/sort-comp
  props: {
    screenTitle: string, // eslint-disable-line react/no-unused-prop-types
    navigation: any,
    beaconUuid: BeaconIDType,
    allBeacons: AllBeaconsType,
    updateBeacon: UpdateBeaconType,
    recreateBeacon: RecreateBeaconType,
    deleteBeacon: DeleteBeaconType,
  };

  state: {
    prevUuid?: BeaconIDType,
    name: string,
    uuid: BeaconIDType,
    floor: string,
    region: string,
    blocks: List<BeaconIDType>,
    modalVisible: Boolean,
    modalType: ?ModalType,
    newRegion: string,
  };

  componentWillReceiveProps(nextProps) {
    const beacon: BeaconType = nextProps.allBeacons.get(this.state.uuid);

    if (beacon) {
      const prevUuid = this.state.prevUuid;
      this.setState(
        () => {
          return {
            prevUuid: null,
            name: beacon.name,
            uuid: beacon.uuid,
            floor: beacon.floor,
            region: beacon.region,
            blocks: beacon.blocks,
            newRegion: ScreenBeaconInfo.defaultNewRegionTitle,
          };
        },
        () => {
          if (nextProps.screenTitle !== beacon.name || prevUuid != null) {
            this.updateHeader(beacon.name, beacon.uuid);
          }
        },
      );
    }
  }

  updateHeader(name, uuid) {
    this.props.navigation.setParams({
      screenTitle: name,
      beaconUuid: uuid,
      deleteBeacon: this.props.deleteBeacon,
    });
  }

  updateState(key, value) {
    this.setState(() => {
      const obj = {};
      obj[key] = value;

      if (key === 'uuid' && this.state.prevUuid == null) {
        obj.prevUuid = this.state.uuid;
      }

      return Object.assign({}, this.state, obj);
    });
  }

  updateBeacon(key) {
    let updatedRegion;
    let updatedBlocks;
    switch (key) {
      case 'newBlock': {
        updatedBlocks = this.state.blocks;
        break;
      }

      case 'newRegion': {
        if (this.state.newRegion !== ScreenBeaconInfo.defaultNewRegionTitle) {
          updatedRegion = this.state.newRegion;
        } else {
          updatedRegion = this.state.region;
        }
        break;
      }

      // no default
    }

    const newBeacon = Beacon({
      name: this.state.name,
      uuid: this.state.uuid,
      floor: this.state.floor,
      region: updatedRegion || this.state.region,
      blocks: updatedBlocks || this.state.blocks,
    });

    if (key === 'uuid') {
      this.props.recreateBeacon(newBeacon, this.state.prevUuid);
    } else {
      this.props.updateBeacon(newBeacon);
    }
  }

  setModalVisible(visible, modalType) {
    this.setState(() => {
      return {
        modalType: modalType || null,
        modalVisible: visible,
      };
    });
  }

  cancelListStateChanges() {
    this.setState(() => {
      const beacon: BeaconType = this.props.allBeacons.get(this.state.uuid);

      return {
        region: beacon.region,
        blocks: beacon.blocks,
        newRegion: ScreenBeaconInfo.defaultNewRegionTitle,
      };
    });
  }

  updateListItem(listType, item) {
    if (listType === 'newBlock') {
      let newList = this.state.blocks;

      const foundIndex = newList.indexOf(item);
      if (foundIndex === -1) {
        newList = newList.push(item);
      } else {
        newList = newList.delete(foundIndex);
      }

      this.setState(() => {
        return {
          blocks: newList,
        };
      });
    } else {
      this.setState(() => {
        return {
          region: item,
        };
      });
    }
  }

  renderRegion(region) {
    if (region === '') {
      const text = 'No Region Set';

      return (
        <View style={[styles.row, { marginBottom: 10 }]}>
          <View style={styles.rowTitleItem}>
            <Text style={[styles.rowListText, styles.rowListTextBold]}>{text}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.row}>
        <View style={styles.rowTitleItem}>
          <Text style={styles.rowListText}>{region}</Text>
        </View>
      </View>
    );
  }

  renderBlocksList(blocks) {
    if (blocks.size === 0) {
      const text = 'No Blocks Set';

      return (
        <View style={[styles.row, { marginBottom: 10 }]}>
          <View style={styles.rowTitleItem}>
            <Text style={[styles.rowListText, styles.rowListTextBold]}>{text}</Text>
          </View>
        </View>
      );
    }

    return blocks.toArray().map((beaconID, index, array) => {
      const lastItem = index === array.length - 1;

      let displayName = beaconID;
      const beacon = this.props.allBeacons.get(beaconID);
      displayName = beacon.name;

      return (
        <View
          key={beaconID}
          style={[
            styles.row,
            lastItem
              ? { marginBottom: 10 }
              : {
                height: 45,
                borderBottomColor: listSeparatorColor,
                borderBottomWidth: 1,
              },
          ]}
        >
          <View style={styles.rowTitleItem}>
            <Text style={styles.rowListText}>{displayName}</Text>
          </View>
        </View>
      );
    });
  }

  renderEditableList(listType) {
    const listData = [];
    const state = listType === 'newBlock' ? this.state.blocks : this.state.region;

    const preventCyclesMessageRow = (
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowListText, styles.rowListTextBold]}>
            {'Cannot add Blocks without creating a cycle'}
          </Text>
        </View>
      </View>
    );

    if (listType === 'newBlock' && this.props.allBeacons.size === 1) {
      return preventCyclesMessageRow;
    }

    this.props.allBeacons.forEach((beacon) => {
      if (listType === 'newRegion') {
        if (beacon.region !== '') {
          if (!listData.includes(beacon.region)) {
            listData.push(beacon.region);
          }
        }

        // 1. Do not block yourself
      } else if (beacon.uuid !== this.state.uuid) {
        // 2. Prevent cycles
        if (!wouldBlockingCauseACycle(this.state.uuid, beacon, this.props.allBeacons)) {
          // 3. Don't add multiples
          if (!listData.includes(beacon.uuid)) {
            listData.push(beacon.uuid);
          }
        }
      }
    });

    if (listType === 'newBlock' && listData.length === 0) {
      return preventCyclesMessageRow;
    }

    return listData.map((datum, index, array) => {
      const lastItem = index === array.length - 1;
      const checked = state.includes(datum);

      let beacon;
      let displayName = datum;
      if (listType === 'newBlock') {
        beacon = this.props.allBeacons.get(datum);
        displayName = beacon.name;
      }

      return (
        <View
          key={datum}
          style={[
            { paddingHorizontal: 10 },
            lastItem
              ? {}
              : {
                height: 45,
                borderBottomColor: listSeparatorColor,
                borderBottomWidth: 1,
              },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              if (listType === 'newRegion') {
                this.updateListItem(listType, datum);
              } else {
                this.updateListItem(listType, beacon.uuid);
              }
            }}
          >
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowListText, { color: activeColor }]}>{displayName}</Text>
              </View>
              <View>
                <View
                  style={
                    checked
                      ? {
                        width: 22.5,
                        height: 11,
                        borderBottomColor: activeColor,
                        borderBottomWidth: 4,
                        borderLeftColor: activeColor,
                        borderLeftWidth: 4,
                        transform: [{ rotate: '-45deg' }],
                      }
                      : {}
                  }
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    });
  }

  renderModal() {
    const modalType = this.state.modalType;
    let headerTitle;
    let listHeaderTitle;
    let stateEditKey;
    let addNewRegionElements;

    switch (modalType) {
      case REGION_MODAL: {
        headerTitle = 'Set Region';
        listHeaderTitle = 'Set Region';
        stateEditKey = 'newRegion';

        const textInputValue = this.state.newRegion;
        const textInputsDisabled = textInputValue === ScreenBeaconInfo.defaultNewRegionTitle;

        addNewRegionElements = (
          <View style={[styles.row, { marginHorizontal: 10 }]}>
            <TextInput
              style={[styles.rowDataItem, styles.rowDataText, { textAlign: 'left' }]}
              returnKeyType={'done'}
              onChangeText={(text) => {
                this.updateState(stateEditKey, text);
              }}
              value={textInputValue}
            />
            <View style={[styles.rowTitleItem, { alignItems: 'flex-end' }]}>
              <Button
                title="Set"
                color={activeColor}
                disabled={textInputsDisabled}
                onPress={() => {
                  Keyboard.dismiss();
                  this.updateBeacon(stateEditKey);
                }}
              />
            </View>
          </View>
        );
        break;
      }
      case BLOCKS_MODAL: {
        headerTitle = 'Edit Blocks';
        listHeaderTitle = 'Set Blocks';
        stateEditKey = 'newBlock';
        break;
      }
      default: {
        return null;
      }
    }

    return (
      <Modal animationType={'slide'} transparent={true} visible={this.state.modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.updateBeacon(stateEditKey);
            Keyboard.dismiss();
            this.setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalBox}>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 0.25 }}>
                    <Button
                      title="Cancel"
                      color={activeColor}
                      onPress={() => {
                        this.cancelListStateChanges(stateEditKey);
                        this.setModalVisible(false);
                      }}
                    />
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text style={styles.modalHeaderText}>{headerTitle}</Text>
                  </View>
                  <View style={{ flex: 0.25 }}>
                    <Button
                      title="Done"
                      color={activeColor}
                      onPress={() => {
                        this.updateBeacon(stateEditKey);
                        this.setModalVisible(false);
                      }}
                    />
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                  {addNewRegionElements}
                  <ScrollView style={{ flex: 1 }} stickyHeaderIndices={[0]}>
                    <View key={'header'} style={[styles.row, styles.rowListHeader]}>
                      <View style={(styles.rowTitleItem, { marginHorizontal: 10 })}>
                        <Text style={styles.rowHeaderText}>{listHeaderTitle}</Text>
                      </View>
                    </View>
                    {this.renderEditableList(stateEditKey)}
                  </ScrollView>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  render() {
    const editListButton = (editMessage, onPress) => {
      return (
        <TouchableOpacity onPress={onPress}>
          <Text style={{ color: activeColor, fontSize: textSize }}>
            {editMessage}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View style={{ flex: 1 }}>
        {this.renderModal()}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.row}>
              <View style={styles.rowTitleItem}>
                <Text style={styles.rowHeaderText}>Info</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowTitleItem}>
                <Text style={styles.rowTitleText}>Name</Text>
              </View>
              <TextInput
                style={[styles.rowDataItem, styles.rowDataText, styles.rowDataEditableText]}
                returnKeyType={'done'}
                onChangeText={(text) => {
                  this.updateState('name', text);
                }}
                onBlur={() => {
                  this.updateBeacon('name');
                }}
                value={this.state.name}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.rowTitleItem}>
                <Text style={styles.rowTitleText}>ID</Text>
              </View>
              <TextInput
                style={[styles.rowDataItem, styles.rowDataText, styles.rowDataEditableText]}
                returnKeyType={'done'}
                onChangeText={(text) => {
                  this.updateState('uuid', text);
                }}
                onBlur={() => {
                  this.updateBeacon('uuid');
                }}
                value={this.state.uuid}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.rowTitleItem}>
                <Text style={styles.rowTitleText}>Floor</Text>
              </View>
              <TextInput
                style={[styles.rowDataItem, styles.rowDataText, styles.rowDataEditableText]}
                returnKeyType={'done'}
                onChangeText={(text) => {
                  this.updateState('floor', text);
                }}
                onBlur={() => {
                  this.updateBeacon('floor');
                }}
                value={this.state.floor}
              />
            </View>
            <View style={[styles.row, styles.rowListHeader]}>
              <View style={styles.rowTitleItem}>
                <Text style={styles.rowHeaderText}>Region</Text>
              </View>
              <View style={styles.rowDataItem}>
                {editListButton('Set Region', () => {
                  this.setModalVisible(true, REGION_MODAL);
                })}
              </View>
            </View>
            {this.renderRegion(this.state.region)}
            <View style={[styles.row, styles.rowListHeader]}>
              <View style={styles.rowTitleItem}>
                <Text style={styles.rowHeaderText}>Blocks</Text>
              </View>
              <View style={styles.rowDataItem}>
                {editListButton('Edit Blocks', () => {
                  this.setModalVisible(true, BLOCKS_MODAL);
                })}
              </View>
            </View>
            {this.renderBlocksList(this.state.blocks)}
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default paramsToProps(ScreenBeaconInfo);
