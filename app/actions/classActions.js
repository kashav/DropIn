import * as types from './actionTypes';
import { ALL_DAYS, SORT_METHODS } from '../constants';
import { calculateDistance } from '../util/location';

function setCourses(classes) {
  return { type: types.SET_CURRENT_CLASSES, classes };
}

export function toggleSort() {
  return { type: types.TOGGLE_SORT };
}

export function findCurrentCourses({ courses: allCourses, buildings, currentPosition: userPosition }, { sort: sortIndex }) {
  return function (dispatch) {
    let now = new Date();
    let currentDay = ALL_DAYS[now.getDay()];
    let currentTime = now.getHours() * 60 * 60 + now.getMinutes() * 60;

    // const TIMES = [{ currentDay: 'WEDNESDAY', currentTime: 46900 }, { currentDay: 'FRIDAY', currentTime: 35340 }, { currentDay: 'THURSDAY', currentTime: 60000 }];
    // let { currentDay, currentTime } = TIMES[Math.floor(Math.random()*TIMES.length)];

    let classes = JSON.parse(JSON.stringify(allCourses)).map(c => {
      c.meeting_sections = c.meeting_sections.map(s => {
        s.times = s.times.filter(t => t.day === currentDay && currentTime <= t.end && t.start <= currentTime + 1800);

        if (/^(L)\d{4}$/i.test(s.code) && s.times.length > 0)
          return s;
      }).filter(s => s);

      if (c.meeting_sections.length > 0)
        return c;
    }).filter(c => c);

    dispatch(sortClasses({ classes, buildings, userPosition, sortIndex }));
  }
}

export function sortClasses({ classes, buildings, userPosition, sortIndex }) {
  return function(dispatch) {
    let sorted;

    switch(SORT_METHODS[sortIndex]) {
      case 'CODE':
        sorted = classes.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0));
        break;
      case 'LOCATION':
        let { latitude, longitude } = userPosition.coords;
        let userCoords = { lat: latitude, lng: longitude };
        let distFromA, distFromB;

        sorted = classes.sort((a, b) => {
          try {
            let { lat: latA, lng: lngA } = buildings[a.meeting_sections[0].times[0].location.building];
            let { lat: latB, lng: lngB } = buildings[b.meeting_sections[0].times[0].location.building];
            distFromA = calculateDistance(userPosition, {lat: latA, lng: lngA});
            distFromB = calculateDistance(userPosition, {lat: latB, lng: lngB});
          } catch(e) {
            return 1;
          }

          return distFromA < distFromB ? 1 : (distFromB < distFromA ? -1 : 0);
        });

        break;
      case 'TIME':
        sorted = classes.sort((a, b) => (a.meeting_sections[0].times[0].start > b.meeting_sections[0].times[0].start) ? 1 : ((b.meeting_sections[0].times[0].start > a.meeting_sections[0].times[0].start) ? -1 : 0));
        break;
      case 'NAME':
        sorted = classes.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        break;
      default:
        sorted = classes;
    }

    let classesObj = {};

    for (let c of classes)
      classesObj[`${c.id}_${(new Date()).toISOString()}`] = c;

    dispatch(setCourses(classesObj));
  }
}
