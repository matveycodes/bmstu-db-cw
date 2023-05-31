SELECT DISTINCT(number) FROM scooters WHERE id IN (
    SELECT scooter_id FROM pings 
    WHERE battery_level = 0 
    AND lock_state = 'unlocked' 
    AND date BETWEEN '2023-05-29 00:00:00' 
             AND     '2023-05-29 23:59:59'
)