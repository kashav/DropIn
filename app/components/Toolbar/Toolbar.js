import React, { Component } from 'react';
import { Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ToolbarAndroid from 'ToolbarAndroid';

export default class Toolbar extends Component {
  onActionSelected(button) {
    Alert.alert('Button', `You clicked button ${button}!`);
  }

  render() {
    return (
      <Icon.ToolbarAndroid
        actions={[
          { title: 'Sort', iconName: 'sort', iconSize: 20, show: 'always' },
          { title: 'Refresh', iconName: 'refresh', iconSize: 20, show: 'always' }
        ]}
        onActionSelected={this.onActionSelected.bind(this)}
        style={styles.toolbar}
        title={this.props.title || 'UofT Drop-In'}
        titleColor={'#fff'}
      />
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    backgroundColor: 'rgb(0, 42, 92)',
  }
});
