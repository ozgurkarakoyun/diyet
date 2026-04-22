# 🥗 Diyet Takip Sistemi

Doç. Dr. Özgür Karakoyun — Beslenme & Kilo Kontrol Programı

## Özellikler

- **Hasta Kaydı & Girişi** — JWT tabanlı güvenli auth
- **4 Etaplı Diyet Takibi** — Saf Protein → Çiğ Sebze → Tam Program → Çalma+Protein
- **9 Nokta Vücut Ölçümü** — Boyun, Üst Göğüs, Göğüs, Alt Göğüs, Kol, Bel, Göbek, Kalça, Bacak
- **AI Asistan** — Claude ile program kapsamında soru-cevap
- **Öğün Kaydı** — Günlük beslenme takibi
- **Admin Paneli** — Tüm hastalar, ölçümler, etap yönetimi, istatistikler
- **SQLite Veritabanı** — Kurulum gerektirmez

---

## 🚀 Railway'e Deploy

### 1. GitHub'a Yükle

```bash
cd diyet-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/diyet-app.git
git push -u origin main
```

### 2. Railway Projesi Oluştur

1. [railway.app](https://railway.app) → **New Project**
2. **Deploy from GitHub repo** → repoyu seç
3. Otomatik deploy başlar

### 3. Environment Variables Ekle

Railway dashboard → **Variables** sekmesi → şunları ekle:

| Değişken | Değer |
|----------|-------|
| `JWT_SECRET` | `buraya-guclu-bir-sifre-en-az-32-karakter` |

### 4. Volume Ekle (Kalıcı Veritabanı)

> ⚠️ Bu adım önemli! Volume olmadan her deploy'da DB sıfırlanır.

1. Railway dashboard → **+ New** → **Volume**
2. Volume'u servise bağla
3. Mount Path: `/data`
4. `RAILWAY_VOLUME_MOUNT_PATH` değişkeni otomatik ayarlanır

### 5. Domain Al

Railway dashboard → **Settings** → **Domains** → **Generate Domain**

---

## 💻 Lokal Geliştirme

```bash
# Bağımlılıkları yükle
npm install
cd client && npm install && cd ..

# .env dosyası oluştur
cp .env.example .env
# .env içinde JWT_SECRET'ı değiştir

# Backend başlat (port 3001)
npm run dev

# Ayrı terminalde frontend başlat (port 5173)
cd client && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:3001/api

---

## 🔐 Varsayılan Admin

```
E-posta: admin@diyet.com
Şifre:   admin123
```

> ⚠️ Production'da admin şifresini değiştirin!

---

## 📁 Proje Yapısı

```
diyet-app/
├── server/
│   ├── index.js          # Express sunucu
│   ├── db.js             # SQLite + schema
│   ├── auth.js           # JWT middleware
│   └── routes/
│       ├── authRoutes.js    # Kayıt/giriş
│       ├── patientRoutes.js # Hasta API
│       └── adminRoutes.js   # Admin API
├── client/
│   ├── src/
│   │   ├── App.jsx       # Ana React uygulaması
│   │   ├── api.js        # API istek katmanı
│   │   └── main.jsx      # React entry
│   └── package.json
├── data/                 # SQLite dosyası (gitignore)
├── nixpacks.toml         # Railway build config
└── package.json
```

---

## 📡 API Endpoints

### Auth
| Method | Path | Açıklama |
|--------|------|----------|
| POST | `/api/auth/register` | Kayıt |
| POST | `/api/auth/login` | Giriş |
| GET  | `/api/auth/me` | Mevcut kullanıcı |

### Hasta (token gerekli)
| Method | Path | Açıklama |
|--------|------|----------|
| GET/POST | `/api/patient/weights` | Kilo geçmişi |
| GET/POST | `/api/patient/measurements` | Vücut ölçümleri |
| GET/POST | `/api/patient/meals` | Öğün kayıtları |
| GET/POST | `/api/patient/chat` | Chat geçmişi |
| GET | `/api/patient/profile` | Profil |

### Admin (token + admin rolü gerekli)
| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/api/admin/patients` | Tüm hastalar |
| GET | `/api/admin/patients/:id` | Hasta detay |
| PATCH | `/api/admin/patients/:id/stage` | Etap güncelle |
| PATCH | `/api/admin/patients/:id/notes` | Not ekle |
| GET | `/api/admin/stats` | İstatistikler |
