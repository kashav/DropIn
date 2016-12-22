import * as types from './actionTypes';
import { ALL_DAYS, DEFAULT_LOCATION, SORT_METHODS } from '../constants';
import { parseSecondsFromTime } from '../util/time';
import { calculateDistance } from '../util/location';
import buildings from '../data/buildings.json';

function setCourses(classes) {
  return { type: types.SET_CURRENT_CLASSES, classes };
}

export function parseCourseData({ courses, currentPosition: userPosition }, { sort: sortIndex }, cb = () => {}) {
  return function (dispatch) {
    let classes = Object.values(JSON.parse(JSON.stringify(courses))).map(c => {
      c.meetings = Object.values(c.meetings).map(m => {
        // Skip cancelled classes
        if (m.cancel === 'Cancelled')
          return;

        // Skip practicals & tutorials
        if (m.teachingMethod === 'PRA' || m.teachingMethod === 'TUT') {
          return;
        }

        m.instructors = Object.values(m.instructors);

        m.schedule = Object.values(m.schedule).map(s => {
          // If fall and spring location are different, concatenate them,
          // otherwise use the non-null one
          s.assignedRoom = s.assignedRoom1
            ? s.assignedRoom2
              ? s.assignedRoom1 === s.assignedRoom2
                ? s.assignedRoom1
                : `${s.assignedRoom1} (F), ${s.assignedRoom2} (S)`
              : s.assignedRoom1
            : s.assignedRoom2;

          let building = s.assignedRoom.slice(0, 2);
          s.meetingLocation = Object.keys(buildings).includes(building)
            ? buildings[building]
            : DEFAULT_LOCATION;

          s.meetingStartTime = parseSecondsFromTime(s.meetingStartTime);
          s.meetingEndTime = parseSecondsFromTime(s.meetingEndTime);

          return s;
        }).filter(s => s);

        return m;
      }).filter(m => m);

      if (c.meetings && c.meetings.length > 0)
        return c;
    }).filter(c => c);

    cb();
    dispatch(sortClasses({ classes, userPosition, sortIndex }));
  }
}

export function sortClasses({ classes, userPosition, sortIndex }) {
  return function(dispatch) {
    let sorted;

    switch(SORT_METHODS[sortIndex]) {
      case 'CODE':
        sorted = classes.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0));
        break;
      case 'LOCATION':
        let userCoords = userPosition
          ? { lat: userPosition.coords.latitude, lng: userPosition.coords.longitude }
          : DEFAULT_LOCATION;

        let distances = new Map();

        sorted = classes.sort((a, b) => {
          let distFromA, distFromB;

          try {
            let { lat: latA, lng: lngA } = a.meetings[0].schedule[0].meetingLocation;
            let { lat: latB, lng: lngB } = b.meetings[0].schedule[0].meetingLocation;

            let posA = `${latA},${lngA}`;
            let posB = `${latB},${lngB}`;

            distFromA = distances.has(posA)
              ? distances.get(posA)
              : calculateDistance(userCoords, { lat: latA, lng: lngA });

            distFromB = distances.has(posB)
              ? distances.get(posB)
              : calculateDistance(userCoords, { lat: latB, lng: lngB });

            distances.set(posA, distFromA);
            distances.set(posB, distFromB);
          } catch(e) {
            return 1;
          }

          return distFromA - distFromB;
        });

        break;
      case 'TIME':
        sorted = classes.sort((a, b) => {
          try { return a.meetings[0].schedule[0].meetingStartTime - b.meetings[0].schedule[0].meetingStartTime; } catch(e) { return 1; }
        });
        break;
      case 'NAME':
        sorted = classes.sort((a, b) => (a.courseTitle > b.courseTitle) ? 1 : ((b.courseTitle > a.courseTitle) ? -1 : 0));
        break;
      default:
        sorted = classes;
    }

    let parsed = {};

    for (let c of sorted)
      parsed[`${c.courseId}_${(new Date()).toISOString()}`] = c;

    dispatch(setCourses(sorted));
  }
}
