REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

CREATE ROLE guest;
CREATE ROLE pending_customer;
CREATE ROLE customer;
CREATE ROLE technician;
CREATE ROLE scooter;
CREATE ROLE admin;

ALTER TABLE pings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE scooters ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

-- Доступ только к своей записи в таблице пользователей
CREATE POLICY select_current_user
ON users TO pending_customer, customer, technician
USING (CONCAT('u_', REPLACE(id::text, '-', '')) = current_user);

-- Доступ только к своим бронированиям
CREATE POLICY select_current_user_bookings
ON bookings TO customer
USING (CONCAT('u_', REPLACE(user_id::text, '-', '')) = current_user);

-- Доступ только к своим арендам
CREATE POLICY select_current_user_rentals
ON rentals TO customer
USING (CONCAT('u_', REPLACE(user_id::text, '-', '')) = current_user);

-- Доступ только к своим купленным подпискам
CREATE POLICY select_current_user_purchased_subscriptions
ON purchased_subscriptions TO customer
USING (CONCAT('u_', REPLACE(user_id::text, '-', '')) = current_user);

-- Доступ к пингам только от разряженных самокатов
CREATE POLICY select_discharged_pings
ON pings FOR SELECT TO technician
USING (
    EXISTS (
        SELECT 1 FROM (
            SELECT DISTINCT ON (scooter_id) * FROM pings
            ORDER BY scooter_id, date DESC
        ) T
        WHERE battery_level = 0
    )
);

-- Доступ к пингам только от заряженных самокатов
CREATE POLICY select_charged_pings
ON pings TO customer
USING (
    EXISTS (
        SELECT 1 FROM (
            SELECT DISTINCT ON (scooter_id) * FROM pings
            ORDER BY scooter_id, date DESC
        ) T
        WHERE battery_level > 0
    )
);

-- Доступ только к активным самокатам
CREATE POLICY select_enabled_scooters
ON scooters TO customer
USING (status = 'enabled');

GRANT SELECT ON bookings TO customer;
GRANT INSERT ON bookings TO customer;

GRANT SELECT ON parkings TO guest, pending_customer, customer, technician;

GRANT SELECT ON pings TO customer, technician;
GRANT INSERT ON pings TO scooter;

GRANT SELECT ON purchased_subscriptions TO customer;
GRANT INSERT ON purchased_subscriptions TO customer;

GRANT SELECT ON rentals TO customer;
GRANT UPDATE (date_finished) ON rentals TO customer;

GRANT SELECT ON restricted_zones TO guest, pending_customer, customer, technician;

GRANT SELECT ON scooter_manufacturers TO customer, technician;

GRANT SELECT ON scooter_models TO customer, technician;

GRANT SELECT ON scooters TO customer, technician;

GRANT SELECT ON subscriptions TO customer;

GRANT SELECT ON users TO pending_customer, customer, technician;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin;