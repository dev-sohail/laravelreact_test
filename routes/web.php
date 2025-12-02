<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StripeController;

Route::get('/', function () {
    return view('welcome');
});

// Stripe payment routes
Route::get('/checkout', [StripeController::class, 'checkout'])->name('checkout');
Route::post('/checkout/payment-intent', [StripeController::class, 'createPaymentIntent'])->name('checkout.payment-intent');
Route::post('/checkout/confirm', [StripeController::class, 'confirmPayment'])->name('checkout.confirm');
Route::get('/checkout/success', [StripeController::class, 'success'])->name('checkout.success');
Route::get('/checkout/cancel', [StripeController::class, 'cancel'])->name('checkout.cancel');
