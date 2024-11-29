SELECT
    device_id,
    date,
    IFNULL(
        ROUND(
            SUM(
                6371000 * SQRT(
                    POW(RADIANS(lat2 - lat1), 2) + POW(COS(RADIANS(lat1)) * RADIANS(lon2 - lon1), 2)
                )
            ) / 1000,
            3
        ),
        0
    ) AS km_per_day
FROM
    (
        SELECT
            device_id,
            latitude AS lat1,
            longitude AS lon1,
            LEAD(latitude) OVER (
                PARTITION BY device_id
                ORDER BY
                    STR_TO_DATE(CONCAT(date, ' ', time), '%Y-%m-%d %H:%i:%s')
            ) AS lat2,
            LEAD(longitude) OVER (
                PARTITION BY device_id
                ORDER BY
                    STR_TO_DATE(CONCAT(date, ' ', time), '%Y-%m-%d %H:%i:%s')
            ) AS lon2,
            date,
            time
        FROM
            devices
    ) AS subquery
WHERE
    lat2 IS NOT NULL
    AND lon2 IS NOT NULL
    AND device_id = ?
    AND date = ?
GROUP BY
    device_id,
    date;