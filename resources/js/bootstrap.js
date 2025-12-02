import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set up CSRF token
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Add response interceptor for better error handling
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            if (status === 419) {
                // CSRF token mismatch
                console.error('CSRF token mismatch. Please refresh the page.');
                alert('Your session has expired. Please refresh the page and try again.');
                window.location.reload();
            } else if (status >= 500) {
                // Server error
                console.error('Server error:', error.response.data);
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network error: No response from server');
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);
