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