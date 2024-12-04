SELECT 
    SUBSTR(i.date, 1, 7) AS name, -- Lấy giá trị "YYYY-MM" từ cột date
    SUM(t.price * 0.3) AS revenue
FROM 
    income i
INNER JOIN 
    trips t ON i.trip_id = t.id
GROUP BY 
    SUBSTR(i.date, 1, 7); -- Nhóm theo tháng