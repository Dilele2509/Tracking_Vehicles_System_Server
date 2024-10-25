SELECT u.id, u.role_id, u.fullname, u.birthday, u.phone_number, u.email, u.avatar, u.deleted
FROM vehicles v
JOIN drivers d ON v.driver_id = d.id
JOIN users u ON d.user_id = u.id
WHERE v.owner_id = ?;
