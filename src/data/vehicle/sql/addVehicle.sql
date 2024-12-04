INSERT INTO vehicles 
(id, device_id, user_id, vehicle_brand, vehicle_line, thumbnail, license_plate, status, parked_time, km_per_day, deleted) 
VALUES (?, ?, ?, ?, ?, null, ?, 0, '00:00:00', 0, 0);
