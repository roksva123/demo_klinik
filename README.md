# demoluxdev

Website demo klinik estetika premium — Vite + vanilla JavaScript, Three.js, GSAP/ScrollTrigger, dan Lenis.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:2000` di browser.

## Build production

```bash
npm run build
npm run preview
```

## Struktur

- `index.html` — shell halaman, sections, menu, modal booking, lightbox.
- `src/data.js` — semua data treatment, dokter, jadwal, dan galeri.
- `src/main.js` — rendering UI, filter, menu, galeri, jadwal, modal dokter.
- `src/scene3d.js` — scene Three.js hero dengan bottle LatheGeometry, pearls, dan dust.
- `src/animations.js` — Lenis, ScrollTrigger, reveal, counter, cursor, header behavior.
- `src/booking.js` — stepper booking 4 langkah, validasi, localStorage, WhatsApp deep link.
- `src/style.css` — custom properties, editorial responsive layout, motion, reduced-motion fallback.

Foto menggunakan URL Unsplash agar mudah diganti. Nomor WhatsApp demo ada di `src/booking.js` dan `index.html`; ganti ke nomor klinik sebenarnya sebelum production.
