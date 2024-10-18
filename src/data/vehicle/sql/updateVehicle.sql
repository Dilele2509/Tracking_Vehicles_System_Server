   UPDATE vehicles SET 
       device_id = ?, 
       owner_id = ?, 
       driver_id = ?, 
       vehicle_brand = ?, 
       vehicle_line = ?, 
       thumbnail = ?, 
       license_plate = ?, 
       location = ST_GeomFromText(?), -- Use ST_GeomFromText to convert WKT to geometry
       status = ?, 
       parked_time = ?, 
       km_per_day = ?, 
       deleted = ? 
   WHERE id = ?;