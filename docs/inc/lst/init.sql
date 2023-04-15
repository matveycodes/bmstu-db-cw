CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_status AS ENUM ('pending', 'active', 'blocked');

CREATE DOMAIN phone_number AS TEXT CHECK (VALUE ~ '^[+]7[0-9]{10}$');

CREATE TABLE IF NOT EXISTS users (
    id uuid primary key default uuid_generate_v4(),
    status user_status not null default 'pending',
    date_joined timestamp not null default now() check (date_joined > birthdate),
    middle_name varchar(256),
    first_name varchar(256),
    last_name varchar(256),
    email citext,
    phone phone_number unique not null,
    birthdate date check (birthdate > '1930-01-01')
);

CREATE TABLE IF NOT EXISTS supports (
    id uuid primary key default uuid_generate_v4(),
    middle_name varchar(256) not null,
    first_name varchar(256) not null,
    last_name varchar(256) not null,
    email citext not null,
    phone phone_number unique not null
);

CREATE TABLE IF NOT EXISTS technicians (
    id uuid primary key default uuid_generate_v4(),
    middle_name varchar(256) not null,
    first_name varchar(256) not null,
    last_name varchar(256) not null,
    email citext not null,
    phone phone_number unique not null
);

CREATE TABLE IF NOT EXISTS admins (
    id uuid primary key default uuid_generate_v4(),
    middle_name varchar(256) not null,
    first_name varchar(256) not null,
    last_name varchar(256) not null,
    email citext not null,
    phone phone_number unique not null
);

CREATE TABLE IF NOT EXISTS scooter_manufacturers (
    id uuid primary key default uuid_generate_v4(),
    title varchar(256) not null
);

CREATE TABLE IF NOT EXISTS scooter_models (
    id uuid primary key default uuid_generate_v4(),
    manufacturer_id uuid not null references scooter_manufacturers(id),
    title varchar(256) not null,
    single_charge_mileage integer not null check (single_charge_mileage > 0),
    weight integer not null check (weight > 0),
    max_speed integer not null check (max_speed > 0),
    max_load integer not null check (max_load > 0),
    year smallint not null check (year > 2000)
);

CREATE TYPE scooter_status AS ENUM ('enabled', 'disabled');

CREATE TABLE IF NOT EXISTS scooters (
    id uuid primary key default uuid_generate_v4(),
    model_id uuid not null references scooter_models(id),
    status scooter_status not null default 'disabled',
    image_link text,
    number varchar(8) not null
);

CREATE TYPE scooter_lock_state AS ENUM ('locked', 'unlocked');
CREATE TYPE scooter_lights_state AS ENUM ('on', 'off');

CREATE TABLE IF NOT EXISTS pings (
    scooter_id uuid not null references scooters(id),
    date timestamp not null default now(),
    meta_info json,
    location geography not null,
    battery_level smallint not null check (battery_level >= 0 AND battery_level <= 100),
    lock_state scooter_lock_state not null,
    lights_state scooter_lights_state not null
);

CREATE TABLE IF NOT EXISTS rentals (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references users(id),
    scooter_id uuid not null references scooters(id),
    start_price integer not null check (start_price >= 0),
    per_minute_price integer not null check (per_minute_price >= 0),
    date_started timestamp not null default now(),
    date_finished timestamp check (date_finished > date_started)
);

CREATE TABLE IF NOT EXISTS bookings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references users(id),
    scooter_id uuid not null references scooters(id),
    date_started timestamp not null default now(),
    date_finished timestamp check (date_finished > date_started)
);

CREATE TABLE IF NOT EXISTS parkings (
    id uuid primary key default uuid_generate_v4(),
    location geography not null
);

CREATE TABLE IF NOT EXISTS restricted_zones (
    id uuid primary key default uuid_generate_v4(),
    polygon geometry not null,
    speed_limit smallint not null check (speed_limit >= 0)
);

CREATE TABLE IF NOT EXISTS totp (
    code integer not null,
    date_sent timestamp not null default now(),
    phone text not null,
    signature text unique not null,
    date_used timestamp check (date_used > date_sent)
);

CREATE TABLE IF NOT EXISTS auth_tokens (
    user_id uuid not null references users(id),
    value text unique not null,
    date_expired timestamp not null
);

CREATE TABLE IF NOT EXISTS settings (
    name varchar(64) unique not null,
    value text not null
);
