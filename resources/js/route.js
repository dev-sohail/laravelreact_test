import { route as ziggyRoute } from 'ziggy-js'

export default function route(name, params, absolute) {
    if (typeof window !== 'undefined' && window.Ziggy) {
        return ziggyRoute(name, params, absolute, window.Ziggy)
    }
    // Fallback for server-side or when Ziggy is not available
    return ziggyRoute(name, params, absolute)
}

