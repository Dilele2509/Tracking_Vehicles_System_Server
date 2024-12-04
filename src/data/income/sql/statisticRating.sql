SELECT u.fullname AS fullname, ROUND(AVG(t.rate), 1) AS rate, COUNT(t.id) AS count
FROM trips t
INNER JOIN users u ON u.id = t.driver_id
WHERE rate IS NOT NULL
GROUP BY t.driver_id
