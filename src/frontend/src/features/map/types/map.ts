interface Location {
  latitude: number;
  longitude: number;
}

interface Bounds {
  min_longitude: number;
  min_latitude: number;
  max_longitude: number;
  max_latitude: number;
}

const enum Layer {
  Parkings = "parkings",
  RestrictedZones = "restricted-zones",
  Scooters = "scooters",
}

export type { Location, Bounds };
export { Layer };
