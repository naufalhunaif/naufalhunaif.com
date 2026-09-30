# Naufal Hunaif — Dot Visual Journal

Halaman tunggal tanpa teks visual: sepuluh karya hitam-putih dari titik yang digambar
langsung oleh Canvas berganti otomatis. Pengunjung bisa memilih karya melalui sepuluh titik, tombol panah, tombol
acak, tombol jeda, tombol keyboard kiri/kanan, atau usapan di layar sentuh.
Nama objek disimpan sebagai label aksesibilitas untuk pembaca layar.

Resolusi kanvas mengikuti `devicePixelRatio` layar (dibatasi untuk menjaga
kinerja). Wajah, kuda berlari, pohon dan akar, manusia, galaksi, planet, bunga,
burung, pegunungan, serta bentuk abstrak dibuat secara prosedural; tidak ada file
gambar untuk karya.

Halaman disajikan langsung oleh Cloudflare Workers Static Assets. Tidak ada
skrip Worker yang menulis ulang rute halaman.

## Jalankan

```sh
npm install
npm run dev
```

## Deploy

```sh
npm run deploy
```

Kode visual dan urutan karya berada di `public/assets/universe.js`.
