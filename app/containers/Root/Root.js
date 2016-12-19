import React, { Component } from 'react';
import { View } from 'react-native';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import Spinner from 'react-native-loading-spinner-overlay';

import * as dataActions from '../../actions/dataActions';
import * as reducers from '../../reducers';

import Home from '../Home';

const logger = createLogger({ predicate: (getState, action) => __DEV__ });
const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default class Root extends Component {
  constructor() {
    super();
    this.state = { loaded: 0 };
  }

  componentWillMount() {
    store.dispatch(dataActions.loadUserPosition()).done(setTimeout(this.done.bind(this), 5000));
    store.dispatch(dataActions.fetchData()).done(this.done.bind(this));
  }

  done() {
    this.setState({ loaded: this.state.loaded + 1 });
  }

  render() {
    if (this.state.loaded < 2)
      return <View style={{flex: 1}}><Spinner visible={true} size={'large'} color={'rgb(0, 42, 92)'} overlayColor={'#efefef'}/></View>;

    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }
}
