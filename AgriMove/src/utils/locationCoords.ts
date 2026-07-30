// ── locationCoords.ts ─────────────────────────────────────────────────────────
// Maps AgriMove sample location strings to [longitude, latitude] coordinates.
// Used by DeliveryMap to display real pins without a live geocoding API.
// Falls back to central Rwanda for any unrecognised string.

export type LngLat = [number, number];

const LOCATION_MAP: Record<string, LngLat> = {
  // ── Rwanda ──────────────────────────────────────────────────────────────────
  "Kigali Market":         [30.0619, -1.9441],
  "Kigali":                [30.0619, -1.9441],
  "Nyagatare Farm":        [30.3285, -1.2986],
  "Nyagatare":             [30.3285, -1.2986],
  "Huye Depot":            [29.7394, -2.5995],
  "Huye":                  [29.7394, -2.5995],
  "Musanze Hub":           [29.6047, -1.4988],
  "Musanze":               [29.6047, -1.4988],
  "Rubavu":                [29.3480, -1.6810],
  "Rwamagana":             [30.4346, -1.9495],
  "Kayonza":               [30.6483, -1.8881],
  "Bugesera Farm":         [30.2318, -2.1976],
  "Bugesera":              [30.2318, -2.1976],
  "Muhanga":               [29.7500, -2.0839],
  "Kamonyi":               [29.8768, -2.0285],
  "Ruhango":               [29.7793, -2.2168],
  "Kirehe":                [30.6615, -2.0993],
  "Ngoma":                 [30.4842, -2.1634],
  "Rulindo":               [30.0285, -1.7198],
  "Gakenke":               [29.7794, -1.6860],
  "Gicumbi":               [30.0500, -1.5802],
  "Burera":                [29.8441, -1.3650],
  "Nyabihu":               [29.5041, -1.6534],
  "Karongi":               [29.3500, -2.0673],
  "Rutsiro":               [29.4132, -1.9259],
  "Nyamasheke":            [29.1355, -2.3322],
  "Rusizi":                [28.9075, -2.4815],
  "Gisagara":              [29.8000, -2.5830],
  "Nyanza":                [29.7500, -2.3542],
  "Ruhango Depot":         [29.7793, -2.2168],
  "Eastern Province":      [30.4500, -1.9500],
  "Western Province":      [29.3500, -2.1000],
  "Northern Province":     [29.8000, -1.5000],
  "Southern Province":     [29.7500, -2.3000],

  // ── Uganda ──────────────────────────────────────────────────────────────────
  "Kampala Market":        [32.5825, 0.3476],
  "Kampala":               [32.5825, 0.3476],
  "Jinja Hub":             [33.2041, 0.4244],
  "Jinja":                 [33.2041, 0.4244],
  "Mbarara":               [30.6587, -0.6096],
  "Gulu":                  [32.2987, 2.7745],
  "Entebbe":               [32.4637, 0.0512],
  "Wakiso Farm":           [32.3750, 0.4000],
  "Wakiso":                [32.3750, 0.4000],
  "Mukono":                [32.7533, 0.3528],
  "Lira":                  [32.9000, 2.2499],

  // ── Kenya ────────────────────────────────────────────────────────────────────
  "Nairobi Hub":           [36.8219, -1.2921],
  "Nairobi":               [36.8219, -1.2921],
  "Mombasa Market":        [39.6682, -4.0435],
  "Mombasa":               [39.6682, -4.0435],
  "Kisumu":                [34.7617, -0.0917],
  "Nakuru":                [36.0800, -0.3031],
  "Eldoret":               [35.2698, 0.5143],
  "Thika":                 [37.0833, -1.0167],
  "Machakos":              [37.2636, -1.5167],
  "Nyeri Farm":            [36.9559, -0.4167],
  "Nyeri":                 [36.9559, -0.4167],
  "Meru":                  [37.6500, 0.0500],
  "Kitale":                [35.0000, 1.0167],
};

/** Default centre point (central Rwanda / Kigali area) */
const DEFAULT: LngLat = [30.0619, -1.9441];

/**
 * Returns [longitude, latitude] for a given location string.
 * Supports:
 * - Direct coordinate strings, e.g. "Musanze (-1.4988, 29.6047)", "-1.4988, 29.6047", "Location (-1.4988, 29.6047)"
 * - Named locations in LOCATION_MAP (exact, case-insensitive, and partial matches)
 * - Falls back to central Rwanda if unknown.
 */
export function getCoords(location: string): LngLat {
  if (!location) return DEFAULT;
  const trimmed = location.trim();

  // 1. Try parsing explicit numeric coordinates in format (lat, lng) or "lat, lng"
  const coordMatch = trimmed.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (coordMatch) {
    const n1 = parseFloat(coordMatch[1]);
    const n2 = parseFloat(coordMatch[2]);
    if (!isNaN(n1) && !isNaN(n2)) {
      // Determine which number is latitude (-90 to 90) and which is longitude (-180 to 180)
      // Standard ordering in display strings is (lat, lng), e.g. (-1.498, 29.604)
      if (Math.abs(n1) <= 90 && Math.abs(n2) <= 180) {
        // If n1 is in latitude range for East Africa (negative or small positive) and n2 is East Africa longitude (~28 to 42)
        if ((n1 <= 15 && n2 >= 15) || (Math.abs(n1) <= 90 && Math.abs(n2) <= 180)) {
          return [n2, n1]; // [lng, lat]
        }
      }
      if (Math.abs(n2) <= 90 && Math.abs(n1) <= 180) {
        return [n1, n2]; // [lng, lat]
      }
    }
  }

  // 2. Exact match in LOCATION_MAP
  if (LOCATION_MAP[trimmed]) return LOCATION_MAP[trimmed];

  // 3. Case-insensitive lookup
  const lower = trimmed.toLowerCase();
  const key = Object.keys(LOCATION_MAP).find((k) => k.toLowerCase() === lower);
  if (key) return LOCATION_MAP[key];

  // 4. Partial match — e.g. "Kigali Central Market" → "Kigali"
  const partial = Object.keys(LOCATION_MAP).find((k) =>
    lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)
  );
  if (partial) return LOCATION_MAP[partial];

  return DEFAULT;
}

/**
 * Midpoint between two LngLat points (used to centre the map).
 */
export function midpoint(a: LngLat, b: LngLat): LngLat {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

/**
 * Linearly interpolate between two points.
 * t = 0 → a, t = 1 → b.
 */
export function lerp(a: LngLat, b: LngLat, t: number): LngLat {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/**
 * Finds the nearest named location to a given [lng, lat] point
 * and formats it with precise coordinates so getCoords can parse it immediately.
 */
export function findNearestLocation(lng: number, lat: number): string {
  let closestName = "Exact Spot";
  let minDistance = Infinity;

  for (const [name, coords] of Object.entries(LOCATION_MAP)) {
    const dx = coords[0] - lng;
    const dy = coords[1] - lat;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDistance) {
      minDistance = dist;
      closestName = name;
    }
  }

  // If very close to a known hub/town landmark (< ~5km), mention landmark + exact 5-decimal coords
  if (minDistance < 0.05) {
    return `${closestName} Area (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
  }

  return `Exact Spot (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
}

/**
 * Calculates geodesic driving distance in kilometers between two location strings.
 * Uses Haversine distance formula with a 1.35x road curvature multiplier.
 */
export function calculateDistanceKm(pickup: string, destination: string): number {
  if (!pickup || !destination) return 0;

  const [lng1, lat1] = getCoords(pickup);
  const [lng2, lat2] = getCoords(destination);

  if (Math.abs(lng1 - lng2) < 0.0001 && Math.abs(lat1 - lat2) < 0.0001) {
    return 5;
  }

  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;

  const roadKm = straightKm * 1.35;
  return Math.max(5, Math.round(roadKm * 10) / 10);
}

export interface CostBreakdown {
  distanceKm: number;
  baseFee: number;
  distanceFee: number;
  weightFee: number;
  totalCost: number;
}

/**
 * Calculates dynamic distance-based delivery cost breakdown in RWF.
 * Formula: Base (RWF 2,000) + Distance (RWF 100/km) + Weight (RWF 10/kg)
 */
export function calculateDeliveryCost(
  pickup: string,
  destination: string,
  weightKg: number
): CostBreakdown {
  const distanceKm = calculateDistanceKm(pickup, destination);
  const validWeight = isNaN(weightKg) || weightKg < 0 ? 0 : weightKg;

  const BASE_FEE = 2000;
  const PER_KM_RATE = 100;
  const PER_KG_RATE = 10;

  const distanceFee = Math.round(distanceKm * PER_KM_RATE);
  const weightFee = Math.round(validWeight * PER_KG_RATE);
  const rawTotal = BASE_FEE + distanceFee + weightFee;

  const totalCost = Math.round(rawTotal / 100) * 100;

  return {
    distanceKm,
    baseFee: BASE_FEE,
    distanceFee,
    weightFee,
    totalCost,
  };
}



