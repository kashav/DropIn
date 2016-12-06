import * as types from '../actions/actionTypes';

const initialState = null;

export default function error(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_ERROR:
      return {
        state: action.error,
      };
    default:
      return state;
  }
}
