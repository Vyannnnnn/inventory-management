# Inventory Management System

Inventory Management System adalah aplikasi web fullstack untuk digitalisasi operasional toko retail skala kecil hingga menengah. Solusi ini membantu bisnis mengelola stok, transaksi penjualan, data pemasok, dan pelaporan secara terpusat agar pengambilan keputusan lebih cepat, akurat, dan terukur.

## Ringkasan Proyek
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express REST API
- **Database:** MySQL 8
- **Deployment lokal:** Docker Compose (Frontend + Backend + MySQL)

## Fitur Utama
- Autentikasi JWT dan role-based access control (`owner`, `admin`, `kasir`, `staff_gudang`)
- Dashboard performa penjualan dan monitoring stok minimum
- Manajemen master data: produk, kategori, dan supplier
- Modul penjualan (POS) dengan transaksi database atomik
- Riwayat transaksi dengan filter dan export CSV
- Laporan penjualan, produk terlaris, dan laba kotor
- Antarmuka responsif dengan state loading dan notifikasi

## Struktur Repository
- `/frontend` — aplikasi client React
- `/backend` — REST API, business logic, dan SQL scripts
- `/backend/sql/schema.sql` — struktur database
- `/backend/sql/seed.sql` — data awal pengguna dan contoh data
- `/docker-compose.yml` — orkestrasi layanan lokal

## Menjalankan Proyek (Docker - Direkomendasikan)
1. Jalankan seluruh service:
   - `docker compose up -d --build`
2. Akses aplikasi:
   - Frontend: `http://localhost:8080`
   - API Health Check: `http://localhost:5000/health`
3. Hentikan service:
   - `docker compose down`

Catatan:
- Port MySQL host: `3307` (container tetap `3306`)
- Inisialisasi database otomatis dari `backend/sql/schema.sql` dan `backend/sql/seed.sql`
- Reset data penuh: `docker compose down -v`

## Menjalankan Proyek (Manual)
### 1) Backend
1. Salin environment file:
   - `backend/.env.example` → `backend/.env`
2. Install dependency:
   - `cd backend && npm install`
3. Inisialisasi database:
   - `npm run db:init`
4. Jalankan server:
   - `npm run dev`

Default akun hasil seed:
- `owner / Admin123!`
- `admin / Admin123!`
- `kasir / Admin123!`
- `gudang / Admin123!`

### 2) Frontend
1. Salin environment file:
   - `frontend/.env.example` → `frontend/.env`
2. Install dependency dan jalankan:
   - `cd frontend && npm install`
   - `npm run dev`

## Security Baseline
- HTTP security headers dengan `helmet`
- Rate limiting request global
- CORS terkontrol berdasarkan origin frontend
- CSRF protection (token endpoint + middleware)
- Validasi input dan parameterized query untuk mitigasi SQL injection

## Endpoint Dasar
- Base API: `/api`
- Health check: `/health`
