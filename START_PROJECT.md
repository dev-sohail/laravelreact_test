# Getting Started

## Quick Start Guide

### Step 1: Install Dependencies

**PHP Dependencies:**
```bash
composer install
```

**JavaScript Dependencies:**
```bash
npm install
```

### Step 2: Environment Configuration

```bash
cp .env.example .env
php artisan key:generate
```

### Step 3: Start Development

**Start both servers at once:**
```bash
composer run dev
```

This will start:
- Laravel server on `http://localhost:8000`
- Vite dev server for hot module replacement

**Or start manually:**

Terminal 1:
```bash
php artisan serve
```

Terminal 2:
```bash
npm run dev
```

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:8000
```

## Building for Production

```bash
npm run build
```

## Troubleshooting

### Commands Not Found

If `composer` or `npm` commands are not found:
1. Add them to your PATH, or
2. Use full paths to the executables

### CSRF Token Errors

- Make sure you're accessing the site through the Laravel server
- Clear your browser cache
- Run `php artisan config:clear`

### Vite Manifest Not Found

Run `npm run build` to generate the manifest file.
