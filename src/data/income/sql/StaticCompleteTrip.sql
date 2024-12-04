SELECT 
    driver_id,
    ROUND(
        100 * COUNT(CASE WHEN status = 'Completed' THEN 1 END) / 
        COUNT(CASE WHEN status IN ('Completed', 'Cancelled') THEN 1 END),
        1
    ) AS success_rate_percentage
FROM 
    trips
GROUP BY 
    driver_id;
