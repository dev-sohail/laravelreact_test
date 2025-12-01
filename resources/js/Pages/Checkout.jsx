import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Checkout() {
    const { post, processing } = useForm();

    const submit = (e) => {
        e.preventDefault();
        post(route('checkout.session'));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-24 h-24 text-white opacity-20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21.92,6.62a1,1,0,0,0-.54-.54A1,1,0,0,0,21,6H16a1,1,0,0,0,0,2h1.24L13.56,12.32a3,3,0,0,0,0,3.36l3.68,4.32H4a1,1,0,0,0,0,2H19a1,1,0,0,0,.76-1.64l-3.68-4.32a1,1,0,0,1,0-1.12L19.76,10.68A1,1,0,0,0,21.92,6.62Z"/>
                        </svg>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-sm font-medium opacity-90">Premium Collection</p>
                        <h2 className="text-2xl font-bold">Limited Edition T-Shirt</h2>
                    </div>
                </div>
                
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-gray-500 text-sm">Total Amount</p>
                            <p className="text-3xl font-bold text-gray-900">$20.00</p>
                        </div>
                        <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                            In Stock
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center text-gray-600 text-sm">
                            <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            100% Cotton
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                            <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Free Shipping
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                            <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Secure Payment
                        </div>
                    </div>

                    <form onSubmit={submit}>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <span>Pay with Stripe</span>
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                    
                    <p className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/></svg>
                        Powered by Stripe Payments
                    </p>
                </div>
            </div>
        </div>
    );
}
