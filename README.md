<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

## Stripe Integration

This project includes a basic Stripe integration for processing payments.

### Setup

1.  **Configure Environment Variables**:
    Add your Stripe API keys to the `.env` file:
    ```env
    STRIPE_KEY=pk_test_...
    STRIPE_SECRET=sk_test_...
    STRIPE_CURRENCY=usd
    ```

2.  **Install Dependencies**:
    Ensure dependencies are installed:
    ```bash
    composer install
    ```

### Usage

1.  **Checkout**:
    Visit `/checkout` to see the payment page.
    Click "Pay with Stripe" to initiate a payment session.

2.  **Success**:
    After a successful payment, you will be redirected to `/checkout/success`.

3.  **Cancel**:
    If you cancel the payment, you will be redirected to `/checkout/cancel`.

### Testing

You can use Stripe's test card numbers to verify the integration.
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
