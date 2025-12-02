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
                setError(null);
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
            <div className="flex flex-col items-center justify-center min-h-[300px] py-8">
                <i className="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
                <p className="text-base text-gray-600 font-medium">Initializing secure payment...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Element */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                        <i className="fas fa-credit-card mr-2 text-indigo-600"></i>
                        Payment Information
                    </h4>
                    <p className="text-xs text-gray-500 ml-7">Enter your payment details below</p>
                </div>
                <PaymentElement
                    options={{
                        layout: 'tabs',
                    }}
                />
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
                    <div className="flex items-start">
                        <i className="fas fa-exclamation-circle text-red-600 mt-0.5 mr-3"></i>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800 break-words">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!stripe || isProcessing || !clientSecret}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold py-4 px-6 rounded-lg shadow-md transform transition-all duration-200 hover:shadow-lg focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 min-h-[56px] text-base"
            >
                {isProcessing ? (
                    <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Processing Payment...</span>
                    </>
                ) : (
                    <>
                        <span>Pay ${formattedAmount}</span>
                        <i className="fas fa-arrow-right"></i>
                    </>
                )}
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center space-x-2 pt-2">
                <i className="fas fa-shield-alt text-green-600"></i>
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <i className="fas fa-shopping-cart mr-3 text-indigo-600"></i>
                            Checkout
                        </h1>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <i className="fas fa-lock"></i>
                            <span>Secure Checkout</span>
                        </div>
                    </div>
                    <p className="text-gray-600">Complete your purchase securely</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Product & Order Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex-shrink-0">
                                    <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-tshirt text-5xl text-white"></i>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold mb-2">
                                                Premium Collection
                                            </span>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                                Limited Edition T-Shirt
                                            </h2>
                                            <p className="text-gray-600 text-sm">
                                                Premium quality cotton blend
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-4xl font-bold text-gray-900">
                                                ${formattedAmount}
                                            </span>
                                            <span className="text-lg text-gray-500">
                                                {currency.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200 mb-2">
                                            <i className="fas fa-check-circle mr-1.5"></i>
                                            In Stock
                                        </span>
                                        <p className="text-xs text-gray-500">Ships in 1-2 days</p>
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-check text-green-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">100% Cotton</p>
                                        <p className="text-xs text-gray-500">Premium Quality</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-truck text-blue-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
                                        <p className="text-xs text-gray-500">Worldwide</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-shield-alt text-purple-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
                                        <p className="text-xs text-gray-500">256-bit SSL</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Trusted by thousands</p>
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-shield-alt text-green-600"></i>
                                    <span className="text-sm text-gray-700 font-medium">SSL Secured</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-star text-yellow-500"></i>
                                    <span className="text-sm text-gray-700 font-medium">4.9/5 Rating</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-undo text-purple-600"></i>
                                    <span className="text-sm text-gray-700 font-medium">Money Back</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Payment Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                                    <i className="fas fa-credit-card mr-2 text-indigo-600"></i>
                                    Payment Details
                                </h2>
                                <p className="text-sm text-gray-500">Complete your purchase securely</p>
                            </div>
                            
                            {stripeKey ? (
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
                                                borderRadius: '8px',
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
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <i className="fas fa-exclamation-triangle text-yellow-600 mr-3 mt-0.5"></i>
                                        <p className="text-sm text-yellow-800">
                                            Stripe is not configured. Please set STRIPE_KEY in your .env file.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
