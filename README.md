# Medika OS: Smart Clinical Management System

## Kelompok 16
Sistem ini dikembangkan oleh Kelompok 16 untuk memenuhi tugas mata kuliah Basis Data. Anggota kelompok terdiri dari:
- Duta Ksatria Iswanto (5024241042)
- Jeff Rehobot Hasian L. G. (5024241073)
- Lu'bah Al 'Aini (5024241082)
- Gloria Gledis Saidui (5024241096)

## Deskripsi Proyek
Medika OS adalah sistem manajemen klinis terintegrasi yang dirancang untuk mengoptimalkan operasional rumah sakit atau klinik. Sistem ini menangani alur kerja mulai dari manajemen data pasien, pengaturan dokter, hingga sistem penagihan (billing) medis secara otomatis.

## Fitur Utama
1. **Command Center**: Pusat kontrol untuk memantau aktivitas operasional klinik secara real-time.
2. **Executive Dashboard**: Visualisasi data statistik pasien dan ketersediaan ruangan bagi pihak manajemen.
3. **Billing Management**: Sistem otomatisasi penagihan dan detail layanan medis.
4. **Data Management**: Pengelolaan basis data yang aman dan terstruktur.

## Teknologi yang Digunakan
- **Frontend**: React, TypeScript, Vite, Tailwind CSS.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (Supabase).
- **Deployment**: Vercel (Frontend) dan Render (Backend).

## Struktur Proyek
```
medika---clinical-os/
├── medika-backend/    # Kode sumber server Express.js
└── medika-frontend/   # Kode sumber aplikasi React
```

## Panduan Instalasi dan Menjalankan Proyek
### Prasyarat
Pastikan Node.js dan npm telah terinstal di perangkat Anda.

### Langkah-langkah
1. **Clone Repository**
```
   git clone [https://github.com/jwnbie/project-basdat-kel16](https://github.com/jwnbie/project-basdat-kel16)
```
2. **Setup Backend**
- Masuk ke direktori medika-backend.
- Jalankan npm install untuk menginstal dependensi.
- Buat file .env dan masukkan konfigurasi DATABASE_URL dari Supabase.
- Jalankan server dengan perintah node server.js.

2. **Setup Frontend**
- Masuk ke direktori medika-frontend.
- Jalankan npm install untuk menginstal dependensi.
- Jalankan aplikasi dengan perintah npm run dev.

### Deployment
Frontend: [https://medika-os.vercel.app/]

Backend: [https://project-basdat-kel16.onrender.com]
