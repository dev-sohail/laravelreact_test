<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;
use Inertia\Inertia;

class StripeController extends Controller
{
    /**
     * Initialize Stripe API key
     */
    private function initStripe()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Display the checkout page
     */
    public function checkout()
    {
        return Inertia::render('Checkout', [
            'stripeKey' => config('services.stripe.key'),
            'amount' => 2000, // $20.00 in cents
            'currency' => config('services.stripe.currency', 'usd'),
        ]);
    }

    /**
     * Create a payment intent
     */
    public function createPaymentIntent(Request $request)
    {
        try {
            $this->initStripe();

            // Validate request
            $request->validate([
                'amount' => 'sometimes|integer|min:50', // Minimum $0.50
            ]);

            $amount = $request->input('amount', 2000); // Default $20.00
            $currency = config('services.stripe.currency', 'usd');

            // Create payment intent
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => $currency,
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
                'metadata' => [
                    'product_name' => 'Limited Edition T-Shirt',
                ],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'paymentIntentId' => $paymentIntent->id,
            ]);
        } catch (ApiErrorException $e) {
            Log::error('Stripe API Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Payment processing failed. Please try again.',
                'message' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            Log::error('Payment Intent Creation Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'An unexpected error occurred. Please try again.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Confirm payment and handle success
     */
    public function confirmPayment(Request $request)
    {
        try {
            $this->initStripe();

            $request->validate([
                'payment_intent_id' => 'required|string',
            ]);

            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);

            if ($paymentIntent->status === 'succeeded') {
                // Generate order number
                $orderNumber = 'ORD-' . date('Y') . '-' . strtoupper(substr(uniqid(), -6));

                // If it's an AJAX request, return JSON
                if ($request->expectsJson() || $request->ajax()) {
                    return response()->json([
                        'success' => true,
                        'redirect_url' => route('checkout.success', [
                            'payment_intent_id' => $paymentIntent->id,
                            'amount' => $paymentIntent->amount,
                            'currency' => $paymentIntent->currency,
                            'order_number' => $orderNumber,
                        ]),
                        'order_number' => $orderNumber,
                        'amount' => $paymentIntent->amount,
                        'currency' => $paymentIntent->currency,
                    ]);
                }

                // Otherwise redirect normally
                return redirect()->route('checkout.success', [
                    'payment_intent_id' => $paymentIntent->id,
                    'amount' => $paymentIntent->amount,
                    'currency' => $paymentIntent->currency,
                    'order_number' => $orderNumber,
                ]);
            }

            // Payment not succeeded
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Payment was not completed.',
                    'redirect_url' => route('checkout.cancel'),
                ], 400);
            }

            return redirect()->route('checkout.cancel')->with('error', 'Payment was not completed.');
        } catch (ApiErrorException $e) {
            Log::error('Stripe Payment Confirmation Error: ' . $e->getMessage());
            
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Payment verification failed.',
                    'redirect_url' => route('checkout.cancel'),
                ], 500);
            }
            
            return redirect()->route('checkout.cancel')->with('error', 'Payment verification failed.');
        } catch (\Exception $e) {
            Log::error('Payment Confirmation Error: ' . $e->getMessage());
            
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'error' => 'An error occurred while processing your payment.',
                    'redirect_url' => route('checkout.cancel'),
                ], 500);
            }
            
            return redirect()->route('checkout.cancel')->with('error', 'An error occurred while processing your payment.');
        }
    }

    /**
     * Display success page
     */
    public function success(Request $request)
    {
        $orderNumber = $request->get('order_number', 'ORD-' . date('Y') . '-' . strtoupper(substr(uniqid(), -6)));
        $amount = $request->get('amount', 2000);
        $currency = strtoupper($request->get('currency', 'usd'));
        $paymentIntentId = $request->get('payment_intent_id', '');

        return Inertia::render('Success', [
            'orderNumber' => $orderNumber,
            'amount' => $amount,
            'currency' => $currency,
            'paymentIntentId' => $paymentIntentId,
        ]);
    }

    /**
     * Display cancel page
     */
    public function cancel(Request $request)
    {
        return Inertia::render('Cancel', [
            'error' => $request->session()->get('error'),
        ]);
    }
}
