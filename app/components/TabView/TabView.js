import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import TabBar from './TabBar';

export default class TabView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollableTabView
        renderTabBar={() => <TabBar />}
        onChangeTab={this.props.onChangeTab}
        children={this.props.children}
      />
    )
  }
}
