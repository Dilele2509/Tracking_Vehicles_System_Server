SELECT 
/*     driver_id,
    COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completed_trips,
    COUNT(CASE WHEN status IN ('Completed', 'Cancelled') THEN 1 END) AS relevant_trips, */
    ROUND(
        100 * COUNT(CASE WHEN status = 'Completed' THEN 1 END) / 
        COUNT(CASE WHEN status IN ('Completed', 'Cancelled') THEN 1 END),
        1
    ) AS success_rate_percentage
FROM 
    trips
WHERE 
    driver_id = ?
GROUP BY 
    driver_id;
