// ---------------------------------------------------------------------------
// Dubai area geo-helper.
//
// The school / city documents in the backend do NOT store latitude &
// longitude, so a true "sort every school by GPS distance" isn't possible
// without a schema change. Instead we keep an approximate coordinate for each
// well-known Dubai area here. When a parent taps "Near Me" we read their GPS
// position once (browser geolocation), find the CLOSEST Dubai area from this
// map, and then filter/sort schools by that area — which is exactly what a
// parent means by "schools near me" in a city like Dubai.
//
// Matching is done on the area NAME (case-insensitive), so it lines up with
// the `city.city` value that every school already carries. Add more areas
// here any time — nothing else needs to change.
// ---------------------------------------------------------------------------

export type DubaiArea = {
  name: string;
  lat: number;
  lng: number;
  aliases?: string[];
};

// Approximate centre coordinates for common Dubai communities.
export const DUBAI_AREAS: DubaiArea[] = [
  { name: "Al Barsha", lat: 25.1109, lng: 55.1961 },
  { name: "Dubai Marina", lat: 25.0805, lng: 55.1403 },
  { name: "Jumeirah", lat: 25.2048, lng: 55.2447 },
  { name: "Downtown Dubai", lat: 25.1972, lng: 55.2744, aliases: ["Downtown"] },
  { name: "Emirates Hills", lat: 25.0725, lng: 55.1707 },
  { name: "Al Sufouh", lat: 25.1189, lng: 55.1747 },
  { name: "Palm Jumeirah", lat: 25.1124, lng: 55.139, aliases: ["The Palm"] },
  { name: "Nad Al Sheba", lat: 25.1657, lng: 55.3122 },
  { name: "Jumeirah Village Circle", lat: 25.0619, lng: 55.2086, aliases: ["JVC"] },
  { name: "Business Bay", lat: 25.1857, lng: 55.2645 },
  { name: "Al Quoz", lat: 25.1425, lng: 55.2331 },
  { name: "Mirdif", lat: 25.2179, lng: 55.4181 },
  { name: "Deira", lat: 25.2712, lng: 55.3092 },
  { name: "Bur Dubai", lat: 25.2582, lng: 55.2962 },
  { name: "Al Warqa", lat: 25.1783, lng: 55.4009 },
  { name: "Dubai Silicon Oasis", lat: 25.1213, lng: 55.3773, aliases: ["DSO"] },
  { name: "Dubailand", lat: 25.0426, lng: 55.2426 },
  { name: "Arabian Ranches", lat: 25.0512, lng: 55.2686 },
  { name: "The Springs", lat: 25.0669, lng: 55.1861 },
  { name: "Umm Suqeim", lat: 25.1428, lng: 55.1913 },
  { name: "Al Nahda", lat: 25.2949, lng: 55.3714 },
  { name: "International City", lat: 25.1667, lng: 55.4092 },
  // Wider UAE seeds — so "Near Me" keeps working when you expand beyond Dubai.
  { name: "Abu Dhabi", lat: 24.4539, lng: 54.3773 },
  { name: "Sharjah", lat: 25.3463, lng: 55.4209 },
  { name: "Ajman", lat: 25.4052, lng: 55.5136 },
];

const toRad = (deg: number) => (deg * Math.PI) / 180;

// Great-circle distance between two points, in kilometres (Haversine).
export function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const R = 6371; // earth radius km
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

const norm = (s: string) => s.trim().toLowerCase();

// Find the coordinate record for an area name (matches aliases too).
export function areaByName(name?: string): DubaiArea | undefined {
  if (!name) return undefined;
  const n = norm(name);
  return DUBAI_AREAS.find(
    (a) => norm(a.name) === n || a.aliases?.some((al) => norm(al) === n)
  );
}

// Return the areas closest to a GPS point, nearest first, each with distanceKm.
export function nearestAreas(
  lat: number,
  lng: number,
  limit = 5
): Array<DubaiArea & { distanceKm: number }> {
  return DUBAI_AREAS.map((a) => ({
    ...a,
    distanceKm: haversineKm(lat, lng, a.lat, a.lng),
  }))
    .sort((x, y) => x.distanceKm - y.distanceKm)
    .slice(0, limit);
}

// Distance (km) from a GPS point to a named area, if we know that area.
export function distanceToArea(
  lat: number,
  lng: number,
  areaName?: string
): number | undefined {
  const a = areaByName(areaName);
  if (!a) return undefined;
  return haversineKm(lat, lng, a.lat, a.lng);
}

export type GeoResult = { lat: number; lng: number };

// Promise wrapper around the browser geolocation API with a sane timeout.
export function getUserLocation(): Promise<GeoResult> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

export const prettyKm = (km: number) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
