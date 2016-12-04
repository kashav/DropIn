const ALL_DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export function findCurrentCourses(allCourses, sort) {
  let now = new Date();

  let currentDay = ALL_DAYS[now.getDay()];
  let currentTime = now.getHours() * 60 * 60 + now.getMinutes() * 60;

  currentDay = 'MONDAY';
  currentTime = 46900;

  return (allCourses.map(c => {
    c.meeting_sections = (c.meeting_sections.map(s => {
      s.times = s.times.filter(t => t.day === currentDay && t.start <= currentTime && currentTime <= t.end);

      if (/^(L)\d{4}$/i.test(s.code) && s.times.length > 0)
        return s;
    }).filter(s => s));

    if (c.meeting_sections.length > 0)
      return c;
  }).filter(c => c));
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
