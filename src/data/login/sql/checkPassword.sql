SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1
            FROM users
            WHERE password = @password
        ) 
        THEN 1 
        ELSE 0 
    END AS Result;
