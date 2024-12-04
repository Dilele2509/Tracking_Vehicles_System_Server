SELECT i.date AS name, SUM(t.price * 0.3) AS revenue
FROM income i
INNER JOIN trips t ON i.trip_id = t.id
GROUP BY i.date