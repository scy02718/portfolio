// Web Audio synthesis for terminal feedback sounds.
// Lazy AudioContext (browsers block autoplay outside a user gesture).
import * as settings from './settings'

let ctx = null

const getCtx = () => {
    if (ctx) return ctx
    try {
        const Ctor = window.AudioContext || window.webkitAudioContext
        if (!Ctor) return null
        ctx = new Ctor()
    } catch {
        ctx = null
    }
    return ctx
}

const blip = ({ freq, duration, type = 'square', gain = 0.04 }) => {
    if (!settings.get('sound', true)) return
    const c = getCtx()
    if (!c) return
    if (c.state === 'suspended') c.resume()

    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = type
    osc.frequency.value = freq
    g.gain.value = gain
    // Fast exponential decay so it sounds percussive
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration)

    osc.connect(g)
    g.connect(c.destination)
    osc.start()
    osc.stop(c.currentTime + duration)
}

export const playClick = () => {
    // Slight pitch jitter so it doesn't sound robotic
    const freq = 780 + Math.random() * 80
    blip({ freq, duration: 0.04, type: 'square', gain: 0.035 })
}

export const playEnter = () => {
    blip({ freq: 200, duration: 0.09, type: 'square', gain: 0.06 })
}
