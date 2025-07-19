# 🚀 Deployment Guide - Barokah Printer Website

## 📋 Overview
Panduan lengkap untuk deploy aplikasi Barokah Printer ke berbagai platform hosting.

## 🏗️ Build Production
```bash
npm run build
```

## 🎯 Entry Points untuk Hosting

Aplikasi ini menyediakan beberapa entry point untuk kompatibilitas dengan berbagai platform hosting:

### 1. **server.js** (Primary Entry Point)
- Entry point utama dengan konfigurasi lengkap
- Cocok untuk: VPS, dedicated server, Docker
- Command: `npm start` atau `node server.js`

### 2. **app.js** (Serverless Compatible)
- Entry point untuk platform serverless
- Export default untuk Vercel, Netlify Functions
- Command: `npm run start:app` atau `node app.js`

### 3. **index.js** (Alternative Entry)
- Entry point alternatif untuk hosting yang memerlukan index.js
- Command: `npm run start:index` atau `node index.js`

### 4. **start.js** (Production Optimized)
- Entry point dengan logging detail untuk production
- Command: `npm run start:production` atau `node start.js`

## 🌐 Platform Hosting

### Vercel
```json
// vercel.json sudah dikonfigurasi
// Deploy command: vercel --prod
```

### Netlify
```toml
# netlify.toml (opsional)
[build]
  command = "npm run netlify-build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Heroku
```bash
# Procfile sudah dikonfigurasi
# Deploy: git push heroku main
```

### Railway
```bash
# Gunakan start command: npm start
# Port: $PORT (otomatis)
```

### Render
```bash
# Build Command: npm run build
# Start Command: npm start
# Environment: Node.js
```

## 🔧 Environment Variables

```env
PORT=3000                    # Port server (default: 3000)
HOST=0.0.0.0                # Host binding (default: 0.0.0.0)
NODE_ENV=production          # Environment mode
NODE_PORT=3000              # Alternative port variable
```

## 📁 File Structure untuk Hosting

```
barokah/
├── dist/                    # Build output (generated)
├── server.js               # Primary entry point
├── app.js                  # Serverless entry point
├── index.js                # Alternative entry point
├── start.js                # Production entry point
├── package.json            # Dependencies & scripts
├── Procfile                # Heroku configuration
├── vercel.json             # Vercel configuration
├── _redirects              # Netlify redirects
└── DEPLOYMENT.md           # This guide
```

## 🚀 Quick Deploy Commands

```bash
# Build untuk production
npm run build

# Test lokal
npm start

# Deploy ke Vercel
npm run vercel-build && vercel --prod

# Deploy ke Netlify
npm run netlify-build

# Deploy ke Heroku
git push heroku main
```

## 🔍 Health Check

Semua entry point menyediakan endpoint health check:
```
GET /health
Response: {"status": "OK", "timestamp": "2025-01-09T..."}
```

## 🛡️ Security Features

- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Static file caching dengan proper cache headers
- Graceful shutdown handling
- Error handling untuk uncaught exceptions

## 📞 Support

Jika ada masalah deployment, hubungi:
- Email: barokahprint22@gmail.com
- WhatsApp: +62853-6814-8449