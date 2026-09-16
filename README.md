# Sistem Informasi Inventory Barang

Fullstack web app untuk operasional toko kecil-menengah dengan stack:
- Frontend: React + TailwindCSS
- Backend: Node.js + Express REST API
- Database: MySQL (relasi ter-normalisasi)

## Fitur Utama
- Login JWT + RBAC (`owner`, `admin`, `kasir`, `staff_gudang`)
- Dashboard ringkasan penjualan + grafik + low stock
- Manajemen Produk, Kategori, Supplier
- POS transaksi penjualan (atomic DB transaction)
- Riwayat transaksi + filter tanggal + export CSV
- Laporan penjualan, produk terlaris, laba kotor + export CSV
- UI modern responsif, dark mode, toast, loading/empty state

## Struktur
- `frontend` : aplikasi React
- `backend` : API Express + SQL schema

## Setup Backend
1. Copy env:
   - `backend/.env.example` -> `backend/.env`
2. Buat schema database:
   - Atau jalankan otomatis: `cd backend && npm run db:init`
   - (Manual opsional) jalankan `backend/sql/schema.sql` lalu `backend/sql/seed.sql`
3. Install dependency dan jalankan:
   - `cd backend`
   - `npm install`
   - `npm run dev`

Default user seed:
- owner / `Admin123!`
- admin / `Admin123!`
- kasir / `Admin123!`
- gudang / `Admin123!`

## Setup Frontend
1. Copy env:
   - `frontend/.env.example` -> `frontend/.env`
2. Jalankan:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Menjalankan via Docker (Recommended)
Jalankan semua service (MySQL + Backend + Frontend):

1. Dari root project:
   - `docker compose up -d --build`
2. Akses aplikasi:
   - Frontend: `http://localhost:8080`
   - Backend health: `http://localhost:5000/health`
3. Stop service:
   - `docker compose down`

Catatan:
- MySQL host port: `3307` (container tetap `3306`)
- Inisialisasi database otomatis dari `backend/sql/schema.sql` dan `backend/sql/seed.sql`
- Jika ingin reset data total: `docker compose down -v`

## Security Baseline
- SQL Injection: query parameterized (`mysql2` prepared statements)
- XSS: sanitasi output by default React + Helmet headers
- CSRF: token endpoint + `csurf` middleware + `X-CSRF-Token`
- Rate limiting dan global error handling
