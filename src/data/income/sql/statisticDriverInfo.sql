SELECT 
    t.driver_id,
    u.fullname AS fullname,
    u.avatar AS avatar,
    SUM(i.total) AS total,
    COUNT(t.id) AS trips,
    ROUND(AVG(t.rate), 1) AS average_rate
FROM 
    users u
LEFT JOIN income i ON u.id = i.user_id
LEFT JOIN trips t ON i.trip_id = t.id
WHERE 
    t.rate IS NOT NULL
GROUP BY 
    u.fullname, u.avatar;
