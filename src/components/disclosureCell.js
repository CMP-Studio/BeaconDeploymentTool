// @flow
/* eslint-disable global-require */
import React from 'react';

import { Text, View, TouchableHighlight, Image, StyleSheet } from 'react-native';

import {
  textColor,
  screenBackgroundColor,
  textSize,
  listSeparatorColor,
  smallTextSize,
  verySmallTextSize,
} from '../styles';

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
  cellTitleContrainer: {
    flex: 1,
    flexDirection: 'column',
  },
  cellTitle: {
    fontSize: textSize,
    color: textColor,
  },
  cellSubtitle: {
    fontSize: smallTextSize,
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
  subtitle: ?string,
  renderSeparator: boolean,
  onPress: () => void,
};

const DisclosureCell = (props: DisclosureCellProps) => {
  let subtitle;
  if (props.subtitle) {
    subtitle = (
      <Text style={styles.cellSubtitle}>
        {props.subtitle}
      </Text>
    );
  }

  return (
    <TouchableHighlight onPress={props.onPress}>
      <View style={styles.cellContainer}>
        <View style={styles.cell}>
          <View style={styles.cellTitleContrainer}>
            <Text
              style={[
                styles.cellTitle,
                subtitle
                  ? {
                    fontSize: verySmallTextSize,
                    textDecorationLine: 'line-through',
                  }
                  : {},
              ]}
            >
              {props.title}
            </Text>
            {subtitle}
          </View>
          <Image style={styles.cellImage} source={require('../assets/DisclosureIndicator.png')} />
        </View>
        <View style={props.renderSeparator ? styles.separator : {}} />
      </View>
    </TouchableHighlight>
  );
};

export default DisclosureCell;
