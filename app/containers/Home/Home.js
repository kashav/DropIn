import React, { Component } from 'react';
import {
  AsyncStorage,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { vw, vh, vmin, vmax } from 'react-native-viewport-units';

import CurrentClassList from '../../components/CurrentClassList';
import EmptyRoomList from '../../components/EmptyRoomList'
import ErrorCard from '../../components/ErrorCard';
import InfoPanel from '../../components/InfoPanel';
import TabView from '../../components/TabView';
import Toolbar from '../../components/Toolbar';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: 'CODE',
      title: 'Drop-In',
      activeTab: 0,
    };
  }

  onSortToggle() {
    let sortTypes = ['CODE', 'TIME', 'LOCATION', 'NAME'];
    let i = sortTypes.indexOf(this.state.sort);
    let sort = i + 1 >= sortTypes.length ? sortTypes[0] : sortTypes[i+1];
    this.classList.resort(sort);
    ToastAndroid.show(`Sorting by ${sort.toLowerCase()}`, ToastAndroid.SHORT);
    this.setState({ sort });
  }

  render() {
    if (!this.props.data || !this.props.data.buildings || !this.props.data.courses) {
      return (
        <View style={{flex: 1}}>
          <Spinner visible={true} size={'large'} color={'rgb(0, 42, 92)'} overlayColor={'#efefef'}/>
        </View>
      );
    }

    let component;

    if (this.props.error !== null) {
      component = <ErrorCard />;
    } else {
      component = (
        <TabView onChangeTab={({ i, ref }) => this.setState({ activeTab: i })}>
          <View tabLabel='class' style={styles.tab}>
            <CurrentClassList
              courses={this.props.data.courses}
              buildings={this.props.data.buildings}
              sort={this.state.sort}
              ref={classList => { this.classList = classList; }} />
          </View>
          <View tabLabel='lock-open' style={styles.tab}>
            <EmptyRoomList />
          </View>
          <View tabLabel='info-outline' style={styles.tab}>
            <InfoPanel />
          </View>
        </TabView>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar />
        <Toolbar title={this.state.title} showActions={!this.props.error && this.state.activeTab === 0} onSortToggle={this.onSortToggle.bind(this)} />
        {component}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  tab: {
    flex: 1,
    padding: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
});
