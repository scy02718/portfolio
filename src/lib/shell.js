// Mini-shell: command registry + pipeline runner.
//
// Each command is a pure function (args, stdin, ctx) => { stdout?: string[], error?: string }.
// stdin is the previous segment's stdout (an array of lines).
// Side effects (cd, theme, etc.) happen via ctx callbacks.
// The runner aborts the pipeline on the first command that returns an error.
import fortunes from './fortunes'
import { figlet } from './figletFont'
import * as settings from './settings'
import { themes, applyTheme, getCurrentTheme, themeNames } from './themes'
import { parseFileName, fileNames } from './viewContent'
import { emit } from './eventBus'

export const VIEWS = ['home', 'about', 'education', 'experience', 'certificates', 'awards', 'skills', 'contact']

const LINKS = {
    github: 'https://github.com/scy02718',
    linkedin: 'https://linkedin.com/in/chanyoo/',
    instagram: 'https://www.instagram.com/samuel.yoo_/',
    email: 'mailto:scy02718@gmail.com',
}

export const HELP_CATEGORIES = [
    {
        name: 'NAVIGATE',
        items: [
            ['ls',            'list available views'],
            ['cd <view>',     'switch to a view (alias: cat)'],
            ['pwd',           'print current view'],
            ['mail',          'shortcut for cd contact'],
        ],
    },
    {
        name: 'INFO',
        items: [
            ['whoami',        'print bio'],
            ['history',       'show command history'],
            ['date',          'current date/time'],
            ['echo <text>',   'print text'],
            ['open <site>',   'github | linkedin | instagram | email'],
        ],
    },
    {
        name: 'VIEWERS',
        items: [
            ['vim <file>',    'open a file in vim — try `vim about`'],
            ['top',           'live process viewer (q/esc to exit)'],
        ],
    },
    {
        name: 'FUN',
        items: [
            ['fortune',       'random programming wisdom'],
            ['cowsay <text>', 'a cow says text (also: pipe into me)'],
            ['figlet <text>', 'render text as block letters'],
        ],
    },
    {
        name: 'PIPES',
        items: [
            ['grep <pattern>', 'filter stdin by pattern'],
            ['wc',             'count lines/words/chars in stdin'],
        ],
        example: 'fortune | cowsay   ·   ls | grep aws   ·   history | wc',
    },
    {
        name: 'INTERACT (current view)',
        items: [
            ['sort [mode]',   'in skills view: alphabetical | proficiency'],
            ['scroll <dir>',  'scroll result pane: up | down | top | bottom'],
        ],
    },
    {
        name: 'SYSTEM',
        items: [
            ['theme <name>',  'change color theme (try: theme list)'],
            ['mute / unmute', 'toggle terminal sounds'],
            ['clear',         'clear terminal history'],
            ['help',          'show this help'],
        ],
    },
]

const cowsayLines = (text) => {
    const msg = text || 'Moo!'
    const top = ' ' + '_'.repeat(msg.length + 2)
    const bottom = ' ' + '-'.repeat(msg.length + 2)
    return [
        top,
        `< ${msg} >`,
        bottom,
        '        \\   ^__^',
        '         \\  (oo)\\_______',
        '            (__)\\       )\\/\\',
        '                ||----w |',
        '                ||     ||',
    ]
}

// ─── command implementations ──────────────────────────────────────────────────

const cdImpl = (args, stdin, ctx) => {
    if (!args[0]) return { error: 'cd: missing argument' }
    let target = args[0].replace(/^[./~]+/, '').replace(/\/$/, '')
    if (target === '' || target === '~' || target === '..') target = 'home'
    if (VIEWS.includes(target)) {
        ctx.onChangeView(target)
        return { stdout: [`→ ~/${target}`] }
    }
    return { error: `cd: ${args[0]}: no such view` }
}

const vimImpl = (args, stdin, ctx) => {
    if (!args[0]) return { error: `vim: missing file — try \`vim about\`` }
    const file = parseFileName(args[0])
    if (!file) {
        return {
            stdout: [`available: ${fileNames().join(' ')}`],
            error: `E484: Can't open file ${args[0]}`,
        }
    }
    ctx.onChangeView('vim', file)
    return { stdout: [`(in vim — type :q to exit)`] }
}

export const commands = {
    help: () => {
        const lines = []
        for (let i = 0; i < HELP_CATEGORIES.length; i++) {
            const cat = HELP_CATEGORIES[i]
            if (i > 0) lines.push('')
            lines.push({ kind: 'head', content: cat.name })
            for (const [cmd, desc] of cat.items) {
                lines.push(`  ${cmd.padEnd(16)}${desc}`)
            }
            if (cat.example) {
                lines.push({ kind: 'hint', content: `  └─ ${cat.example}` })
            }
        }
        return { stdout: lines }
    },

    ls: (args, stdin, ctx) => ({
        // One per line so `ls | grep X` works
        stdout: VIEWS.map((v) => (v === ctx.currentView ? `${v}*` : v)),
    }),

    pwd: (args, stdin, ctx) => ({ stdout: [`~/${ctx.currentView}`] }),

    whoami: () => ({
        stdout: [
            'samuel yoo',
            'software development engineer @ aws',
            'bse(hons) software engineering — university of auckland',
        ],
    }),

    cd: cdImpl,
    cat: cdImpl,

    mail: (args, stdin, ctx) => {
        ctx.onChangeView('contact')
        return { stdout: ['→ ~/contact'] }
    },
    contact: (args, stdin, ctx) => {
        ctx.onChangeView('contact')
        return { stdout: ['→ ~/contact'] }
    },

    open: (args) => {
        const site = (args[0] || '').toLowerCase()
        if (LINKS[site]) {
            window.open(LINKS[site], '_blank', 'noreferrer')
            return { stdout: [`opened ${site}`] }
        }
        return { error: `open: ${args[0] || '<empty>'}: unknown — try github | linkedin | instagram | email` }
    },

    history: (args, stdin, ctx) => {
        if (!ctx.cmdHistory || ctx.cmdHistory.length === 0) {
            return { stdout: ['history: no commands yet'] }
        }
        const width = String(ctx.cmdHistory.length).length
        return {
            stdout: ctx.cmdHistory.map((c, i) => `  ${String(i + 1).padStart(width, ' ')}  ${c}`),
        }
    },

    fortune: () => ({
        stdout: [fortunes[Math.floor(Math.random() * fortunes.length)]],
    }),

    cowsay: (args, stdin) => {
        let text = args.join(' ').trim()
        if (!text && stdin && stdin.length) text = stdin.join(' ').trim()
        if (!text) text = 'Moo!'
        return { stdout: cowsayLines(text) }
    },

    figlet: (args, stdin) => {
        const text = args.join(' ') || (stdin && stdin.length ? stdin.join(' ') : '')
        if (!text) return { error: 'figlet: missing text' }
        return { stdout: figlet(text) }
    },

    date: () => ({ stdout: [new Date().toString()] }),

    echo: (args) => ({ stdout: [args.join(' ')] }),

    mute: () => {
        settings.set('sound', false)
        return { stdout: ['sound off'] }
    },

    unmute: () => {
        settings.set('sound', true)
        return { stdout: ['sound on'] }
    },

    theme: (args) => {
        const arg = args.join(' ')
        if (!arg || arg === 'list') {
            const current = getCurrentTheme()
            return {
                stdout: [
                    'available themes:',
                    ...themeNames().map(
                        (name) =>
                            `  ${name === current ? '*' : ' '} ${name.padEnd(12)}${themes[name].label}`,
                    ),
                    '',
                    'usage: theme <name>',
                ],
            }
        }
        if (applyTheme(arg.toLowerCase())) {
            return { stdout: [`theme → ${arg.toLowerCase()}`] }
        }
        return { error: `theme: ${arg}: unknown — try \`theme list\`` }
    },

    top: (args, stdin, ctx) => {
        ctx.onChangeView('top')
        return { stdout: ['(press q or esc to exit)'] }
    },

    vim: vimImpl,
    vi: vimImpl,
    nvim: vimImpl,

    sort: (args, stdin, ctx) => {
        if (ctx.currentView !== 'skills') {
            return { error: `sort: only available in ~/skills (cd skills first)` }
        }
        const mode = args[0] ? args[0].toLowerCase() : null
        if (mode && mode !== 'alphabetical' && mode !== 'proficiency') {
            return { error: `sort: ${args[0]}: unknown — use alphabetical | proficiency` }
        }
        emit('skills:sort', mode)
        return { stdout: [`sort → ${mode || 'toggled'}`] }
    },

    scroll: (args) => {
        const dir = args[0] ? args[0].toLowerCase() : 'down'
        if (!['up', 'down', 'top', 'bottom'].includes(dir)) {
            return { error: `scroll: ${args[0]}: unknown — use up | down | top | bottom` }
        }
        emit('pane:scroll', dir)
        return { stdout: [`scroll ${dir}`] }
    },

    grep: (args, stdin) => {
        const pattern = args.join(' ')
        if (!pattern) return { error: 'usage: grep <pattern>' }
        if (!stdin || stdin.length === 0) return { stdout: [] }
        const lower = pattern.toLowerCase()
        return { stdout: stdin.filter((line) => line.toLowerCase().includes(lower)) }
    },

    wc: (args, stdin) => {
        const lines = stdin || []
        const chars = lines.reduce((s, l) => s + l.length, 0)
        const words = lines.reduce((s, l) => s + l.split(/\s+/).filter(Boolean).length, 0)
        return { stdout: [`  ${lines.length}  ${words}  ${chars}`] }
    },

    clear: (args, stdin, ctx) => {
        ctx.setHistory([])
        return { stdout: [] }
    },

    sudo: (args) => ({
        error: `sudo: ${args.join(' ') || '<empty>'}: nice try.`,
    }),

    exit: (args, stdin, ctx) => ({ error: `exit: there is no escape.` }),
    quit: (args, stdin, ctx) => ({ error: `quit: there is no escape.` }),
}

// ─── tokenizer + runner ───────────────────────────────────────────────────────

const tokenize = (segment) => segment.trim().split(/\s+/).filter(Boolean)

// Strip rich {kind, content} wrappers down to plain strings so intermediate
// pipe stages always see flat string[] as stdin.
const flatten = (out) =>
    (out || []).map((s) => (typeof s === 'string' ? s : s.content || ''))

export const runPipeline = (line, ctx) => {
    const trimmed = line.trim()
    if (!trimmed) return { stdout: [], error: null }

    const segments = trimmed.split('|').map((s) => s.trim()).filter(Boolean)
    if (segments.length === 0) return { stdout: [], error: null }

    let stdin = []
    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i]
        const isLast = i === segments.length - 1
        const tokens = tokenize(seg)
        if (tokens.length === 0) continue
        const cmdName = tokens[0].toLowerCase()
        const args = tokens.slice(1)

        const fn = commands[cmdName]
        if (!fn) {
            return { stdout: [], error: `zsh: command not found: ${cmdName}` }
        }

        const result = fn(args, stdin, ctx)
        if (result.error) {
            return { stdout: result.stdout || [], error: result.error }
        }
        // Last segment keeps rich items so the renderer can style them.
        // Intermediate segments get flattened so grep/wc see plain strings.
        stdin = isLast ? (result.stdout || []) : flatten(result.stdout)
    }

    return { stdout: stdin, error: null }
}
