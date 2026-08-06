# Game Belajar Berkendara

## Daftar Isi

* [Tentang Proyek](#-tentang-proyek)
* [Yang Dibutuhkan](#-yang-dibutuhkan)
* [Cara Install Proyek dan Menjalankan](#-cara-install-proyek-dan-menjalankan)

## Tentang Proyek
Penjelasan lebih detail mengenai latar belakang, teknologi yang digunakan, dan struktur folder.

1.Latar Belakang
Game Belajar Berkendara dikembangkan untuk memberikan platform simulasi berkendara yang asik dan menyenangkan melalui game, namun memiliki unsur edukatif. Game ini membawa gaya pixel art 2d dengan sudut pandang Top-Down Camera

2.Teknologi
- HTML
- Native Javascript
- Phaser Framework
- ViteJS (Bundling Tools)

3.Struktur Proyek

```
GameBelajarBerkendara/
├── node_modules/
├── public/ #Untuk Menyimpan asset statis
├── src/
│   ├── assets/ #Untuk menyimpan art
│   ├── classes/ #Untuk menyimpan class objek
│   ├── scenes/ #Untuk menyimpan scene game seperti welcome screen, pilih kendaran dan level
│   ├── config.js #Konfigurasi Phaser Js
│   ├── main.js  #Entry point phaser
├── .editorconfig
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
```

## Yang Dibutuhkan
- NodeJS 20+ (LTS Recommended):
[Install Node Js](https://nodejs.org/en/download)
- Git:
[Install Git](https://git-scm.com/install/windows)
- Code Editor (Free)

## Cara Install Proyek dan Menjalankan
1. Buka git terminal, lalu Clone Repository

```
git clone "https://github.com/BangkitBayu/game-belajar-berkendara.git"
```

2. Masuk Proyek yang sudah di install, buka terminal dan jalankan ini
```
npm install
```

3. Setelah install depedensi, lalu jalankan perintah ini untuk menjalankan proyek
* Dev
```
npm run dev
```

* Build
```
npm run build
```
* Preview
```
npm run preview
```






