// Tiny pub/sub for cross-component coordination.
// Used by terminal commands to signal active views and the result pane.
const handlers = new Map() // event -> Set<fn>

export const subscribe = (event, handler) => {
    if (!handlers.has(event)) handlers.set(event, new Set())
    handlers.get(event).add(handler)
    return () => {
        handlers.get(event)?.delete(handler)
    }
}

export const emit = (event, payload) => {
    handlers.get(event)?.forEach((h) => {
        try { h(payload) } catch (e) { console.error(`event ${event} handler threw`, e) }
    })
}
