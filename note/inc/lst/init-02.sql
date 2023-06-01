CREATE TABLE IF NOT EXISTS scooter_models (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    manufacturer_id uuid NOT NULL REFERENCES scooter_manufacturers(id),
    title varchar(256) NOT NULL,
    single_charge_mileage integer NOT NULL CHECK (single_charge_mileage > 0),
    weight integer NOT NULL CHECK (weight > 0),
    max_speed integer NOT NULL CHECK (max_speed > 0),
    max_load integer NOT NULL CHECK (max_load > 0),
    year smallint NOT NULL CHECK (year > 2000)
);

CREATE TYPE scooter_status AS ENUM ('enabled', 'disabled');

CREATE TABLE IF NOT EXISTS scooters (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id uuid NOT NULL REFERENCES scooter_models(id),
    status scooter_status NOT NULL DEFAULT 'disabled',
    number varchar(8) UNIQUE NOT NULL
);

CREATE TYPE scooter_lock_state AS ENUM ('locked', 'unlocked');
CREATE TYPE scooter_lights_state AS ENUM ('on', 'off');

CREATE TABLE IF NOT EXISTS pings (
    scooter_id uuid NOT NULL REFERENCES scooters(id),
    date timestamp with time zone NOT NULL DEFAULT now(),
    meta_info json,
    location geography NOT NULL,
    battery_level smallint NOT NULL CHECK (battery_level >= 0 AND battery_level <= 100),
    lock_state scooter_lock_state NOT NULL,
    lights_state scooter_lights_state NOT NULL
);