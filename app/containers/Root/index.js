import React, { Component } from 'react';
import {
  AsyncStorage,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { vw, vh, vmin, vmax } from 'react-native-viewport-units';

import CurrentCourseList from '../../components/CurrentCourseList';
import ErrorCard from '../../components/ErrorCard';
import TabView from '../../components/TabView';
import Toolbar from '../../components/Toolbar';

export default class Root extends Component {
  state = {
    title: 'UofT Drop-In',
    data: [],
    lastUpdated: null,
    error: null,
    loading: true,
    sort: 'NAME'
  };

  componentDidMount() {
    this.loadInitialState().done()
  }

  loadInitialState = async () => {
    try {
      let data = JSON.parse(await AsyncStorage.getItem('UofTDropIn:data'));
      let lastUpdated = new Date(await AsyncStorage.getItem('UofTDropIn:lastupdated'));

      if (!data || !lastUpdated || lastUpdated.setDate(lastUpdated.getDate() + 7) < (new Date()))
        throw new Error("Data out of date");

      this.setState({ data, lastUpdated, loading: false });
    } catch(error) {
      this.fetchCourseData();
    }
  }

  fetchCourseData() {
    // TODO - refactor this to use an API or something. Right now I'm limiting
    // course data to only UTSG and the _current_ term (since RN limits database
    // storage to 6 MB on Android)
    fetch('https://github.com/cobalt-uoft/datasets/raw/master/courses.json')
      .then(response => response.text())
      .then(text => text.split('\n').slice(0, -1).map(o => JSON.parse(o)).filter(o => o.campus === 'UTSG' && o.term === '2017 Winter'))
      .then(data => {
        let lastUpdated = new Date();
        this.setState({ data, lastUpdated, loading: false });

        AsyncStorage.multiRemove(['UofTDropIn:data', 'UofTDropIn:lastUpdated'], (err) => {
          if (err) throw err;

          AsyncStorage.multiSet([
            ['UofTDropIn:data', JSON.stringify(data)],
            ['UofTDropIn:lastupdated', lastUpdated]
          ], (err) => {
            if (err) throw err;
          });
        });
      })
      .catch(error => this.setState({ error, loading: false }));
  }

  onChangeTab({ i, ref }) {
    let title;

    switch(i) {
      case 0:
        title = 'Current / upcoming classes';
        break;
      case 1:
        title = 'Empty lecture halls / rooms';
        break;
      default:
        title = 'UofT Drop-In';
    }

    this.setState({ title })
  }

  render() {
    if (this.state.data.length === 0) {
      return (
        <View style={{flex: 1}}>
          <Spinner visible={true} size={'large'} color={'rgb(0, 42, 92)'} overlayColor={'#efefef'}/>
        </View>
      );
    }

    let component;

    if (this.state.error !== null) {
      component = <ErrorCard />;
    } else {
      component = (
        <TabView onChangeTab={this.onChangeTab.bind(this)}>
          <View tabLabel='class' style={styles.tab}>
            <CurrentCourseList data={this.state.data} sort={this.state.sort}/>
          </View>
          <View tabLabel='lock-open' style={styles.tab}>
          </View>
          <View tabLabel='info-outline' style={styles.tab}>
          </View>
        </TabView>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar />
        <Toolbar title={this.state.title}/>
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
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    marginBottom: 20,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  cardText: {
    fontSize: 12
  },
});
