import * as types from '../actions/actionTypes';

const initialState = {
  current: null,
  sort: 0,
};

export default function classes(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_CURRENT_CLASSES:
      return {
        ...state,
        current: action.classes
      }
    case types.TOGGLE_SORT:
      return {
        ...state,
        sort: state.sort === 3 ? 0 : state.sort + 1,
      }
    default:
      return state;
  }
}
