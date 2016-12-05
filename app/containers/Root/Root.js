import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

import Home from '../Home';

const VERSION = '0.1';

export default class Root extends Component {
  state = {
    data: [],
    lastUpdated: null,
    error: null,
  };

  componentDidMount() {
    this.loadInitialState().done();
  }

  loadInitialState = async () => {
    try {
      let data = JSON.parse(await AsyncStorage.getItem('UofTDropIn:data'));
      let lastUpdated = new Date(await AsyncStorage.getItem('UofTDropIn:lastupdated'));
      let version = await AsyncStorage.getItem('UofTDropIn:version');

      if (!data || !version || !lastUpdated || version !== VERSION || lastUpdated.setDate(lastUpdated.getDate() + 7) < (new Date()))
        throw new Error("Data out of date");

      this.setState({ data, lastUpdated });
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
        this.setState({ data, lastUpdated });

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
  }

  render() {
    return <Home data={this.state.data} error={this.state.error}/>
  }
}
