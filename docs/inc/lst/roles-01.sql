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