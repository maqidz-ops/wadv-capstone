# WADV-CAPSTONE API

REST API untuk proyek Capstone *Web Advanced Development*. Aplikasi ini dibangun menggunakan Node.js, Express, Prisma ORM, dan dilengkapi dengan dokumentasi interaktif Swagger UI.

---

## 🚀 Cara Setup & Instalasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lingkungan lokal Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal aplikasi berikut di komputer Anda:
* **Node.js** (Versi 18 atau yang lebih baru disarankan)
* **XAMPP / MySQL Server**

### 2. Kloning Proyek & Instal Dependensi
Buka terminal, masuk ke folder proyek, lalu jalankan perintah berikut untuk menginstal semua *library* yang dibutuhkan:
```bash
npm install

### 3. Konfigurasi Environment (.env)
Buat file bernama .env di root folder proyek Anda (atau salin dari .env.example). Sesuaikan baris koneksi database dengan MySQL lokal Anda:

DATABASE_URL="mysql://root:@localhost:3306/wadv_capstone"
PORT=3000
NODE_ENV=development

### 4. Sinkronisasi Database (Prisma Migration & Seed)
Jalankan rangkaian perintah berikut secara berurutan untuk membuat struktur tabel dan memasukkan data awal (seed):
# 1. Sinkronisasi skema prisma ke database MySQL
npx prisma migrate dev --name init

# 2. Masukkan data dummy awal ke dalam database
npx prisma db seed

### 5. Menjalankan Aplikasi
Gunakan perintah berikut untuk menyalakan server menggunakan nodemon (otomatis memuat ulang jika ada perubahan kode):
npm run dev
Setelah berjalan, server dapat diakses di http://localhost:3000.

📖 Dokumentasi API (Swagger UI)
Aplikasi ini telah dilengkapi dengan Swagger UI untuk mempermudah pengujian endpoint. Anda dapat mengakses dokumentasi interaktif melalui browser pada alamat berikut:

Swagger UI Docs: http://localhost:3000/api/docs

Raw JSON Spec: http://localhost:3000/api/docs.json

🛠️ Daftar Endpoint API
Berikut adalah rangkuman endpoint yang tersedia di dalam sistem:

1. Autentikasi (Auth)
POST /api/v1/auth/register - Registrasi pengguna baru.

POST /api/v1/auth/login - Login pengguna untuk mendapatkan access token.

2. Manajemen Tugas (Tasks)
GET /api/v1/tasks - Mengambil daftar seluruh task (mendukung pagination, filtering, dan sorting).

POST /api/v1/tasks - Membuat task baru.

GET /api/v1/tasks/{id} - Mendapatkan detail satu task berdasarkan ID.

PUT /api/v1/tasks/{id} - Memperbarui data task.

DELETE /api/v1/tasks/{id} - Menghapus task.

3. Manajemen Label (Tags)
GET /api/v1/tags - Mengambil daftar semua tag yang tersedia.

POST /api/v1/tags - Membuat data tag/label baru (nama & kode warna).

4. Relasi Tugas & Label (Task Tags)
POST /api/v1/task-tags/{taskId}/tags - Menghubungkan sebuah label/tag ke tugas tertentu (Many-to-Many).

DELETE /api/v1/task-tags/{taskId}/tags/{tagId} - Melepas hubungan tag dari tugas terkait.

Alat Tambahan: Prisma Studio
Untuk melihat, mengedit, dan mengelola isi data tabel secara visual melalui antarmuka browser, Anda dapat menjalankan perintah berikut:
npx prisma studio