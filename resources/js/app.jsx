import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { Ziggy } from 'ziggy-js'
import ErrorBoundary from './Components/ErrorBoundary'
import './bootstrap'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        return pages[`./Pages/${name}.jsx`]
    },
    setup({ el, App, props }) {
        // Initialize Ziggy with routes from Inertia props
        if (props.initialPage?.props?.ziggy) {
            Ziggy.default = props.initialPage.props.ziggy
            // Make Ziggy available globally for route helper
            if (typeof window !== 'undefined') {
                window.Ziggy = props.initialPage.props.ziggy
            }
        }
        
        // Setup global error handler for unhandled promise rejections
        if (typeof window !== 'undefined') {
            window.addEventListener('unhandledrejection', (event) => {
                console.error('Unhandled promise rejection:', event.reason);
                // Prevent default browser error handling
                event.preventDefault();
            });
        }
        
        createRoot(el).render(
            <ErrorBoundary>
                <App {...props} />
            </ErrorBoundary>
        )
    },
})
