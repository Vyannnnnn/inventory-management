USE inventory_toko;

-- Password default untuk semua user contoh: Admin123!
-- Hash bcrypt berikut dibuat dari Admin123!
INSERT INTO users (full_name, username, password_hash, role)
VALUES
  ('Pemilik Toko', 'owner', '$2b$10$0lsP0PjtSUBhnKSm0O5rlOb6Cu3vmSUbubsYp6lqeUHm456BEbA8i', 'owner'),
  ('Admin Toko', 'admin', '$2b$10$0lsP0PjtSUBhnKSm0O5rlOb6Cu3vmSUbubsYp6lqeUHm456BEbA8i', 'admin'),
  ('Kasir Utama', 'kasir', '$2b$10$0lsP0PjtSUBhnKSm0O5rlOb6Cu3vmSUbubsYp6lqeUHm456BEbA8i', 'kasir'),
  ('Staf Gudang', 'gudang', '$2b$10$0lsP0PjtSUBhnKSm0O5rlOb6Cu3vmSUbubsYp6lqeUHm456BEbA8i', 'staff_gudang')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  password_hash = VALUES(password_hash),
  role = VALUES(role);
