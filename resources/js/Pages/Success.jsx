import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import route from '../route';

export default function Success({ orderNumber, amount, currency, paymentIntentId }) {
    const [isVisible, setIsVisible] = useState(false);

    // Format amount for display
    const formattedAmount = amount ? (amount / 100).toFixed(2) : '20.00';
    const displayCurrency = currency ? currency.toUpperCase() : 'USD';

    // Animation on mount
    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 flex items-center justify-center p-4">
            <div
                className={`max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden text-center transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                {/* Success Icon with Animation */}
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-8">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce-in">
                        <svg
                            className="w-12 h-12 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
                    <p className="text-green-100 text-sm">Your transaction has been completed</p>
                </div>

                <div className="p-8">
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Thank you for your purchase! Your order has been confirmed and you will
                        receive a confirmation email shortly.
                    </p>

                    {/* Order Details Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-8 border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                            Order Details
                        </h3>
                        <div className="space-y-3 text-left">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <span className="text-gray-600 text-sm">Order Number</span>
                                <span className="font-bold text-gray-900 text-sm font-mono">
                                    {orderNumber || 'ORD-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <span className="text-gray-600 text-sm">Amount Paid</span>
                                <span className="font-bold text-gray-900 text-lg">
                                    ${formattedAmount} {displayCurrency}
                                </span>
                            </div>
                            {paymentIntentId && (
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600 text-sm">Transaction ID</span>
                                    <span className="font-medium text-gray-700 text-xs font-mono break-all">
                                        {paymentIntentId.substring(0, 20)}...
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            href={route('checkout')}
                            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            Continue Shopping
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:bg-gray-50"
                        >
                            Return to Home
                        </Link>
                    </div>

                    {/* Help Text */}
                    <p className="mt-6 text-xs text-gray-400">
                        Questions about your order?{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes bounce-in {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}
