interface Scooter {
  id: string;
  status: string;
  number: string;
  model_id: string;
  battery_level: number;
  location: {
    longitude: number;
    latitude: number;
  };
  estimates: {
    time: number;
    distance: number;
  };
}

export { Scooter };
