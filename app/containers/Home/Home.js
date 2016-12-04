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
      classList: null,
      activeTab: 0,
    };
  }

  onChangeTab({ i, ref }) {
    this.setState({ activeTab: i });
  }

  onSortToggle() {
    let sort;

    switch(this.state.sort) {
      case 'CODE':
        sort = 'TIME';
        break;
      case 'TIME':
        sort = 'LOCATION';
        break;
      case 'LOCATION':
        sort = 'NAME';
        break;
      case 'NAME':
      default:
        sort = 'CODE';
    }

    this.state.classList.resort(sort);
    ToastAndroid.show(`Sorting by ${sort.slice(0, 1)}${sort.slice(1).toLowerCase()}`, ToastAndroid.SHORT);
    this.setState({ sort });
  }

  render() {
    if (this.props.data.length === 0) {
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
        <TabView onChangeTab={this.onChangeTab.bind(this)}>
          <View tabLabel='class' style={styles.tab}>
            <CurrentClassList
             data={this.props.data}
             sort={this.state.sort}
             ref={(list) => { this.state.classList = list; }}/>
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
        <Toolbar title={this.state.title} onSortToggle={this.onSortToggle.bind(this)}/>
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
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
});
