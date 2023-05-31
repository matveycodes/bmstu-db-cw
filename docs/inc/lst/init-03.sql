CREATE TABLE IF NOT EXISTS rentals (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id),
    scooter_id uuid NOT NULL REFERENCES scooters(id),
    start_price integer NOT NULL CHECK (start_price >= 0),
    per_minute_price integer NOT NULL CHECK (per_minute_price >= 0),
    date_started timestamp with time zone NOT NULL DEFAULT now(),
    date_finished timestamp with time zone CHECK (date_finished > date_started)
);

CREATE TABLE IF NOT EXISTS bookings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id),
    scooter_id uuid NOT NULL REFERENCES scooters(id),
    date_started timestamp with time zone NOT NULL DEFAULT now(),
    date_finished timestamp with time zone NOT NULL CHECK (date_finished > date_started)
);

CREATE TABLE IF NOT EXISTS parkings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    location geography NOT NULL
);

CREATE TABLE IF NOT EXISTS restricted_zones (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    polygon geometry NOT NULL,
    speed_limit smallint NOT NULL CHECK (speed_limit >= 0)
);