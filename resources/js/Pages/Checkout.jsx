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
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
                    <p className="text-gray-600">Initializing payment...</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Element */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <PaymentElement
                    options={{
                        layout: 'tabs',
                    }}
                />
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
                    <div className="flex items-start">
                        <svg
                            className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!stripe || isProcessing || !clientSecret}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
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
                        <span>Pay ${formattedAmount}</span>
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
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </>
                )}
            </button>

            {/* Security Notice */}
            <p className="text-center text-xs text-gray-400 flex items-center justify-center space-x-1">
                <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                    />
                </svg>
                <span>Secure payment powered by Stripe</span>
            </p>
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 py-12">
            <div className="max-w-2xl w-full animate-slide-up">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-6 transform transition-all duration-300 hover:shadow-2xl">
                    <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                                className="w-32 h-32 text-white opacity-20"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <p className="text-sm font-medium opacity-90 mb-1">Premium Collection</p>
                            <h2 className="text-3xl font-bold">Limited Edition T-Shirt</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                                <p className="text-4xl font-bold text-gray-900">
                                    ${formattedAmount}
                                    <span className="text-lg text-gray-500 font-normal ml-1">
                                        {currency.toUpperCase()}
                                    </span>
                                </p>
                            </div>
                            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
                                ✓ In Stock
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="flex items-center text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
                                <svg
                                    className="w-5 h-5 mr-3 text-green-500 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                100% Cotton
                            </div>
                            <div className="flex items-center text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
                                <svg
                                    className="w-5 h-5 mr-3 text-green-500 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                Free Shipping
                            </div>
                            <div className="flex items-center text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
                                <svg
                                    className="w-5 h-5 mr-3 text-green-500 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                Secure Payment
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Form Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 transform transition-all duration-300 hover:shadow-2xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h3>
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
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="text-sm text-yellow-800">
                                Stripe is not configured. Please set STRIPE_KEY in your .env file.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
