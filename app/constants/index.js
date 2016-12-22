export const VERSION = '0.1';

export const ALL_DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
export const ALL_DAYS_ABBR = ALL_DAYS.map(d => d.slice(0, 2));

export const SORT_METHODS = ['CODE', 'LOCATION', 'TIME', 'NAME'];

export const BASE_API_URL = 'https://timetable.iit.artsci.utoronto.ca/api';
export const DEFAULT_REQUEST_PARAMS = {
  org: '',
  code: '',
  section: '',
  studyyear: '',
  daytime: '',
  weekday: '',
  prof: '',
  breadth: '',
  online: '',
  waitlist: '',
  available: '',
  title: '',
};

export const DEFAULT_LOCATION = { lat: 43.6629, lng: -79.3957 };
