import React from 'react';
import {View, ActivityIndicator} from 'react-native';

export default class Loader extends React.PureComponent {
  render() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}>
        <ActivityIndicator animating />
      </View>
    );
  }
}
