export function formTimeString(secondsSinceMidnight) {
  let hour = secondsSinceMidnight / 60 / 60;
  let minute = Math.floor((hour - Math.floor(hour)) * 60);

  hour = Math.floor(hour);
  period = hour >= 12 ? 'PM' : 'AM';

  if (hour >= 13)
    hour -= 12;

  return `${hour}:${minute < 10 ? '0' : ''}${minute} ${period}`;
}
