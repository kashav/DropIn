import React, { Component } from 'react';
import { AsyncStorage, Navigator } from 'react-native';

import Home from '../Home';

export default class Root extends Component {
  state = {
    data: [],
    lastUpdated: null,
    error: null,
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
      .catch(error => this.setState({ error }));
  }

  render() {
    return (
      <Navigator
        initialRoute={{ title: 'Home', index: 0 }}
        renderScene={(route, navigator) =>
          <Home data={this.state.data} error={this.state.error}/>
        }
      />
    );
  }
}
