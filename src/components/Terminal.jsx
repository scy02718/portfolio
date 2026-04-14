import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { playClick, playEnter } from '../lib/sounds'
import { runPipeline, VIEWS } from '../lib/shell'
import Presence from './Presence'

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
        { delay: 2180, kind: 'sys',      content: 'tip: type `help` to see available commands · pipes work too: `fortune | cowsay`' },
        { delay: 2300, kind: 'sys',      content: '' },
    ]
}

const TAKEOVER_VIEWS = new Set(['top', 'vim'])

const formatClock = (date) => {
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

// Compute the ghost autocomplete suffix for the current input.
// Single-segment only — pipes don't ghost.
const computeGhost = (input) => {
    if (!input) return ''
    if (input.includes('|')) return ''
    const parts = input.split(/\s+/)
    if (parts.length !== 2) return ''
    const [cmd, partial] = parts
    if (!partial) return ''
    if (!['cd', 'cat'].includes(cmd.toLowerCase())) return ''
    const matches = VIEWS.filter((v) => v.startsWith(partial))
    if (matches.length !== 1) return ''
    return matches[0].slice(partial.length)
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

    // Blur the input when entering a takeover view so global q/Esc work.
    useEffect(() => {
        if (TAKEOVER_VIEWS.has(currentView)) {
            inputRef.current?.blur()
        } else {
            const id = setTimeout(() => inputRef.current?.focus(), 50)
            return () => clearTimeout(id)
        }
    }, [currentView])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [history])

    const append = (entries) => setHistory((h) => [...h, ...entries])

    const handleCommand = (raw) => {
        // Echo prompt + command line first so it always appears in history
        append([{ kind: 'cmd', content: raw, view: currentView }])

        const line = raw.trim()
        if (!line) return

        const nextCmdHistory = [...cmdHistory, line]
        setCmdHistory(nextCmdHistory)
        setHistoryCursor(-1)

        const ctx = {
            currentView,
            onChangeView,
            setHistory,
            cmdHistory: nextCmdHistory,
        }

        const { stdout, error } = runPipeline(line, ctx)

        const out = []
        if (stdout && stdout.length) {
            for (const s of stdout) {
                // stdout entries are either plain strings or {kind, content} for richer styling
                if (typeof s === 'string') out.push({ kind: 'out', content: s })
                else out.push(s)
            }
        }
        if (error) out.push({ kind: 'err', content: error })
        if (out.length > 0) append(out)
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
        } else if (e.key === 'ArrowRight') {
            const ghost = computeGhost(input)
            const atEnd = inputRef.current && inputRef.current.selectionStart === input.length
            if (ghost && atEnd) {
                e.preventDefault()
                setInput(input + ghost)
            }
        } else if (e.key === 'Tab') {
            e.preventDefault()
            // Tab completion for `cd <view>` partials (ignores piped lines)
            if (input.includes('|')) return
            const parts = input.split(/\s+/)
            if (parts[0] === 'cd' || parts[0] === 'cat') {
                const partial = parts[1] || ''
                const matches = VIEWS.filter(v => v.startsWith(partial))
                if (matches.length === 1) {
                    setInput(`${parts[0]} ${matches[0]}`)
                } else if (matches.length > 1) {
                    append([{ kind: 'out', content: matches.join('   ') }])
                }
            }
        } else if (e.key === 'l' && e.ctrlKey) {
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
                    if (line.kind === 'head') {
                        return <div key={i} className='text-neon-bright font-semibold mt-1 whitespace-pre-wrap break-words'>{line.content}</div>
                    }
                    if (line.kind === 'hint') {
                        return <div key={i} className='text-neon-faint/70 italic whitespace-pre-wrap break-words'>{line.content || '\u00a0'}</div>
                    }
                    return <div key={i} className='text-neon-glow/90 whitespace-pre-wrap break-words'>{line.content || '\u00a0'}</div>
                })}

                {(() => {
                    const ghost = computeGhost(input)
                    return (
                        <div className='flex items-center mt-1'>
                            <span className='text-neon/70'>samuel@portfolio:</span>
                            <span className='text-neon-bright'>{promptPath}</span>
                            <span className='text-neon/70'>$&nbsp;</span>
                            <div className='relative flex-1 min-h-[1.25rem]'>
                                <div className='whitespace-pre pointer-events-none' aria-hidden>
                                    <span className='text-neon-glow'>{input}</span>
                                    <span className='text-neon/40 italic'>{ghost}</span>
                                </div>
                                <input
                                    ref={inputRef}
                                    autoFocus
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    spellCheck={false}
                                    autoComplete='off'
                                    className='absolute inset-0 w-full h-full bg-transparent text-transparent caret-neon-bright outline-none p-0 m-0 border-0'
                                />
                            </div>
                        </div>
                    )
                })()}
            </div>
            <Presence />
        </div>
    )
})

Terminal.displayName = 'Terminal'
export default Terminal
