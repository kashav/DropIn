import React, { Component } from 'react';
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
        children={this.props.children}
      />
    )
  }
}
