import * as types from '../actions/actionTypes';

const initialState = {
  current: null,
};

export default function classes(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_CURRENT_CLASSES:
      return {
        ...state,
        current: action.classes
      };
    default:
      return state;
  }
}
