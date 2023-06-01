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