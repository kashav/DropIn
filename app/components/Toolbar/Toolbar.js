import React, { Component } from 'react';
import { Modal, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ToolbarAndroid from 'ToolbarAndroid';

export default class Toolbar extends Component {
  constructor(props) {
    super(props);
  }

  onActionSelected(position) {
    switch(position) {
      case 0:
        this.props.reload();
        break;
      case 1:
        this.props.showInfoModal();
        break;
    }
  }

  render() {
    let actions = [
      { title: 'Reload', iconName: 'refresh', iconSize: 25, show: 'always' },
      { title: 'Info', iconName: 'info-outline', iconSize: 25, show: 'always' }
    ];

    return (
      <Icon.ToolbarAndroid
        actions={actions}
        onActionSelected={this.onActionSelected.bind(this)}
        style={styles.toolbar}
        title={this.props.title || 'Drop-In'}
        titleColor={'#fff'} />
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    backgroundColor: 'rgb(0, 42, 92)'
  }
});
