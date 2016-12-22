import * as types from './actionTypes';

export function setSortIndex(sortIndex) {
  return { type: types.SET_SORT_INDEX, sortIndex };
}

export function setTime(time) {
  return { type: types.SET_TIME, time };
}

export function setDay(day) {
  return { type: types.SET_DAY, day };
}
