SELECT l.id, l.license_identity, l.id_card_photo, u.fullname, u.birthday, l.license_class, l.license_date, l.expiration_date
FROM driving_license l
JOIN users u ON u.license_id = l.id
WHERE u.id = ?;