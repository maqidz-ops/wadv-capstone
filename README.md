# WADV Capstone API

REST API untuk proyek Capstone Web Advanced Development yang dirancang untuk mengelola tugas, kategori, tag, autentikasi pengguna, serta fitur keamanan dan dokumentasi API secara terintegrasi.

## Overview

Aplikasi ini dibangun menggunakan arsitektur backend modular dengan Node.js dan Express, didukung oleh Prisma ORM untuk akses database MySQL, serta dilengkapi dengan dokumentasi Swagger, rate limiting, autentikasi JWT, dan dukungan real-time melalui Socket.IO.

## Fitur Utama

- Autentikasi pengguna dengan JWT dan refresh token
- Manajemen tugas (CRUD) beserta status, prioritas, dan tenggat waktu
- Pengelolaan kategori dan tag untuk pengorganisasian tugas
- Relasi tugas dengan tag melalui model many-to-many
- Keamanan tambahan melalui Helmet, CORS, dan rate limiter
- Dokumentasi API interaktif dengan Swagger UI
- Dukungan real-time melalui Socket.IO

## Tech Stack

- Node.js 18+
- Express.js
- Prisma ORM
- MySQL
- JWT (jsonwebtoken)
- Socket.IO
- Swagger UI / Swagger JSDoc
- Helmet, CORS, express-rate-limit
- Joi untuk validasi input
- Argon2 untuk hashing password

## Struktur Proyek

- src/controllers: logic handler untuk endpoint API
- src/routes: definisi routing
- src/services: business logic aplikasi
- src/repositories: akses data dan query
- src/middleware: autentikasi, otorisasi, validasi, sanitasi
- src/docs: konfigurasi Swagger
- prisma: schema, migration, dan seeding database

## Prasyarat

Pastikan perangkat Anda sudah memiliki:

- Node.js v18 atau yang lebih baru
- MySQL Server atau XAMPP dengan MySQL aktif
- npm atau pnpm

## Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd WADV-CAPSTONE
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Konfigurasi Environment

Buat file .env di root proyek dan sesuaikan konfigurasi berikut:

```env
DATABASE_URL="mysql://root:@localhost:3306/wadv_capstone"
PORT=3000
NODE_ENV=development
```

> Sesuaikan nilai DATABASE_URL sesuai username, password, host, dan nama database MySQL Anda.

### 4. Migrasi dan Seed Database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Jalankan Aplikasi

Untuk mode development:

```bash
npm run dev
```

Server akan berjalan pada:

- http://localhost:3000
- Swagger UI: http://localhost:3000/api/docs
- Raw JSON Spec: http://localhost:3000/api/docs.json

## Scripts yang Tersedia

```bash
npm run dev      # menjalankan server dengan nodemon
npm start        # menjalankan server dalam mode produksi
npm run db:seed  # menjalankan seeder database
```

## Endpoint Utama

### Autentikasi

- POST /api/v1/auth/register
- POST /api/v1/auth/login

### Tugas

- GET /api/v1/tasks
- POST /api/v1/tasks
- GET /api/v1/tasks/:id
- PUT /api/v1/tasks/:id
- DELETE /api/v1/tasks/:id

### Kategori dan Tag

- GET /api/v1/tags
- POST /api/v1/tags
- POST /api/v1/task-tags/:taskId/tags
- DELETE /api/v1/task-tags/:taskId/tags/:tagId

## Dokumentasi API

Dokumentasi interaktif tersedia melalui Swagger UI. Anda dapat mengaksesnya langsung melalui browser setelah server berjalan.

## Alat Pendukung

Untuk melihat dan mengelola data database secara visual, jalankan:

```bash
npx prisma studio
```

## Catatan

Pastikan MySQL server sudah aktif sebelum menjalankan migrasi. Jika terjadi error terkait koneksi database, cek kembali nilai DATABASE_URL pada file .env.
