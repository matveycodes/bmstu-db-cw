CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_status AS ENUM ('pending', 'active', 'blocked');

CREATE TYPE user_role AS ENUM ('customer', 'technician', 'admin');

CREATE DOMAIN phone_number AS TEXT CHECK (VALUE ~ '^7[0-9]{10}$');

CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    status user_status NOT NULL DEFAULT 'pending',
    date_joined timestamp with time zone NOT NULL DEFAULT now() CHECK (date_joined > birthdate),
    middle_name varchar(256),
    first_name varchar(256),
    last_name varchar(256),
    email citext,
    phone phone_number UNIQUE NOT NULL,
    birthdate date CHECK (birthdate > '1930-01-01'),
    role user_role NOT NULL DEFAULT 'customer'
);

CREATE TABLE IF NOT EXISTS scooter_manufacturers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title varchar(256) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS totp (
    code integer NOT NULL,
    date_sent timestamp with time zone NOT NULL DEFAULT now(),
    phone text NOT NULL,
    signature text UNIQUE NOT NULL,
    date_used timestamp with time zone CHECK (date_used > date_sent)
);

CREATE TABLE IF NOT EXISTS auth_tokens (
    user_id uuid NOT NULL REFERENCES users(id),
    value text UNIQUE NOT NULL,
    date_expired timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
    name varchar(64) UNIQUE NOT NULL,
    value text NOT NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title varchar(64) NOT NULL,
    duration integer NOT NULL CHECK (duration >= 0),
    price integer NOT NULL CHECK (price >= 0)
);

CREATE TABLE IF NOT EXISTS purchased_subscriptions (
    subscription_id uuid NOT NULL REFERENCES subscriptions(id),
    user_id uuid NOT NULL REFERENCES users(id),
    date_started timestamp with time zone NOT NULL DEFAULT now(),
    date_finished timestamp with time zone NOT NULL CHECK (date_finished > date_started),
    date_purchased timestamp with time zone NOT NULL DEFAULT now()
);