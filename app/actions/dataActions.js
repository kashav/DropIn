import { AsyncStorage, PermissionsAndroid } from 'react-native';
import * as types from './actionTypes';
import { BASE_API_URL, DEFAULT_REQUEST_PARAMS, VERSION } from '../constants';
import { generateQuery } from '../util/query';

function setCourseData(data, query) {
  return { type: types.SET_COURSE_DATA, data, query };
}

function setUserPosition(position) {
  return { type: types.SET_USER_POSITION, position };
}

function setError(error) {
  return { type: types.SET_ERROR, error };
}

export function fetchData(q = {}) {
  return async function (dispatch) {
    let query = Object.assign(DEFAULT_REQUEST_PARAMS, generateQuery(q));
    let params = Object.keys(query)
                       .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(query[key]))
                       .join("&")
                       .replace(/%20/g, "+");

    await fetch(`${BASE_API_URL}/courses?${params}`)
      .then(response => response.json())
      .then(json => dispatch(setCourseData(json, query)))
      .catch(error => dispatch(setError(error)));
  }
}

export function loadUserPosition() {
  return async function (dispatch) {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.requestPermission(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          { title: 'Enable location', message: '', },
        );

        return granted;
      } catch (err) {}
    };

    await requestLocationPermission().then(granted => {
      if (!granted)
        return dispatch(setUserPosition({ coords: { longitude: -79.3957, latitude: 43.6629 } }));

      navigator.geolocation.getCurrentPosition(
        (position) => dispatch(setUserPosition(position)),
        (error) => {
          console.warn(error);
          dispatch(setUserPosition({ coords: { longitude: -79.3957, latitude: 43.6629 } }));
        },
        { enableHighAccuracy: false, timeout: 60000, maximumAge: 0 }
      );
    });
  }
}
