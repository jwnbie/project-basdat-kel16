# Medika OS: Smart Clinical Management System

---

## Daftar Isi

1. [Tentang Proyek](#tentang-proyek)
2. [Tim Pengembang](#tim-pengembang)
3. [Fitur Utama](#fitur-utama)
4. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
5. [Arsitektur Sistem](#arsitektur-sistem)
6. [Struktur Proyek](#struktur-proyek)
7. [Panduan Instalasi](#panduan-instalasi)
8. [Konfigurasi Database](#konfigurasi-database)
9. [Dokumentasi API Backend](#dokumentasi-api-backend)
10. [Struktur Basis Data](#struktur-basis-data)
11. [Deployment](#deployment)
12. [Dokumentasi Tambahan](#dokumentasi-tambahan)

---

# Tentang Proyek

Medika OS merupakan sistem manajemen klinis berbasis web yang dirancang untuk membantu proses administrasi, pengelolaan data pasien, tenaga medis, fasilitas klinik, transaksi keuangan, serta pelaporan operasional secara terintegrasi.

Sistem ini mengimplementasikan konsep Sistem Manajemen Basis Data (SMBD) melalui penggunaan PostgreSQL sebagai basis data utama, REST API sebagai penghubung layanan backend, serta antarmuka web modern berbasis React dan TypeScript.

Proyek ini dikembangkan sebagai Final Project Mata Kuliah Sistem Manajemen Basis Data dengan tujuan menerapkan konsep perancangan basis data relasional, integrasi frontend-backend, pengolahan data operasional klinik, serta deployment aplikasi berbasis cloud.

---

# Tim Pengembang

Kelompok 16

| NRP        | Nama                        |
| ---------- | --------------------------- |
| 5024241042 | Duta Ksatria Iswanto        |
| 5024241073 | Jeff Rehobot Hasian L. Gaol |
| 5024241082 | Lu'bah Al 'Aini             |
| 5024241096 | Gloria Gledis Saidui        |

---

# Fitur Utama

## Login System

Modul autentikasi awal pengguna sebelum mengakses sistem.

Fitur:

* Halaman login pengguna
* Validasi akses sistem
* Identifikasi pengguna

---

## Command Center

Pusat kendali operasional klinik yang menampilkan informasi utama secara cepat.

Fitur:

* Ringkasan operasional harian
* Monitoring aktivitas klinik
* Akses cepat ke seluruh modul
* Total tagihan pending
---

## Executive Dashboard

Dashboard manajemen untuk monitoring performa klinik secara real-time.

Fitur:

* Total pasien terdaftar
* Total tenaga medis
* Total ruangan tersedia
* Total pendapatan klinik

Data dashboard diperoleh langsung dari basis data melalui REST API.

---

## Patients Directory

Modul pengelolaan data pasien.

Fitur:

* Menampilkan daftar pasien
* Informasi identitas pasien
* Monitoring data pasien
* Integrasi dengan sistem billing

---

## Doctors Directory

Modul pengelolaan tenaga medis.

Fitur:

* Daftar dokter
* Data spesialisasi
* Informasi departemen
* Monitoring tenaga medis aktif

---

## Rooms Directory

Modul pengelolaan fasilitas dan ruangan klinik.

Fitur:

* Monitoring seluruh ruangan
* Status ruangan tersedia
* Status ruangan terisi
* Virtual occupancy tracking

Status ruangan ditentukan secara otomatis berdasarkan data pasien yang sedang menempati ruangan.

---

## Billing Management

Modul pengelolaan transaksi dan keuangan klinik.

Fitur:

* Menampilkan seluruh invoice pasien
* Menambahkan invoice baru
* Monitoring status pembayaran
* Riwayat transaksi billing
* Detail layanan medis
* Integrasi data pasien dengan tagihan

Kategori status transaksi:

* Paid
* Pending
* Overdue

---

## System Reports

Modul pengelolaan laporan administratif dan operasional.

Fitur:

* Menampilkan laporan sistem
* Menambahkan laporan baru
* Generate laporan format PDF
* Menghapus laporan
* Monitoring status laporan
* Tracking author laporan

---

# Teknologi yang Digunakan

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

## Backend

* Node.js
* Express.js
* REST API

## Database

* PostgreSQL
* Supabase

## Deployment

* Vercel
* Render

---

# Arsitektur Sistem

```text
┌───────────────────────────┐
│         Frontend          │
│ React + TypeScript + Vite │
└──────────────┬────────────┘
               │
               │ REST API
               ▼
┌───────────────────────────┐
│          Backend          │
│    Node.js + Express.js   │
└──────────────┬────────────┘
               │
               │ SQL Query
               ▼
┌───────────────────────────┐
│         Database          │
│ PostgreSQL (Supabase)     │
└───────────────────────────┘
```

---

# Struktur Proyek

```text
project-basdat-kel16/
│
├── Supabase/
│   ├── bill_details.csv
│   ├── billing_records.csv
│   ├── departments.csv
│   ├── doctors.csv
│   ├── patients.csv
│   ├── rooms.csv
│   ├── services.csv
│   ├── system_reports.csv
│   └── visits.csv
│
├── medika-backend/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── medika-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BillingManagement.tsx
│   │   │   ├── CommandCenter.tsx
│   │   │   ├── DoctorsDirectory.tsx
│   │   │   ├── ExecutiveDashboard.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── PatientsDirectory.tsx
│   │   │   ├── RoomsDirectory.tsx
│   │   │   └── SystemReports.tsx
│   │   │
│   │   └── lib/
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── metadata.json
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── README.md
```

---

# Panduan Instalasi

## Clone Repository

```bash
git clone https://github.com/jwnbie/project-basdat-kel16.git
cd project-basdat-kel16
```

---

## Menjalankan Backend

Masuk ke folder backend:

```bash
cd medika-backend
```

Install dependency:

```bash
npm install
```

Buat file `.env`:

```env
PORT=5000
DATABASE_URL=your_database_url
```

Jalankan server:

```bash
node server.js
```

Server backend akan berjalan pada:

```text
http://localhost:5000
```

---

## Menjalankan Frontend

Masuk ke folder frontend:

```bash
cd medika-frontend
```

Install dependency:

```bash
npm install
```

Jalankan aplikasi:

```bash
npm run dev
```

Frontend akan berjalan pada:

```text
http://localhost:5173
```

---

# Konfigurasi Database

Basis data menggunakan PostgreSQL yang dihosting pada Supabase.

Tabel utama yang digunakan:

* patients
* doctors
* departments
* services
* rooms
* visits
* billing_records
* bill_details
* system_reports

Implementasi database mencakup:

* Primary Key
* Foreign Key
* Relational Database
* Data Integrity
* Query Optimization
* Cloud Database Management

---

# Dokumentasi API Backend

## Dashboard

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/dashboard/stats |

---

## Patients

| Method | Endpoint      |
| ------ | ------------- |
| GET    | /api/patients |

---

## Doctors

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | /api/medical-staff |
| GET    | /api/departments   |

---

## Rooms

| Method | Endpoint   |
| ------ | ---------- |
| GET    | /api/rooms |

---

## Services

| Method | Endpoint      |
| ------ | ------------- |
| GET    | /api/services |

---

## Visits

| Method | Endpoint    |
| ------ | ----------- |
| GET    | /api/visits |

---

## Billing

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/billing         |
| GET    | /api/billing-records |
| GET    | /api/bill-details    |
| GET    | /api/billing-stats   |
| POST   | /api/billing         |

---

## Reports

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | /api/reports     |
| POST   | /api/reports     |
| DELETE | /api/reports/:id |

---

# Struktur Basis Data

| Tabel           | Fungsi                       |
| --------------- | ---------------------------- |
| patients        | Menyimpan data pasien        |
| doctors         | Menyimpan data dokter        |
| departments     | Menyimpan data departemen    |
| services        | Menyimpan data layanan medis |
| rooms           | Menyimpan data ruangan       |
| visits          | Menyimpan data kunjungan     |
| billing_records | Menyimpan transaksi billing  |
| bill_details    | Menyimpan rincian tagihan    |
| system_reports  | Menyimpan laporan sistem     |

Relasi utama:

```text
departments
├── doctors
└── services

patients
├── visits
├── rooms
└── billing_records

billing_records
└── bill_details

system_reports
```

---

# Deployment

Frontend:

https://medika-os.vercel.app/

Backend:

https://project-basdat-kel16.onrender.com/

Database:

Supabase PostgreSQL

---

# Dokumentasi Tambahan

## Web Publik

https://medika-os.vercel.app/

## Backend API

https://project-basdat-kel16.onrender.com/

## Presentasi Proyek

https://www.canva.com/design/DAHGEQT6-fc/Ra2BleidtP-spelNgIbutg/edit

Medika OS dikembangkan sebagai implementasi konsep Sistem Manajemen Basis Data yang mencakup perancangan basis data relasional, pengembangan aplikasi berbasis web, integrasi REST API, serta deployment pada platform cloud modern.
