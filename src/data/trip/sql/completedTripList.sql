SELECT * FROM trips WHERE status IN ('Completed', 'Cancelled') AND driver_id = ?;