SELECT id, vehicle_brand, vehicle_line, thumbnail
FROM vehicles
WHERE vehicle_brand LIKE ? OR vehicle_line LIKE ?;
