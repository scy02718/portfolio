// Tiny localStorage-backed settings store.
// Read on demand, write on command — no React context needed.
const NAMESPACE = 'samuel.portfolio.'

export const get = (key, fallback) => {
    if (typeof window === 'undefined') return fallback
    try {
        const raw = localStorage.getItem(NAMESPACE + key)
        if (raw === null) return fallback
        return JSON.parse(raw)
    } catch {
        return fallback
    }
}

export const set = (key, value) => {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(NAMESPACE + key, JSON.stringify(value))
    } catch {
        // quota exceeded or storage disabled — ignore
    }
}
