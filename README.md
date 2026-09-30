# Naufal Hunaif — Dot Visual Journal

Halaman tunggal tanpa teks visual. Sepuluh adegan tersusun dari titik native:
wajah, galaksi, kuda berlari, pohon dan akar, manusia, planet bercincin, bunga,
burung terbang, pegunungan, dan bentuk abstrak.

Wajah, manusia, kuda, dan burung memakai geometri anatomi 3D. Bentuk alam lainnya
menggunakan geometri atau medan cahaya prosedural. Posisi permukaan, kedalaman,
dan pencahayaan menentukan setiap titik. Tidak ada foto, tekstur, atau file
gambar untuk visual. Atribusi model tersedia di `public/assets/model-credits.txt`.

Titik dirender sebagai WebGL points dengan lingkaran antialias; Canvas 2D menjadi
fallback. Resolusi mengikuti `devicePixelRatio`, dengan batas memori untuk layar
besar. Animasi berhenti ketika tab tidak terlihat dan menghormati reduced motion.
Kontrol panah, titik pilihan, acak, jeda, keyboard, dan usapan tetap tersedia.

## Jalankan dan periksa

```sh
npm install
npm run check
npm run dev
```

`public/index.html` juga dapat dibuka langsung sebagai berkas lokal karena aset
memakai URL relatif dan geometri dimuat melalui JavaScript, tanpa fetch.

## Deploy

```sh
npm run deploy
```

Cloudflare Workers Static Assets menyajikan `public/` langsung tanpa skrip Worker
yang menulis ulang rute. Repositori terhubung ke deployment Cloudflare.

## Geometri

`public/assets/models.js` berisi posisi, normal, indeks segitiga, dan pose gerak;
tidak berisi data piksel. `scripts/build-models.py` menghasilkan berkas ini dari
sumber berlisensi yang dicantumkan dalam atribusi. `scripts/nature-models.py`
membuat geometri tumbuhan serta pegunungan. Keduanya memakai Python dan NumPy
hanya ketika membangun ulang model, bukan saat deployment atau penayangan.
