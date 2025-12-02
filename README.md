# Laravel + React Application

A modern web application built with Laravel 12 and React 19 using Inertia.js.

## Features

- **Laravel 12** - Latest version of the Laravel framework
- **React 19** - Modern React with latest features
- **Inertia.js** - Seamless SPA experience without API complexity
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation frontend tooling
- **Ziggy** - Use Laravel routes in JavaScript

## Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js and npm

## Installation

1. **Install PHP Dependencies**
   ```bash
   composer install
   ```

2. **Install JavaScript Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Setup** (if needed)
   ```bash
   php artisan migrate
   ```

## Development

### Start Development Servers

**Option 1: Using Composer Script (Recommended)**
```bash
composer run dev
```

This will start both the Laravel server and Vite dev server concurrently.

**Option 2: Manual Start**

Terminal 1 - Laravel Server:
```bash
php artisan serve
```

Terminal 2 - Vite Dev Server:
```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
resources/
├── js/
│   ├── Pages/          # React page components
│   ├── Components/     # Reusable React components
│   ├── app.jsx         # Main application entry point
│   └── bootstrap.js    # Bootstrap file for axios, etc.
├── css/
│   └── app.css         # Global styles
└── views/
    └── app.blade.php   # Main Inertia root template
```

## Creating New Pages

1. Create a new component in `resources/js/Pages/`
2. Add a route in `routes/web.php`:
   ```php
   Route::get('/your-page', function () {
       return Inertia::render('YourPage');
   });
   ```

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
