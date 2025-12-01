import React from 'react';
import { Link } from '@inertiajs/react';

export default function Success() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-500 mb-8">
                    Thank you for your purchase. Your order has been confirmed and is on its way.
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-sm">Order Number</span>
                        <span className="font-medium text-gray-900 text-sm">#ORD-2023-8892</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 text-sm">Amount Paid</span>
                        <span className="font-medium text-gray-900 text-sm">$20.00</span>
                    </div>
                </div>

                <Link
                    href={route('checkout')}
                    className="inline-flex items-center justify-center w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition duration-200"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
