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
    duration integer NOT NULL CHECK (duration > 0),
    price integer NOT NULL CHECK (price >= 0)
);

CREATE TABLE IF NOT EXISTS purchased_subscriptions (
    subscription_id uuid NOT NULL REFERENCES subscriptions(id),
    user_id uuid NOT NULL REFERENCES users(id),
    date_started timestamp with time zone NOT NULL DEFAULT now(),
    date_finished timestamp with time zone NOT NULL CHECK (date_finished > date_started),
    date_purchased timestamp with time zone NOT NULL DEFAULT now()
);