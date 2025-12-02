# Starting the Project

## Prerequisites
Make sure you have:
- PHP 8.2+ (MAMP includes this)
- Composer installed
- Node.js and npm installed

## Step 1: Install Dependencies

### Install PHP Dependencies (Composer)
```bash
composer install
```

If composer is not in your PATH, you may need to use the full path or add it to your PATH.

### Install JavaScript Dependencies (npm)
```bash
npm install
```

If npm is not in your PATH, you may need to use the full path or add it to your PATH.

## Step 2: Configure Environment

Make sure your `.env` file has the following Stripe configuration:
```env
STRIPE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET=sk_test_your_secret_key_here
STRIPE_CURRENCY=usd
```

## Step 3: Start Development Servers

### Option 1: Using Laravel's Dev Script (Recommended)
If you have the dev script configured, you can run:
```bash
composer run dev
```

This will start both the Laravel server and Vite dev server concurrently.

### Option 2: Manual Start (Two Terminals)

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

## Step 4: Access the Application

Once both servers are running:
- Laravel server: http://localhost:8000
- Checkout page: http://localhost:8000/checkout

## Troubleshooting

### If npm/composer commands are not found:
1. Add them to your PATH, or
2. Use full paths to the executables, or
3. Use MAMP's terminal which may have them pre-configured

### If you get CSRF token errors:
- Make sure you're accessing the site through the Laravel server (not directly via file://)
- Clear your browser cache

### If Stripe payment doesn't work:
- Verify your Stripe keys are correct in `.env`
- Make sure you're using test keys (pk_test_... and sk_test_...)
- Check the browser console for any JavaScript errors

