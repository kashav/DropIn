import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

import Home from '../Home';

const VERSION = '0.1';

export default class Root extends Component {
  state = {
    data: {},
    lastUpdated: null,
    error: null,
  };

  componentDidMount() {
    this.loadInitialState().done();
  }

  loadInitialState = async () => {
    let data, lastUpdated, version;

    try {
      data = JSON.parse(await AsyncStorage.getItem('UofTDropIn:data'));
      lastUpdated = new Date(await AsyncStorage.getItem('UofTDropIn:lastupdated'));
      version = await AsyncStorage.getItem('UofTDropIn:version');

      if (!data || !version || !lastUpdated || version !== VERSION || lastUpdated.setDate(lastUpdated.getDate() + 7) < (new Date()))
        throw new Error("Data out of date");
    } catch(error) {
      return this.fetchCourseData();
    }

    this.setState({ data, lastUpdated });
  }

  fetchCourseData() {
    console.log('Fetching data');

    let data, lastUpdated;

    // TODO - refactor this to use an API or something. Right now I'm limiting
    // course data to only UTSG and the _current_ term (since RN limits database
    // storage to 6 MB on Android)
    fetch('http://drop-in.kshvmdn.com/data.json')
      .then(response => response.json())
      .then(response => {
        data = response;
        lastUpdated = new Date();
        AsyncStorage.multiRemove([
          'UofTDropIn:data',
          'UofTDropIn:lastUpdated',
          'UofTDropIn:version',
        ], (err) => {
          if (err) throw err;

          AsyncStorage.multiSet([
            ['UofTDropIn:data', JSON.stringify(data)],
            ['UofTDropIn:lastupdated', lastUpdated],
            ['UofTDropIn:version', VERSION],
          ], (err) => {
            if (err) throw err;
          });
        });
      })
      .catch(error => this.setState({ error }));

      this.setState({ data, lastUpdated });
  }

  render() {
    return <Home data={this.state.data} error={this.state.error}/>
  }
}
