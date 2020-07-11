import React from 'react';
import {Text, View, TouchableHighlight} from 'react-native';

export default class Card extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          height: '95%',
          width: '100%',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          margin: 5,
          backgroundColor: this.props.is_open ? '#eee' : '#228B22',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 2,
          elevation: 2,
          borderWidth: 1,
          borderRadius: 5,
          flexWrap: 'wrap',
        }}>
        <TouchableHighlight
          style={{
            width: '100%',
            heigth: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
          onPress={this.props.clickCard}>
          <Text
            style={{
              textAlign: 'center',
            }}>
            {this.props.is_open ? this.props.position : 'Tap to Uncover'}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
