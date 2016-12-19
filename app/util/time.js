export function parseSecondsFromTime(time) {
  let [hours, minutes] = time.split(':').map(s => parseInt(s));
  return hours * 60 * 60 + minutes * 60;
}
