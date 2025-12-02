import React, { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import route from '../route';
import axios from 'axios';

/**
 * Elements Wrapper - Creates payment intent and wraps Elements
 */
function ElementsWrapper({ stripePromise, amount, currency, stripeKey }) {
    const [clientSecret, setClientSecret] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                if (typeof route !== 'function') {
                    setError('Route helper not available. Please refresh the page.');
                    setIsLoading(false);
                    return;
                }

                const paymentIntentRoute = route('checkout.payment-intent');
                if (!paymentIntentRoute) {
                    setError('Payment route not found. Please refresh the page.');
                    setIsLoading(false);
                    return;
                }

                const response = await axios.post(paymentIntentRoute, {
                    amount: amount,
                });

                if (response.data && response.data.clientSecret) {
                    setClientSecret(response.data.clientSecret);
                } else {
                    setError('Failed to initialize payment. Please refresh the page.');
                }
            } catch (err) {
                console.error('Payment intent creation error:', err);
                const errorMessage = err.response?.data?.error || 
                                   err.response?.data?.message ||
                                   err.message ||
                                   'Failed to initialize payment. Please try again.';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        if (amount && stripePromise) {
        createPaymentIntent();
        }
    }, [amount, stripePromise]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-sm font-medium text-gray-700">Setting up secure payment...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <div className="flex items-start">
                    <i className="fas fa-exclamation-circle text-red-500 mt-0.5 mr-3 flex-shrink-0"></i>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!clientSecret) {
        return null;
    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret: clientSecret,
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
                clientSecret={clientSecret}
            />
        </Elements>
    );
}

/**
 * Checkout Form Component
 */
function CheckoutForm({ amount, currency, stripeKey, clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const formattedAmount = (amount / 100).toFixed(2);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setError(submitError.message);
                setIsProcessing(false);
                return;
            }

            // Build return URL properly
            const successRoute = route('checkout.success');
            const returnUrl = successRoute.startsWith('http') 
                ? successRoute 
                : `${window.location.origin}${successRoute.startsWith('/') ? '' : '/'}${successRoute}`;

            const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: returnUrl,
                },
                redirect: 'if_required',
            });

            if (confirmError) {
                setError(confirmError.message);
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                try {
                    const confirmRoute = route('checkout.confirm');
                    if (!confirmRoute) {
                        throw new Error('Route not found');
                    }

                    const response = await axios.post(confirmRoute, {
                        payment_intent_id: paymentIntent.id,
                    }, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    });
                    
                    if (response.data.success && response.data.redirect_url) {
                        window.location.href = response.data.redirect_url;
                    } else {
                        const successRoute = route('checkout.success', {
                            payment_intent_id: paymentIntent.id,
                            amount: paymentIntent.amount,
                            currency: paymentIntent.currency,
                        });
                        if (successRoute) {
                            router.visit(successRoute);
                        } else {
                            window.location.href = `/checkout/success?payment_intent_id=${paymentIntent.id}&amount=${paymentIntent.amount}&currency=${paymentIntent.currency}`;
                        }
                    }
                } catch (err) {
                    console.error('Confirmation error:', err);
                    if (err.response?.data?.redirect_url) {
                        window.location.href = err.response.data.redirect_url;
                    } else if (err.response?.status === 422 || err.response?.status === 400) {
                        setError(err.response?.data?.error || 'Payment verification failed. Please contact support.');
                        setIsProcessing(false);
                    } else {
                        const successRoute = route('checkout.success', {
                            payment_intent_id: paymentIntent.id,
                            amount: paymentIntent.amount,
                            currency: paymentIntent.currency,
                        });
                        if (successRoute) {
                            router.visit(successRoute);
                        } else {
                            window.location.href = `/checkout/success?payment_intent_id=${paymentIntent.id}&amount=${paymentIntent.amount}&currency=${paymentIntent.currency}`;
                        }
                    }
                }
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <i className="fas fa-lock text-green-600"></i>
                        <span>Secured by Stripe</span>
                    </div>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 focus-within:border-indigo-500 transition-colors">
                    <PaymentElement options={{ layout: 'tabs' }} />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                    <div className="flex items-start">
                        <i className="fas fa-exclamation-circle text-red-500 mt-0.5 mr-3 flex-shrink-0"></i>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing || !clientSecret}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-3 text-base"
            >
                {isProcessing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        <span>Complete Payment</span>
                        <span className="text-lg font-bold">${formattedAmount}</span>
                        <i className="fas fa-arrow-right"></i>
                    </>
                )}
            </button>

            <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1.5">
                        <i className="fas fa-shield-alt text-green-600"></i>
                        <span>SSL Encrypted</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1.5">
                        <i className="fas fa-lock text-indigo-600"></i>
                        <span>Secure Payment</span>
                    </div>
                </div>
            </div>
        </form>
    );
}

/**
 * Main Checkout Page Component
 */
export default function Checkout({ stripeKey, amount, currency }) {
    const formattedAmount = (amount / 100).toFixed(2);

    const stripePromise = useMemo(() => {
        if (stripeKey) {
            return loadStripe(stripeKey);
        }
        return null;
    }, [stripeKey]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <i className="fas fa-shopping-bag text-white text-lg"></i>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
                                <p className="text-xs text-gray-500">Secure payment processing</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                            <i className="fas fa-shield-alt text-green-600"></i>
                            <span className="text-sm font-medium text-green-700">Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Summary Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <i className="fas fa-shopping-cart mr-3"></i>
                                    Order Summary
                                </h2>
                    </div>

                            <div className="p-6">
                                {/* Product Item */}
                                <div className="flex items-start space-x-4 pb-6 border-b border-gray-200">
                                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center border-2 border-indigo-200">
                                        <i className="fas fa-tshirt text-2xl text-indigo-600"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-semibold mb-2">
                                            Premium
                                    </span>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                            Limited Edition T-Shirt
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Premium quality cotton blend • Size: Medium
                                </p>
                            </div>
                                </div>

                                {/* Pricing Breakdown */}
                                <div className="space-y-3 pt-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">${formattedAmount}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium text-green-600">Free</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium text-gray-900">$0.00</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-semibold text-gray-900">Total</span>
                                            <div className="text-right">
                                                <span className="text-2xl font-bold text-gray-900">${formattedAmount}</span>
                                                <span className="text-sm text-gray-500 ml-1">{currency.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                                <i className="fas fa-star text-yellow-500 mr-2"></i>
                                What's Included
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-check text-green-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">100% Cotton</p>
                                        <p className="text-xs text-gray-500">Premium Quality</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-truck text-blue-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
                                        <p className="text-xs text-gray-500">1-2 Business Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <i className="fas fa-undo text-purple-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">30-Day Returns</p>
                                        <p className="text-xs text-gray-500">Money Back Guarantee</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-shield-alt text-green-600 text-lg"></i>
                                    <span className="text-sm font-medium text-gray-700">SSL Secured</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-star text-yellow-500 text-lg"></i>
                                    <span className="text-sm font-medium text-gray-700">4.9/5 Rating</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="fas fa-users text-blue-600 text-lg"></i>
                                    <span className="text-sm font-medium text-gray-700">10K+ Customers</span>
                            </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Payment Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Information</h2>
                                <p className="text-sm text-gray-600">Enter your payment details to complete your order</p>
                </div>

                            {stripeKey && stripePromise ? (
                                <ElementsWrapper
                                    stripePromise={stripePromise}
                                amount={amount}
                                currency={currency}
                                stripeKey={stripeKey}
                            />
                            ) : (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <i className="fas fa-exclamation-triangle text-yellow-600 mr-3 mt-0.5"></i>
                                        <div>
                                            <p className="text-sm font-medium text-yellow-800">Stripe Not Configured</p>
                                            <p className="text-xs text-yellow-700 mt-1">Please set STRIPE_KEY in your .env file.</p>
                                        </div>
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
