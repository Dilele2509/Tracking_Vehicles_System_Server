   UPDATE vehicles SET 
       device_id = ?, 
       user_id = ?, 
       vehicle_brand = ?, 
       vehicle_line = ?, 
       license_plate = ?
   WHERE id = ?;