import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

import { SCREEN_TWO } from '../actions/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9F',
  },
});

const ScreenOne = (props) => {
  return (
    <View style={styles.container}>
      <Button
        title={'Screen Two'}
        onPress={() => {
          const { navigate } = props.screenProps.navActions;
          navigate(SCREEN_TWO, { text: 'Welcome to Screen Two' });
        }}
      />
    </View>
  );
};

ScreenOne.navigationOptions = {
  title: 'Screen One',
};

export default ScreenOne;
