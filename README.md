# Quick Sort Complexity Analysis

> **Tugas Besar Analisis Kompleksitas Algoritma**

## Deskripsi Proyek

Proyek ini adalah aplikasi berbasis web yang dibangun untuk menganalisis dan memvisualisasikan **Kompleksitas Algoritma Quick Sort**. Aplikasi ini dikembangkan sebagai pemenuhan Tugas Besar mata kuliah **Analisis Kompleksitas Algoritma (AKA)**.

[cite_start]Tujuan utama dari proyek ini adalah untuk membandingkan efisiensi algoritma dalam berbagai skenario (Best Case, Average Case, dan Worst Case) serta menganalisis _running time_ berdasarkan ukuran input yang berbeda[cite: 11, 20].

### Fitur Utama

- **Visualisasi Sorting:** Melihat bagaimana Quick Sort bekerja secara visual.
- **Analisis Running Time:** Mengukur waktu eksekusi algoritma dalam satuan milidetik/nanodetik.
- **Variasi Input:** Pengujian dengan berbagai ukuran input.
- **Grafik Performa:** Visualisasi grafik perbandingan waktu eksekusi.

## Anggota Kelompok

| Nama                             | NIM          |
| :------------------------------- | :----------- |
| **Akbar Riqullah Putra Susanto** | 103012430043 |
| **Farrel Malik Pirade**          | 103012400068 |
| **Ravi Adi Prakoso**             | 103012430058 |

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS

## Analisis Kompleksitas

Berdasarkan studi kasus yang dipilih, proyek ini menganalisis:

1.  **Kompleksitas Waktu Asimtotik:** Menghitung Big-O notation untuk algoritma Quick Sort.
2.  **Perbandingan Skenario:**
    - **Best Case ($O(n log n)$):** Ketika pivot membagi array secara seimbang.
    - **Worst Case ($O(n^2)$):** Ketika array sudah terurut (ascending/descending) dan pivot yang dipilih adalah elemen ekstrem.

## Cara Menjalankan Project

1.  **Clone Repository**

    ```bash
    git clone [https://github.com/farrelpirade/quicksort-complexity-analysis.git](https://github.com/farrelpirade/quicksort-complexity-analysis.git)
    cd quicksort-complexity-analysis
    ```

2.  **Install Dependencies**
    Menggunakan npm:

    ```bash
    npm install
    ```

3.  **Jalankan Development Server**

    ```bash
    npm run dev
    ```

4.  **Buka Aplikasi**
    Buka browser dan arahkan ke [http://localhost:3000](http://localhost:3000).
