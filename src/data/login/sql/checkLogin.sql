SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1
            FROM users
            WHERE email = ?
              AND password = ?
        ) 
        THEN 1 
        ELSE 0 
    END AS Result;
