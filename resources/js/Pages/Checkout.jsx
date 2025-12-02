import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import route from '../route';
import axios from 'axios';

// Initialize Stripe
const stripePromise = loadStripe(window.stripeKey || '');

/**
 * Checkout Form Component
 */
function CheckoutForm({ amount, currency, stripeKey }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Format amount for display
    const formattedAmount = (amount / 100).toFixed(2);

    // Create payment intent on mount
    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                setIsLoading(true);
                const response = await axios.post(route('checkout.payment-intent'), {
                    amount: amount,
                });

                if (response.data.clientSecret) {
                    setClientSecret(response.data.clientSecret);
                } else {
                    setError('Failed to initialize payment. Please refresh the page.');
                }
            } catch (err) {
                console.error('Payment intent creation error:', err);
                setError(
                    err.response?.data?.error ||
                    'Failed to initialize payment. Please try again.'
                );
            } finally {
                setIsLoading(false);
            }
        };

        createPaymentIntent();
    }, [amount]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Confirm payment with Stripe
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setError(submitError.message);
                setIsProcessing(false);
                return;
            }

            const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: route('checkout.confirm'),
                },
                redirect: 'if_required',
            });

            if (confirmError) {
                setError(confirmError.message);
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Redirect to success page
                router.post(route('checkout.confirm'), {
                    payment_intent_id: paymentIntent.id,
                });
            } else {
                setError('Payment was not completed. Please try again.');
                setIsProcessing(false);
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError('An unexpected error occurred. Please try again.');
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
                    <p className="text-base text-gray-600 font-medium">Initializing secure payment...</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Element */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-100 shadow-sm">
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Payment Information</h4>
                    <p className="text-xs text-gray-500">Enter your payment details below</p>
                </div>
                <PaymentElement
                    options={{
                        layout: 'tabs',
                    }}
                />
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-fade-in">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg
                                className="w-5 h-5 text-red-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-red-800 break-words">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!stripe || isProcessing || !clientSecret}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 active:scale-[0.98] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-indigo-500/25 transform transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 min-h-[56px] text-base"
            >
                {isProcessing ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span>Processing Payment...</span>
                    </>
                ) : (
                    <>
                        <span>Complete Payment</span>
                        <span className="text-lg font-extrabold">${formattedAmount}</span>
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </>
                )}
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center space-x-2 pt-2">
                <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                    />
                </svg>
                <p className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">256-bit SSL</span> encrypted. Powered by{' '}
                    <span className="font-semibold text-indigo-600">Stripe</span>
                </p>
            </div>
        </form>
    );
}

/**
 * Main Checkout Page Component
 */
export default function Checkout({ stripeKey, amount, currency }) {
    // Make stripeKey available globally for stripePromise
    if (typeof window !== 'undefined') {
        window.stripeKey = stripeKey;
    }

    const formattedAmount = (amount / 100).toFixed(2);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-gray-900">Checkout</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Product & Order Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 sm:p-12">
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white mb-3">
                                                Premium Collection
                                            </span>
                                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                                Limited Edition T-Shirt
                                            </h1>
                                            <p className="text-indigo-100 text-sm sm:text-base">
                                                Premium quality cotton blend
                                            </p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8">
                                {/* Price Section */}
                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                                                ${formattedAmount}
                                            </span>
                                            <span className="text-lg text-gray-500 font-medium">
                                                {currency.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200 mb-2">
                                            <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            In Stock
                                        </span>
                                        <span className="text-xs text-gray-500">Ships in 1-2 days</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 mb-0.5">100% Cotton</p>
                                            <p className="text-xs text-gray-500">Premium Quality</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 mb-0.5">Free Shipping</p>
                                            <p className="text-xs text-gray-500">Worldwide</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 mb-0.5">Secure Payment</p>
                                            <p className="text-xs text-gray-500">256-bit SSL</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Trusted by thousands</p>
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-gray-700 font-medium">SSL Secured</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-sm text-gray-700 font-medium">4.9/5 Rating</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-gray-700 font-medium">Money Back</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Payment Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 sticky top-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h2>
                                <p className="text-sm text-gray-500">Complete your purchase securely</p>
                            </div>
                            
                            {stripeKey && (
                                <Elements
                                    stripe={stripePromise}
                                    options={{
                                        appearance: {
                                            theme: 'stripe',
                                            variables: {
                                                colorPrimary: '#4f46e5',
                                                colorBackground: '#ffffff',
                                                colorText: '#1f2937',
                                                colorDanger: '#ef4444',
                                                fontFamily: 'system-ui, sans-serif',
                                                spacingUnit: '4px',
                                                borderRadius: '12px',
                                            },
                                        },
                                    }}
                                >
                                    <CheckoutForm
                                        amount={amount}
                                        currency={currency}
                                        stripeKey={stripeKey}
                                    />
                                </Elements>
                            )}
                            {!stripeKey && (
                                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                                    <p className="text-sm text-yellow-800">
                                        Stripe is not configured. Please set STRIPE_KEY in your .env file.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
