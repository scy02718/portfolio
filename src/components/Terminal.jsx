import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import fortunes from '../lib/fortunes'
import { figlet } from '../lib/figletFont'
import * as settings from '../lib/settings'
import { playClick, playEnter } from '../lib/sounds'
import { themes, applyTheme, getCurrentTheme, themeNames } from '../lib/themes'

const buildBootLines = () => {
    const now = new Date()
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const pad = (n) => String(n).padStart(2, '0')
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    const date = String(now.getDate()).padStart(2, ' ')
    // TEST-NET-3 reserved range — won't accidentally point anywhere real
    const ip = `203.0.113.${Math.floor(Math.random() * 254) + 1}`
    const lastLogin = `Last login: ${days[now.getDay()]} ${months[now.getMonth()]} ${date} ${time} ${now.getFullYear()} from ${ip}`

    return [
        { delay: 0,    kind: 'boot-cmd', content: 'ssh samuel@portfolio.io' },
        { delay: 350,  kind: 'sys',      content: "samuel@portfolio.io's password: ********" },
        { delay: 700,  kind: 'sys',      content: lastLogin },
        { delay: 850,  kind: 'sys',      content: '' },
        { delay: 950,  kind: 'sys',      content: 'Welcome to samuel-portfolio v1.0.0' },
        { delay: 1100, kind: 'sys',      content: '' },
        { delay: 1200, kind: 'boot-ok',  content: 'mounting /dev/portfolio' },
        { delay: 1380, kind: 'boot-ok',  content: 'decrypting samuel.profile ........ 100%' },
        { delay: 1560, kind: 'boot-ok',  content: 'establishing secure shell on :443' },
        { delay: 1740, kind: 'boot-ok',  content: 'starting react@18 runtime' },
        { delay: 1920, kind: 'boot-ok',  content: 'session ready.' },
        { delay: 2080, kind: 'sys',      content: '' },
        { delay: 2180, kind: 'sys',      content: 'tip: type `help` to see available commands' },
        { delay: 2300, kind: 'sys',      content: '' },
    ]
}

const VIEWS = ['home', 'about', 'education', 'experience', 'certificates', 'awards', 'skills', 'contact']

const HELP_LINES = [
    { cmd: 'ls',                  desc: 'list available views' },
    { cmd: 'cd <view>',           desc: 'switch to a view (alias: cat)' },
    { cmd: 'pwd',                 desc: 'print current view' },
    { cmd: 'whoami',              desc: 'print bio' },
    { cmd: 'open <site>',         desc: 'github | linkedin | instagram | email' },
    { cmd: 'mail',                desc: 'shortcut for cd contact' },
    { cmd: 'history',             desc: 'show command history' },
    { cmd: 'fortune',             desc: 'random programming wisdom' },
    { cmd: 'cowsay <text>',       desc: 'a cow says text' },
    { cmd: 'figlet <text>',       desc: 'render text as block letters' },
    { cmd: 'date',                desc: 'current date/time' },
    { cmd: 'echo <text>',         desc: 'print text' },
    { cmd: 'mute / unmute',       desc: 'toggle terminal sounds' },
    { cmd: 'theme <name>',        desc: 'change color theme (try: theme list)' },
    { cmd: 'clear',               desc: 'clear terminal history' },
    { cmd: 'help',                desc: 'show this help' },
]

const cowsay = (text) => {
    const msg = text && text.trim() ? text : 'Moo!'
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

const formatClock = (date) => {
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const LINKS = {
    github: 'https://github.com/scy02718',
    linkedin: 'https://linkedin.com/in/chanyoo/',
    instagram: 'https://www.instagram.com/samuel.yoo_/',
    email: 'mailto:scy02718@gmail.com',
}

const Terminal = forwardRef(({ currentView, onChangeView }, ref) => {
    const [history, setHistory] = useState([])
    const [input, setInput] = useState('')
    const [cmdHistory, setCmdHistory] = useState([])
    const [historyCursor, setHistoryCursor] = useState(-1)
    const inputRef = useRef(null)
    const scrollRef = useRef(null)
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(id)
    }, [])

    // Boot stream — only on first session visit. Repeat visits get an instant welcome.
    useEffect(() => {
        const alreadyBooted = sessionStorage.getItem('booted') === '1'
        if (alreadyBooted) {
            setHistory([
                { kind: 'sys', content: 'samuel-portfolio v1.0.0 — type `help` for available commands' },
                { kind: 'sys', content: '' },
            ])
            return
        }
        const lines = buildBootLines()
        const timers = lines.map((line) =>
            setTimeout(() => {
                setHistory((h) => [...h, { kind: line.kind, content: line.content }])
            }, line.delay),
        )
        const finalize = setTimeout(() => {
            sessionStorage.setItem('booted', '1')
        }, lines[lines.length - 1].delay + 100)
        return () => {
            timers.forEach(clearTimeout)
            clearTimeout(finalize)
        }
    }, [])

    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
    }))

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [history])

    const append = (entries) => setHistory((h) => [...h, ...entries])

    const print = (text, kind = 'out') => append([{ kind, content: text }])

    const handleCommand = (raw) => {
        const line = raw.trim()
        // echo prompt + cmd
        append([{ kind: 'cmd', content: raw, view: currentView }])
        if (!line) return

        setCmdHistory((h) => [...h, line])
        setHistoryCursor(-1)

        const [cmd, ...args] = line.split(/\s+/)
        const arg = args.join(' ')

        switch (cmd.toLowerCase()) {
            case 'help': {
                append(HELP_LINES.map(({ cmd, desc }) => ({
                    kind: 'out',
                    content: `  ${cmd.padEnd(18)}${desc}`,
                })))
                break
            }
            case 'ls': {
                append([{ kind: 'out', content: VIEWS.map(v => v === currentView ? `${v}*` : v).join('   ') }])
                break
            }
            case 'pwd': {
                print(`~/${currentView}`)
                break
            }
            case 'whoami': {
                append([
                    { kind: 'out', content: 'samuel yoo' },
                    { kind: 'out', content: 'software development engineer @ aws' },
                    { kind: 'out', content: 'bse(hons) software engineering — university of auckland' },
                ])
                break
            }
            case 'cd':
            case 'cat': {
                if (!arg) { print(`${cmd}: missing argument`, 'err'); break }
                let target = arg.replace(/^[./~]+/, '').replace(/\/$/, '')
                if (target === '' || target === '~') target = 'home'
                if (target === '..') target = 'home'
                if (VIEWS.includes(target)) {
                    onChangeView(target)
                    print(`→ ~/${target}`)
                } else {
                    print(`${cmd}: ${arg}: no such view`, 'err')
                }
                break
            }
            case 'mail':
            case 'contact': {
                onChangeView('contact')
                print('→ ~/contact')
                break
            }
            case 'open': {
                const site = arg.toLowerCase()
                if (LINKS[site]) {
                    window.open(LINKS[site], '_blank', 'noreferrer')
                    print(`opened ${site}`)
                } else {
                    print(`open: ${arg || '<empty>'}: unknown — try github | linkedin | instagram | email`, 'err')
                }
                break
            }
            case 'echo': {
                print(arg)
                break
            }
            case 'date': {
                print(new Date().toString())
                break
            }
            case 'history': {
                if (cmdHistory.length === 0) {
                    print('history: no commands yet')
                    break
                }
                const width = String(cmdHistory.length).length
                append(cmdHistory.map((c, i) => ({
                    kind: 'out',
                    content: `  ${String(i + 1).padStart(width, ' ')}  ${c}`,
                })))
                break
            }
            case 'fortune': {
                const f = fortunes[Math.floor(Math.random() * fortunes.length)]
                print(f)
                break
            }
            case 'cowsay': {
                append(cowsay(arg).map((line) => ({ kind: 'out', content: line })))
                break
            }
            case 'figlet': {
                if (!arg) { print('figlet: missing text', 'err'); break }
                append(figlet(arg).map((line) => ({ kind: 'out', content: line })))
                break
            }
            case 'clear': {
                setHistory([])
                break
            }
            case 'mute': {
                settings.set('sound', false)
                print('sound off')
                break
            }
            case 'unmute': {
                settings.set('sound', true)
                print('sound on')
                break
            }
            case 'theme': {
                if (!arg || arg === 'list') {
                    const current = getCurrentTheme()
                    append([
                        { kind: 'out', content: 'available themes:' },
                        ...themeNames().map((name) => ({
                            kind: 'out',
                            content: `  ${name === current ? '*' : ' '} ${name.padEnd(12)}${themes[name].label}`,
                        })),
                        { kind: 'out', content: '' },
                        { kind: 'out', content: 'usage: theme <name>' },
                    ])
                    break
                }
                if (applyTheme(arg.toLowerCase())) {
                    print(`theme → ${arg.toLowerCase()}`)
                } else {
                    print(`theme: ${arg}: unknown — try \`theme list\``, 'err')
                }
                break
            }
            case 'sudo': {
                print(`sudo: ${arg}: nice try.`, 'err')
                break
            }
            case 'exit':
            case 'quit': {
                print(`${cmd}: there is no escape.`, 'err')
                break
            }
            default: {
                print(`zsh: command not found: ${cmd}`, 'err')
            }
        }
    }

    const onKeyDown = (e) => {
        // Sound feedback — printable keys + backspace click, Enter thunks
        if (e.key === 'Enter') {
            playEnter()
        } else if (e.key.length === 1 || e.key === 'Backspace') {
            playClick()
        }

        if (e.key === 'Enter') {
            e.preventDefault()
            handleCommand(input)
            setInput('')
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (cmdHistory.length === 0) return
            const next = historyCursor === -1 ? cmdHistory.length - 1 : Math.max(0, historyCursor - 1)
            setHistoryCursor(next)
            setInput(cmdHistory[next] || '')
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (historyCursor === -1) return
            const next = historyCursor + 1
            if (next >= cmdHistory.length) {
                setHistoryCursor(-1)
                setInput('')
            } else {
                setHistoryCursor(next)
                setInput(cmdHistory[next])
            }
        } else if (e.key === 'Tab') {
            e.preventDefault()
            // simple completion for `cd <view>`
            const parts = input.split(/\s+/)
            if (parts[0] === 'cd' || parts[0] === 'cat') {
                const partial = parts[1] || ''
                const matches = VIEWS.filter(v => v.startsWith(partial))
                if (matches.length === 1) {
                    setInput(`${parts[0]} ${matches[0]}`)
                } else if (matches.length > 1) {
                    print(matches.join('   '))
                }
            }
        } else if (e.key === 'l' && (e.ctrlKey)) {
            e.preventDefault()
            setHistory([])
        }
    }

    const promptPath = `~/${currentView}`

    return (
        <div className='flex flex-col h-full bg-black/90 border-r border-neon/30 font-mono text-xs'>
            <div className='flex items-center gap-2 px-3 py-2 border-b border-neon/20 bg-black/60 shrink-0'>
                <span className='w-2.5 h-2.5 rounded-full bg-red-500/70' />
                <span className='w-2.5 h-2.5 rounded-full bg-yellow-500/70' />
                <span className='w-2.5 h-2.5 rounded-full bg-neon/70' />
                <span className='ml-3 text-neon-faint/80'>samuel@portfolio: <span className='text-neon-bright'>{promptPath}</span></span>
                <span className='ml-auto text-neon/60 tabular-nums'>[{formatClock(now)}]</span>
                <span className='ml-2 text-neon/40 hidden sm:inline'>— zsh</span>
            </div>

            <div
                ref={scrollRef}
                className='flex-1 overflow-y-auto p-3 text-neon-glow/90 leading-relaxed'
                onClick={() => inputRef.current?.focus()}
            >
                {history.map((line, i) => {
                    if (line.kind === 'cmd') {
                        return (
                            <div key={i} className='whitespace-pre-wrap break-words'>
                                <span className='text-neon/70'>samuel@portfolio:</span>
                                <span className='text-neon-bright'>~/{line.view || currentView}</span>
                                <span className='text-neon/70'>$ </span>
                                <span className='text-neon-glow'>{line.content}</span>
                            </div>
                        )
                    }
                    if (line.kind === 'boot-cmd') {
                        return (
                            <div key={i} className='whitespace-pre-wrap break-words'>
                                <span className='text-neon/70'>$ </span>
                                <span className='text-neon-glow'>{line.content}</span>
                            </div>
                        )
                    }
                    if (line.kind === 'boot-ok') {
                        return (
                            <div key={i} className='whitespace-pre-wrap break-words'>
                                <span className='text-neon-bright'>[ OK ]</span>
                                <span className='text-neon-glow/80'> {line.content}</span>
                            </div>
                        )
                    }
                    if (line.kind === 'err') {
                        return <div key={i} className='text-red-400/90 whitespace-pre-wrap break-words'>{line.content || '\u00a0'}</div>
                    }
                    if (line.kind === 'sys') {
                        return <div key={i} className='text-neon/60 whitespace-pre-wrap break-words'>{line.content || '\u00a0'}</div>
                    }
                    return <div key={i} className='text-neon-glow/90 whitespace-pre-wrap break-words'>{line.content || '\u00a0'}</div>
                })}

                <div className='flex items-center mt-1'>
                    <span className='text-neon/70'>samuel@portfolio:</span>
                    <span className='text-neon-bright'>{promptPath}</span>
                    <span className='text-neon/70'>$&nbsp;</span>
                    <input
                        ref={inputRef}
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        spellCheck={false}
                        autoComplete='off'
                        className='flex-1 bg-transparent outline-none text-neon-glow caret-neon-bright'
                    />
                </div>
            </div>
        </div>
    )
})

Terminal.displayName = 'Terminal'
export default Terminal
