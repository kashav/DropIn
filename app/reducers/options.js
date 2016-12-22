import * as types from '../actions/actionTypes';

const initialState = {
  sort: 0,
  time: null,
  day: null,
};

export default function classes(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_SORT_INDEX:
      return {
        ...state,
        sort: action.sortIndex,
      };
    case types.SET_DAY:
      return {
        ...state,
        day: action.day
      };
    case types.SET_TIME:
      return {
        ...state,
        time: action.time
      };
    default:
      return state;
  }
}
