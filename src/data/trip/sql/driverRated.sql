SELECT 
    ROUND(AVG(rate), 1) AS average_rated
FROM 
    trips
WHERE 
    driver_id = ?
    AND status = 'Completed'
GROUP BY 
    driver_id;
