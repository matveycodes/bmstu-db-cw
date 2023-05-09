INSERT INTO parkings (location) 
VALUES ('SRID=4326;POINT(37.7403506 55.7581299)');
<...>
INSERT INTO parkings (location) 
VALUES ('SRID=4326;POINT(37.8139298 55.7985188)');

INSERT INTO settings (name, value) 
VALUES ('MAX_BOOKINGS', '3');
INSERT INTO settings (name, value) 
VALUES ('MAX_RENTALS', '10');
INSERT INTO settings (name, value) 
VALUES ('MIN_AGE', '18');
INSERT INTO settings (name, value) 
VALUES ('BOOKING_DURATION', '600');
INSERT INTO settings (name, value) 
VALUES ('START_PRICE', '5000');
INSERT INTO settings (name, value) 
VALUES ('PER_MINUTE_PRICE', '700');

INSERT INTO restricted_zones (polygon, speed_limit)
VALUES (ST_GeomFromText('POLYGON((37.60041834560791 55.73370543256917, 37.60671615600586 55.731701571091925, 37.61346461025635 55.738416943859285, 37.61067511288086 55.73931085873171, 37.60041834560791 55.73370543256917))', 4326), 10);
<...>
INSERT INTO restricted_zones (polygon, speed_limit)
VALUES (ST_GeomFromText('POLYGON((37.638671347998724 55.76452150037904, 37.63918633212958 55.764889694271154, 37.641873905562505 55.76356780167232, 37.64430130472098 55.76227906414713, 37.64590124239837 55.76078956853612, 37.645859668158636 55.76009686578501, 37.64479751338874 55.75997915036887, 37.64323646774207 55.761809735803126, 37.64121139993583 55.76322600365705, 37.638671347998724 55.76452150037904))', 4326), 15);

INSERT INTO scooter_manufacturers (title) VALUES ('Ninebot');

INSERT INTO scooter_models (manufacturer_id, title, single_charge_mileage, weight, max_speed, max_load, year)
SELECT id, 'KickScooter Max G30', 65, 20, 25, 100, 2022 FROM scooter_manufacturers WHERE title = 'Ninebot';
INSERT INTO scooter_models (manufacturer_id, title, single_charge_mileage, weight, max_speed, max_load, year)
SELECT id, 'KickScooter F25', 20, 15, 25, 100, 2021 FROM scooter_manufacturers WHERE title = 'Ninebot';

INSERT INTO scooters (model_id, status, number)
SELECT id, 'enabled', 'TT6552' FROM scooter_models WHERE title = 'KickScooter Max G30';
<...>
INSERT INTO scooters (model_id, status, number)
SELECT id, 'disabled', 'CC1965' FROM scooter_models WHERE title = 'KickScooter F25';

INSERT INTO pings (scooter_id, date, location, battery_level, lock_state, lights_state)
SELECT s.id, '2023-04-30T11:54:26.288Z', p.location, 15, 'unlocked', 'on'
FROM (SELECT id, number, ROW_NUMBER() OVER (ORDER BY random()) rn FROM scooters) s
JOIN (SELECT location, ROW_NUMBER() OVER (ORDER BY random()) rn FROM parkings) p USING (rn)
WHERE s.number = 'TT6552';
<...>
INSERT INTO pings (scooter_id, date, location, battery_level, lock_state, lights_state)
SELECT s.id, '2023-04-30T11:55:56.321Z', p.location, 97, 'locked', 'on'
FROM (SELECT id, number, ROW_NUMBER() OVER (ORDER BY random()) rn FROM scooters) s
JOIN (SELECT location, ROW_NUMBER() OVER (ORDER BY random()) rn FROM parkings) p USING (rn)
WHERE s.number = 'CC1965';

INSERT INTO subscriptions (title, price, duration)
VALUES ('Подписка на месяц', 24900, 2678400);
INSERT INTO subscriptions (title, price, duration)
VALUES ('Подписка на 3 месяца', 74700, 8035200);
INSERT INTO subscriptions (title, price, duration)
VALUES ('Подписка на 6 месяцев', 149400, 16070400);
