SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1
            FROM users
            WHERE email = @email
              AND password = @password
        ) 
        THEN 1 
        ELSE 0 
    END AS Result;
