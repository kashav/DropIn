import * as types from '../actions/actionTypes';

const initialState = {
  buildings: null,
  courses: null,
  currentPosition: null,
  error: null,
};

export default function data(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_INITIAL_STATE:
      return {
        ...state,
        buildings: action.data.buildings,
        courses: action.data.courses
      };
    case types.SET_USER_POSITION:
      return {
        ...state,
        currentPosition: action.position,
      };
    default:
      return state;
  }
}
