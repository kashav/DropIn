import * as types from '../actions/actionTypes';

const initialState = {
  courses: null,
  currentPosition: null,
  query: null,
  error: null,
};

export default function data(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_COURSE_DATA:
      return {
        ...state,
        courses: action.data,
        query: action.query,
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
