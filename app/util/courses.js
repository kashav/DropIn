const ALL_DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const TIMES = [{
  'currentDay': 'MONDAY',
  'currentTime': 46900
}, {
  'currentDay': 'TUESDAY',
  'currentTime': 35340
}, {
  'currentDay': 'WEDNESDAY',
  'currentTime': 60000
}];

export function findCurrentCourses(allCourses, sort) {
  let now = new Date();

  // let currentDay = ALL_DAYS[now.getDay()];
  // let currentTime = now.getHours() * 60 * 60 + now.getMinutes() * 60;

  let { currentDay, currentTime } = TIMES[Math.floor(Math.random()*TIMES.length)];

  let courses = allCourses.map(c => {
    c.meeting_sections = c.meeting_sections.map(s => {
      s.times = s.times.filter(t => t.day === currentDay && currentTime <= t.end && t.start <= currentTime + 1800);

      if (/^(L)\d{4}$/i.test(s.code) && s.times.length > 0)
        return s;
    }).filter(s => s);

    if (c.meeting_sections.length > 0)
      return c;
  }).filter(c => c);

  let coursesObj = {};

  for (course of courses) {
    // Use courseid + currentDay + currentTime as key for uniqueness, since
    // if they refresh after short periods of time, the current courses
    // will likely not have changed.
    coursesObj[`${course.id}_${currentDay}_${currentTime}`] = course
  }

  return coursesObj;
}

export function formTimeString(secondsSinceMidnight) {
  let hour = secondsSinceMidnight / 60 / 60;
  let minute = Math.floor((hour - Math.floor(hour)) * 60);

  hour = Math.floor(hour);
  period = hour >= 12 ? 'PM' : 'AM';

  if (hour >= 13)
    hour -= 12;

  return `${hour}:${minute < 10 ? '0' : ''}${minute} ${period}`;
}

export function sortCourses(coursesToSort, sortMethod) {
  return coursesToSort;
}
