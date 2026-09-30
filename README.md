# naufalhunaif.com — Dot Matrix Page

Satu halaman personal untuk Cloudflare Workers. Semua teks yang terlihat dirender
sebagai huruf dot matrix 7×9. Ikon, ilustrasi, dan pola halaman juga memakai titik.
Halaman disajikan langsung sebagai Static Assets oleh Cloudflare, tanpa skrip
Worker yang menulis ulang rute `/`.
Visual utama berganti otomatis antara 12 subjek: wajah artistik, kuda berlari,
manusia, tumbuhan dan akar, galaksi, planet, burung, ikan, kupu-kupu,
pegunungan, nebula, serta komposisi abstrak. Tombol panah
memungkinkan pengunjung mengganti visual secara manual. Preferensi gerakan
minimal menghentikan pergantian otomatis.
Konten tetap berupa HTML semantik agar dapat dibaca pembaca layar dan tetap
terlihat ketika JavaScript tidak tersedia.

## Jalankan lokal

```sh
npm install
npm run dev
```

## Deploy

```sh
npm run deploy
```

Setelah deploy, sambungkan `naufalhunaif.com` melalui **Workers & Pages → Worker →
Settings → Domains & Routes → Add Custom Domain** di Cloudflare. Domain tidak
dipasang otomatis oleh konfigurasi ini.

Teks halaman ada di `public/index.html`; warna dan tata letak di
`public/assets/style.css` dan `public/assets/universe.css`; pola huruf dan ikon di
`public/assets/app.js`; animasi visual di `public/assets/universe.js`.
Kedua JPEG di `public/assets/` berasal dari contoh yang diberikan. Gambar wajah
dipakai sebagai karya visual, bukan sebagai pernyataan identitas pemilik situs.
