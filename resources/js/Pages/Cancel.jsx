import React from 'react';
import { Link } from '@inertiajs/react';

export default function Cancel() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center p-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
                <p className="text-gray-500 mb-8">
                    Your payment was cancelled and you haven't been charged. If you encountered an issue, please try again.
                </p>

                <div className="space-y-3">
                    <Link
                        href={route('checkout')}
                        className="inline-flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200"
                    >
                        Try Again
                    </Link>
                    <Link
                        href={route('checkout')}
                        className="inline-flex items-center justify-center w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl transition duration-200"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
