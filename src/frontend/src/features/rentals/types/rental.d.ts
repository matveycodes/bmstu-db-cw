interface Rental {
  id: string;
  user_id: string;
  scooter_id: string;
  start_price: number;
  per_minute_price: number;
  date_started: string;
  date_finished: string | null;
  duration: number;
  total_price: number;
  scooter_number: string;
}

export { Rental };
