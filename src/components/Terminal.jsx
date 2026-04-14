import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

const VIEWS = ['home', 'about', 'education', 'experience', 'certificates', 'awards', 'skills', 'contact']

const HELP_LINES = [
    { cmd: 'ls',                  desc: 'list available views' },
    { cmd: 'cd <view>',           desc: 'switch to a view (alias: cat)' },
    { cmd: 'pwd',                 desc: 'print current view' },
    { cmd: 'whoami',              desc: 'print bio' },
    { cmd: 'open <site>',         desc: 'github | linkedin | instagram | email' },
    { cmd: 'mail',                desc: 'shortcut for cd contact' },
    { cmd: 'date',                desc: 'current date/time' },
    { cmd: 'echo <text>',         desc: 'print text' },
    { cmd: 'clear',               desc: 'clear terminal history' },
    { cmd: 'help',                desc: 'show this help' },
]

const LINKS = {
    github: 'https://github.com/scy02718',
    linkedin: 'https://linkedin.com/in/chanyoo/',
    instagram: 'https://www.instagram.com/samuel.yoo_/',
    email: 'mailto:scy02718@gmail.com',
}

const Terminal = forwardRef(({ currentView, onChangeView }, ref) => {
    const [history, setHistory] = useState(() => ([
        { kind: 'sys', content: 'samuel-portfolio v1.0.0 — type `help` for available commands' },
        { kind: 'sys', content: '' },
    ]))
    const [input, setInput] = useState('')
    const [cmdHistory, setCmdHistory] = useState([])
    const [historyCursor, setHistoryCursor] = useState(-1)
    const inputRef = useRef(null)
    const scrollRef = useRef(null)

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
            case 'clear': {
                setHistory([])
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
        <div className='flex flex-col h-full bg-black/90 border-r border-green-500/30 font-mono text-xs'>
            <div className='flex items-center gap-2 px-3 py-2 border-b border-green-500/20 bg-black/60 shrink-0'>
                <span className='w-2.5 h-2.5 rounded-full bg-red-500/70' />
                <span className='w-2.5 h-2.5 rounded-full bg-yellow-500/70' />
                <span className='w-2.5 h-2.5 rounded-full bg-green-500/70' />
                <span className='ml-3 text-green-300/80'>samuel@portfolio: <span className='text-neon-bright'>{promptPath}</span></span>
                <span className='ml-auto text-green-500/40'>— zsh</span>
            </div>

            <div
                ref={scrollRef}
                className='flex-1 overflow-y-auto p-3 text-green-200/90 leading-relaxed'
                onClick={() => inputRef.current?.focus()}
            >
                {history.map((line, i) => {
                    if (line.kind === 'cmd') {
                        return (
                            <div key={i} className='whitespace-pre-wrap break-words'>
                                <span className='text-green-500/70'>samuel@portfolio:</span>
                                <span className='text-neon-bright'>~/{line.view || currentView}</span>
                                <span className='text-green-500/70'>$ </span>
                                <span className='text-green-100'>{line.content}</span>
                            </div>
                        )
                    }
                    if (line.kind === 'err') {
                        return <div key={i} className='text-red-400/90 whitespace-pre-wrap break-words'>{line.content || '\u00a0'}</div>
                    }
                    if (line.kind === 'sys') {
                        return <div key={i} className='text-green-500/60 whitespace-pre-wrap break-words'>{line.content || '\u00a0'}</div>
                    }
                    return <div key={i} className='text-green-200/90 whitespace-pre-wrap break-words'>{line.content || '\u00a0'}</div>
                })}

                <div className='flex items-center mt-1'>
                    <span className='text-green-500/70'>samuel@portfolio:</span>
                    <span className='text-neon-bright'>{promptPath}</span>
                    <span className='text-green-500/70'>$&nbsp;</span>
                    <input
                        ref={inputRef}
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        spellCheck={false}
                        autoComplete='off'
                        className='flex-1 bg-transparent outline-none text-green-100 caret-neon-bright'
                    />
                </div>
            </div>
        </div>
    )
})

Terminal.displayName = 'Terminal'
export default Terminal
