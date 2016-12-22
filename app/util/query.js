import { ALL_DAYS_ABBR } from '../constants';

export function generateQuery(options = {}) {
  function getDaytime(time) {
    if (7 <= time && time <= 12)
      return 'AM';

    if (12 < time && time <= 16)
      return 'PM';

    if (16 < time && time <= 23)
      return 'EVE';
  }

  let weekday = ALL_DAYS_ABBR[options.day] || ALL_DAYS_ABBR[(new Date()).getDay()];
  let daytime = getDaytime(options.time ? options.time : (new Date()).getHours());

  // We delete these to avoid sending invalid query params
  delete options.time;
  delete options.day;

  return {
    section: 'Y,S',
    daytime,
    weekday,
    ...options
  };
}
