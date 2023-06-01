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
