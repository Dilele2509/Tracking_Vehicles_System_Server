SELECT 
    trips.id,
    trips.date,
    trips.from,
    trips.to,
    trips.fromLocation,
    trips.toLocation,
    trips.timeOrdered,
    trips.timeCompleted,
    trips.distance,
    trips.price,
    trips.status,
    trips.rate,
    customer.fullname AS customer_fullname,
    customer.phone_number AS customer_phone,
    driver.fullname AS driver_fullname
FROM 
    trips
LEFT JOIN 
    users AS customer ON trips.customer_id = customer.id
LEFT JOIN 
    users AS driver ON trips.driver_id = driver.id
WHERE 
    trips.id = ?;

