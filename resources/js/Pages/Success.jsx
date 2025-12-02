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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 flex items-center justify-center p-3 sm:p-4">
            <div
                className={`max-w-md w-full bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden text-center transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                {/* Success Icon with Animation */}
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-6 sm:p-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg animate-bounce-in">
                        <svg
                            className="w-10 h-10 sm:w-12 sm:h-12 text-green-600"
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Payment Successful!</h1>
                    <p className="text-green-100 text-xs sm:text-sm">Your transaction has been completed</p>
                </div>

                <div className="p-4 sm:p-6 md:p-8">
                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                        Thank you for your purchase! Your order has been confirmed and you will
                        receive a confirmation email shortly.
                    </p>

                    {/* Order Details Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 shadow-sm">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 sm:mb-4">
                            Order Details
                        </h3>
                        <div className="space-y-2 sm:space-y-3 text-left">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 py-2 border-b border-gray-200">
                                <span className="text-gray-600 text-xs sm:text-sm">Order Number</span>
                                <span className="font-bold text-gray-900 text-xs sm:text-sm font-mono break-all sm:break-normal">
                                    {orderNumber || 'ORD-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 py-2 border-b border-gray-200">
                                <span className="text-gray-600 text-xs sm:text-sm">Amount Paid</span>
                                <span className="font-bold text-gray-900 text-base sm:text-lg">
                                    ${formattedAmount} {displayCurrency}
                                </span>
                            </div>
                            {paymentIntentId && (
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 py-2">
                                    <span className="text-gray-600 text-xs sm:text-sm">Transaction ID</span>
                                    <span className="font-medium text-gray-700 text-xs font-mono break-all text-right sm:text-left">
                                        {paymentIntentId.substring(0, 20)}...
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 sm:space-y-3">
                        <Link
                            href={route('checkout')}
                            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 text-white font-bold py-3 sm:py-3.5 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-h-[48px] sm:min-h-[52px] text-sm sm:text-base"
                        >
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
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
                            className="inline-flex items-center justify-center w-full bg-white border-2 border-gray-200 hover:border-gray-300 active:scale-95 text-gray-700 font-semibold py-3 sm:py-3.5 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 hover:bg-gray-50 min-h-[48px] sm:min-h-[52px] text-sm sm:text-base"
                        >
                            Return to Home
                        </Link>
                    </div>

                    {/* Help Text */}
                    <p className="mt-4 sm:mt-6 text-xs text-gray-400">
                        Questions about your order?{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium underline">
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
