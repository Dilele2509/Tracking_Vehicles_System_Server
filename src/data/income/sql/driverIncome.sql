SELECT u.fullname AS fullname, SUM(t.price * 0.3) AS total, COUNT(t.id) AS trips, ROUND(SUM(t.distance), 1) AS distance
FROM income i
INNER JOIN trips t ON i.trip_id = t.id
INNER JOIN users u ON i.user_id = u.id
GROUP BY i.user_id