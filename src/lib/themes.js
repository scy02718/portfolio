// Theme definitions and runtime application.
// Each theme is a 5-shade accent palette. Backgrounds stay near-black across
// all themes — themes change *accent personality*, not the chrome.
import * as settings from './settings'

// RGB triplets (space-separated) so they slot directly into rgb(var(--x) / alpha).
export const themes = {
    matrix: {
        label: 'matrix — neon green',
        accent:        '34 197 94',
        accentBright:  '74 222 128',
        accentDim:     '22 163 74',
        accentFaint:   '134 239 172',
        accentGlow:    '187 247 208',
    },
    amber: {
        label: 'amber — old CRT yellow',
        accent:        '245 158 11',
        accentBright:  '251 191 36',
        accentDim:     '180 83 9',
        accentFaint:   '252 211 77',
        accentGlow:    '253 230 138',
    },
    dracula: {
        label: 'dracula — purple/pink',
        accent:        '189 147 249',
        accentBright:  '255 121 198',
        accentDim:     '139 93 217',
        accentFaint:   '224 184 255',
        accentGlow:    '241 250 140',
    },
    solarized: {
        label: 'solarized — warm tan',
        accent:        '181 137 0',
        accentBright:  '203 75 22',
        accentDim:     '133 153 0',
        accentFaint:   '211 178 122',
        accentGlow:    '238 232 213',
    },
    cyber: {
        label: 'cyber — hot pink',
        accent:        '236 72 153',
        accentBright:  '244 114 182',
        accentDim:     '190 24 93',
        accentFaint:   '249 168 212',
        accentGlow:    '252 231 243',
    },
    ice: {
        label: 'ice — cold cyan',
        accent:        '6 182 212',
        accentBright:  '34 211 238',
        accentDim:     '14 116 144',
        accentFaint:   '103 232 249',
        accentGlow:    '207 250 254',
    },
}

export const applyTheme = (name) => {
    const theme = themes[name]
    if (!theme) return false
    const root = document.documentElement
    root.style.setProperty('--accent',         theme.accent)
    root.style.setProperty('--accent-bright',  theme.accentBright)
    root.style.setProperty('--accent-dim',     theme.accentDim)
    root.style.setProperty('--accent-faint',   theme.accentFaint)
    root.style.setProperty('--accent-glow',    theme.accentGlow)
    settings.set('theme', name)
    return true
}

export const getCurrentTheme = () => settings.get('theme', 'matrix')

export const themeNames = () => Object.keys(themes)
