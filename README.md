# 🍽️ Menu Catalog API - GDGOC Backend Assignment

![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-critical?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20%26%20Modular-blue?style=for-the-badge)

## 📌 Tentang Proyek

Proyek ini adalah RESTful API yang dikembangkan sebagai bagian dari penugasan seleksi **Google Developer Groups on Campus (GDGOC)** untuk divisi Backend.

Aplikasi ini berfungsi sebagai katalog menu digital yang memungkinkan manajemen item makanan dan minuman. Dibangun menggunakan **Express.js**, proyek ini berfokus pada:
1.  **Keamanan:** Implementasi otentikasi berbasis **JWT (JSON Web Token)**.
2.  **Maintainability:** Menerapkan arsitektur yang terpisah (Separation of Concerns) untuk memudahkan debugging dan pengembangan fitur (Scalability).
3.  **Robustness:** Validasi skema data yang ketat dan penanganan error yang komprehensif.

## 🚀 Fitur Utama

* **Authentication & Authorization:**
    * Registrasi Admin.
    * Login aman menggunakan JWT Access Token.
    * Proteksi endpoint (Middleware) untuk operasi sensitif (Create, Update, Delete).
* **Menu Management (CRUD):**
    * Menambah, membaca, memperbarui, dan menghapus item menu.
    * Validasi tipe data (String, Number, Array) untuk setiap payload.
* **Advanced Data Retrieval:**
    * **Search (`q`):** Pencarian menu berdasarkan nama.
    * **Filtering:** Berdasarkan kategori, rentang harga (`min_price`, `max_price`), dan kalori (`max_cal`).
    * **Sorting:** Mengurutkan data (contoh: `price:asc`).
    * **Pagination:** Navigasi data menggunakan `page` dan `per_page`.
* **Aggregation:**
    * Mengelompokkan menu berdasarkan kategori (mode `count` atau `list`).

## 🏗️ Struktur Arsitektur

Proyek ini menggunakan pola arsitektur berlapis (Layered Architecture) untuk memisahkan tanggung jawab:

* **Handler/Controller:** Mengelola request dan response HTTP.
* **Service:** Berisi logika bisnis (Business Logic Layer).
* **Repository/Model:** Berinteraksi langsung dengan database.
* **Utils/Validator:** Fungsi pendukung dan validasi skema input.

*Keuntungan: Kode lebih mudah dibaca, ditest (unit testing), dan di-debug karena error terisolasi pada layer tertentu.*

## 🛠️ Instalasi & Menjalankan

Ikuti langkah berikut untuk menjalankan proyek di mesin lokal:

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/username-anda/menu-catalog-api.git](https://github.com/username-anda/menu-catalog-api.git)
    ```

2.  **Install Dependencies**
    ```bash
    pnpm install
    ```

3.  **Konfigurasi Environment**
    Buat file `.env` dan sesuaikan variabel berikut:
    ```env
    PORT=3000
    HOST=localhost
    ACCESS_TOKEN_KEY=rahasia-super-anda
    # Tambahkan konfigurasi database jika ada
    ```

4.  **Jalankan Server**
    ```bash
    pnpm start
    # atau untuk mode development
    pnpm dev
    ```

## 📚 Dokumentasi API

Berikut adalah daftar endpoint yang tersedia berdasarkan Postman Collection.

### 🔐 Authentication

| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/users` | Mendaftarkan user admin baru | Tidak |
| `POST` | `/authentications` | Login user & mendapatkan Access Token | Tidak |

### 🍔 Menu Management

| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/menu` | Mendapatkan daftar menu (mendukung filter & sort) | Tidak |
| `GET` | `/menu/:id` | Mendapatkan detail satu menu | Tidak |
| `POST` | `/menu` | Menambahkan menu baru | **Ya** |
| `PUT` | `/menu/:id` | Mengupdate data menu | **Ya** |
| `DELETE` | `/menu/:id` | Menghapus menu | **Ya** |

### 📊 Aggregation

| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/menu/group-by-category` | Mendapatkan statistik/list menu per kategori | Tidak |

---

## 🧪 Pengujian API (Postman)

Repository ini menyertakan file Postman Collection untuk mempermudah pengujian.

1.  **Import Collection:**
    Import file `Menu Catalog - Postman Collection.postman_collection.json` ke dalam aplikasi Postman Anda.

2.  **Setup Environment:**
    Pastikan variable `BASE_URL` di Postman diset ke `http://localhost:3000` (atau port yang Anda gunakan).

3.  **Skenario Tes:**
    Collection ini mencakup **Automated Tests** pada tab "Tests" untuk memvalidasi:
    * Status Code (200, 201, 400, 401, 404).
    * Schema Validation (Struktur JSON Response).
    * Validasi Logika Bisnis (Perhitungan harga, tipe data, dll).

### Contoh Query Parameter
Untuk mencoba fitur filter dan sorting pada `GET /menu`, gunakan parameter berikut:
`GET /menu?q=kopi&category=drinks&min_price=10000&max_cal=500&sort=price:asc`

---

## 👨‍💻 Author

**Garjita Adicandra**
* Role: Backend Developer Applicant
* Assignment: GDGOC Recruitment

---
*Dibuat dengan menggunakan Express.js*
