SELECT 
    AVG(i.total) AS average_income, 
    IFNULL(t.average_rate, 0) AS average_rate, 
    IFNULL(t.trips, 0) AS trips, 
    IFNULL(v.violates, 0) AS violates, 
    IFNULL(v.violate_info, '') AS violate_info, 
    IFNULL(v.total_punishment, 0) AS total_punishment
FROM 
    income i
LEFT JOIN (
    SELECT 
        driver_id, 
        ROUND(AVG(rate), 1) AS average_rate, 
        COUNT(id) AS trips
    FROM 
        trips
    WHERE 
        driver_id = ?
        AND YEAR(date) = ?  -- Kiểm tra năm
        AND status = 'Completed'
    GROUP BY 
        driver_id
) t ON i.user_id = t.driver_id
LEFT JOIN (
    SELECT 
        COUNT(id) AS violates, 
        GROUP_CONCAT(DISTINCT information ORDER BY information) AS violate_info, 
        SUM(punishment) AS total_punishment
    FROM 
        violates
    WHERE 
        user_id = ?
        AND YEAR(date) = ?  -- Kiểm tra năm
) v ON 1 = 1  
WHERE 
    i.user_id = ?
    AND YEAR(i.date) = ?  -- Kiểm tra năm
GROUP BY 
    t.average_rate, t.trips, v.violates, v.violate_info, v.total_punishment
LIMIT 0, 1000;
