import React from 'react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
            <div className="max-w-4xl w-full text-center">
                <div className="mb-8">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Welcome to Laravel + React
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        A modern web application built with Laravel and React using Inertia.js
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-rocket text-indigo-600 text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Laravel 12</h3>
                        <p className="text-sm text-gray-600">
                            Powerful PHP framework for building modern web applications
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-code text-blue-600 text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">React 19</h3>
                        <p className="text-sm text-gray-600">
                            Modern UI library for building interactive user interfaces
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-bolt text-purple-600 text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Inertia.js</h3>
                        <p className="text-sm text-gray-600">
                            Seamless SPA experience without the complexity of an API
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
                    <div className="text-left max-w-2xl mx-auto space-y-3">
                        <div className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                            <div>
                                <p className="font-semibold text-gray-900">Install Dependencies</p>
                                <p className="text-sm text-gray-600">Run <code className="bg-gray-100 px-2 py-1 rounded">composer install</code> and <code className="bg-gray-100 px-2 py-1 rounded">npm install</code></p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                            <div>
                                <p className="font-semibold text-gray-900">Start Development Servers</p>
                                <p className="text-sm text-gray-600">Run <code className="bg-gray-100 px-2 py-1 rounded">composer run dev</code> to start both servers</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                            <div>
                                <p className="font-semibold text-gray-900">Start Building</p>
                                <p className="text-sm text-gray-600">Create your pages in <code className="bg-gray-100 px-2 py-1 rounded">resources/js/Pages</code></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

