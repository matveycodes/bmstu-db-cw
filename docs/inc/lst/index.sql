CREATE INDEX idx_discharged_pings ON pings(scooter_id) 
WHERE battery_level = 0 
AND lock_state = 'unlocked' 
AND date BETWEEN '2023-05-29 00:00:00' 
         AND     '2023-05-29 23:59:59'