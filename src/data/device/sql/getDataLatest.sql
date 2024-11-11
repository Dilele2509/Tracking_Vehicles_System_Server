SELECT * 
FROM devices 
WHERE device_id = ? 
ORDER BY date DESC, time DESC 
LIMIT 1;
