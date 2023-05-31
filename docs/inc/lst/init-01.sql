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