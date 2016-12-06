import React, { Component } from 'react';
import { View } from 'react-native';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import Spinner from 'react-native-loading-spinner-overlay';

import * as actions from '../../actions/dataActions';
import * as reducers from '../../reducers';
import Home from '../Home';

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default class Root extends Component {
  constructor() {
    super();
    this.state = { loaded: false };
  }

  componentWillMount() {
    store.dispatch(actions.loadUserPosition());
    store.dispatch(actions.loadInitialState()).done(() => this.setState({ loaded: true }))
  }

  render() {
    if (!this.state.loaded)
      return <View style={{flex: 1}}><Spinner visible={true} size={'large'} color={'rgb(0, 42, 92)'} overlayColor={'#efefef'}/></View>;

    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }
}
