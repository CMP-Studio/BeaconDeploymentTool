// @flow
/* eslint-disable global-require */
import React from 'react';

import { Text, View, TouchableHighlight, Image, StyleSheet } from 'react-native';

import { textColor, screenBackgroundColor, textSize, listSeparatorColor } from '../styles';

const styles = StyleSheet.create({
  cellContainer: {
    paddingLeft: 10,
    flexDirection: 'column',
    backgroundColor: screenBackgroundColor,
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellTitle: {
    flex: 1,
    fontSize: textSize,
    color: textColor,
  },
  cellImage: {
    height: 44,
    width: 44,
  },
  separator: {
    flex: 1,
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: listSeparatorColor,
  },
});

type DisclosureCellProps = {
  title: string,
  renderSeparator: boolean,
  onPress: () => void,
};

const DisclosureCell = (props: DisclosureCellProps) => {
  return (
    <TouchableHighlight onPress={props.onPress}>
      <View style={styles.cellContainer}>
        <View style={styles.cell}>
          <Text style={styles.cellTitle}>
            {props.title}
          </Text>
          <Image style={styles.cellImage} source={require('../assets/DisclosureIndicator.png')} />
        </View>
        <View style={props.renderSeparator ? styles.separator : {}} />
      </View>
    </TouchableHighlight>
  );
};

export default DisclosureCell;
