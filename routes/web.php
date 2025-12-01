<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use App\Http\Controllers\StripeController;

Route::get('/checkout', [StripeController::class, 'checkout'])->name('checkout');
Route::post('/checkout', [StripeController::class, 'session'])->name('checkout.session');
Route::get('/checkout/success', [StripeController::class, 'success'])->name('checkout.success');
Route::get('/checkout/cancel', [StripeController::class, 'cancel'])->name('checkout.cancel');
