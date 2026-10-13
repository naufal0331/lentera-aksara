# Lentera Aksara — Terangi Imajinasi, Hidupkan Cerita.

## Tahap 1 (paket ini): fondasi + backend yang bisa diuji
```
lentera-aksara/
├── database/schema.sql      # tabel + data contoh
├── backend/                 # Express API (auth, novel, bab, perpustakaan, progres, bookmark)
└── frontend/                # tema logo (theme.css), index.html, logo/favicon
```
## Instalasi
1. MySQL: `mysql -u root -p < database/schema.sql`
2. `cd backend && cp .env.example .env` (isi password DB & JWT_SECRET) lalu `npm install`
3. `npm run seed` (mengisi password akun demo) lalu `npm run dev`
4. Uji: `curl localhost:4000/api/health` dan `curl localhost:4000/api/novels`

Login demo: admin@ / penulis@ / pembaca@lenteraaksara.test — `Password123!` (ganti sebelum produksi).

## Tahap berikutnya
2) Frontend React (beranda, detail, pembaca)  3) Akun & perpustakaan  4) Dashboard penulis  5) Dashboard admin  6) Deployment (Nginx + PM2 + HTTPS)
