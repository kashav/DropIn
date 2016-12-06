import { AsyncStorage } from 'react-native';
import * as types from './actionTypes';
import { VERSION } from '../constants';

function setInitialState(data) {
  return { type: types.SET_INITIAL_STATE, data };
}

function setUserPosition(position) {
  return { type: types.SET_USER_POSITION, position };
}

function setError(error) {
  return { type: types.SET_ERROR, error };
}

export function loadInitialState() {
  let data, lastUpdated, version;

  return async function (dispatch) {
    try {
      data = JSON.parse(await AsyncStorage.getItem('UofTDropIn:data'));
      lastUpdated = new Date(await AsyncStorage.getItem('UofTDropIn:lastupdated'));
      version = await AsyncStorage.getItem('UofTDropIn:version');

      if (!data || !version || !lastUpdated || version !== VERSION || lastUpdated.setDate(lastUpdated.getDate() + 7) < (new Date()))
        throw new Error("Data out of date");
    } catch(error) {
      dispatch(fetchData()).done();
      return;
    }

    dispatch(setInitialState(data));
  }
}

export function fetchData() {
  let data, lastUpdated;

  return function (dispatch) {
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
            dispatch(setInitialState(data));
          });
        });
      })
      .catch(error => dispatch(setError(error)));
  }
}

export function loadUserPosition() {
  return function (dispatch) {
    navigator.geolocation.getCurrentPosition(
      (position) => dispatch(setUserPosition(position)),
      (error) => console.error(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }
}
