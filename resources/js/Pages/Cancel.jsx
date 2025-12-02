import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import route from '../route';

export default function Cancel({ error }) {
    const [isVisible, setIsVisible] = useState(false);

    // Animation on mount
    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-orange-50 flex items-center justify-center p-3 sm:p-4">
            <div
                className={`max-w-md w-full bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden text-center transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                {/* Cancel Icon with Animation */}
                <div className="bg-gradient-to-br from-red-400 to-orange-500 p-6 sm:p-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg animate-shake">
                        <svg
                            className="w-10 h-10 sm:w-12 sm:h-12 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Payment Cancelled</h1>
                    <p className="text-red-100 text-xs sm:text-sm">No charges were made</p>
                </div>

                <div className="p-4 sm:p-6 md:p-8">
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                        Your payment was cancelled and you haven't been charged. If you
                        encountered an issue or changed your mind, you can try again anytime.
                    </p>

                    {/* Error Message (if any) */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 animate-fade-in">
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

                    {/* Helpful Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                        <h3 className="text-sm font-semibold text-blue-900 mb-2">
                            Need Help?
                        </h3>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            If you're experiencing payment issues, please check your card details
                            or try a different payment method. Our support team is here to help.
                        </p>
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
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Try Again
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:bg-gray-50"
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
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Return to Home
                        </Link>
                    </div>

                    {/* Support Link */}
                    <p className="mt-6 text-xs text-gray-400">
                        Having trouble?{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    10%, 30%, 50%, 70%, 90% {
                        transform: translateX(-4px);
                    }
                    20%, 40%, 60%, 80% {
                        transform: translateX(4px);
                    }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
