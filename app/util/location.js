const R = 6731; // km

export function calculateDistance(start, end) {
  let lat1 = toRad(start.lat);
  let lat2 = toRad(end.lng);
  let dLat = toRad(end.lat - start.lat);
  let dLon = toRad(end.lng - start.lng);

  let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

function toRad(n) {
  return n * Math.PI / 180;
}
