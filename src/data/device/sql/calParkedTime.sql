WITH RankedDevices AS (
    SELECT 
        id,
        device_id,
        date,
        time,
        speed,
        LEAD(id) OVER (PARTITION BY device_id ORDER BY id) AS next_id, -- Lấy id của dòng tiếp theo trong nhóm
        LEAD(time) OVER (PARTITION BY device_id ORDER BY id) AS next_time -- Lấy time của dòng tiếp theo trong nhóm
    FROM devices
    WHERE speed = 0 AND device_id = ? AND date = ?
)
SELECT 
    device_id,
    date,
    SEC_TO_TIME(SUM(TIMESTAMPDIFF(SECOND, STR_TO_DATE(time, '%H:%i:%s'), STR_TO_DATE(next_time, '%H:%i:%s')))) AS parked_time -- Tổng duration của tất cả các dòng
FROM RankedDevices
WHERE next_id = id + 1  -- Chỉ lấy các dòng có next_id là id + 1 (id liên tiếp)
GROUP BY device_id, date;
