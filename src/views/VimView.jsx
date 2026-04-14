import React, { useEffect, useRef, useState } from 'react'
import { viewContent, fileBytes } from '../lib/viewContent'

const VimView = ({ arg, onExit }) => {
    const file = arg && viewContent[arg] ? arg : null
    const lines = file ? viewContent[file] : [`E484: Can't open file ${arg ?? '<unnamed>'}`]
    const bytes = fileBytes(lines)
    const filename = file ? `${file}.md` : '[no name]'

    const [mode, setMode] = useState('normal')   // 'normal' | 'command'
    const [cmdInput, setCmdInput] = useState('')
    const [statusMsg, setStatusMsg] = useState('')
    const cmdRef = useRef(null)

    // Focus the command input when entering command mode
    useEffect(() => {
        if (mode === 'command') {
            // tiny delay so React commits the render first
            const id = setTimeout(() => cmdRef.current?.focus(), 10)
            return () => clearTimeout(id)
        }
    }, [mode])

    // Normal-mode keyboard handler — listen on window so we don't need a tab-trap
    useEffect(() => {
        const onKey = (e) => {
            if (mode !== 'normal') return
            // Skip if some other input has focus
            const tag = document.activeElement?.tagName
            if (tag === 'INPUT' || tag === 'TEXTAREA') return

            if (e.key === ':') {
                e.preventDefault()
                setStatusMsg('')
                setCmdInput('')
                setMode('command')
            } else if (e.key === 'q' || e.key === 'Escape') {
                e.preventDefault()
                onExit?.()
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [mode, onExit])

    // Command-mode input handler
    const onCmdKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            e.stopPropagation()
            const cmd = cmdInput.trim()
            if (cmd === 'q' || cmd === 'q!' || cmd === 'wq' || cmd === 'x') {
                onExit?.()
                return
            }
            if (cmd === 'w') {
                setStatusMsg("E45: 'readonly' option is set (add ! to override)")
                setMode('normal')
                setCmdInput('')
                return
            }
            if (cmd === 'help' || cmd === 'h') {
                setStatusMsg('valid commands: :q :q! :wq :w :x :help — or press q/esc')
                setMode('normal')
                setCmdInput('')
                return
            }
            setStatusMsg(`E492: Not an editor command: ${cmd}`)
            setMode('normal')
            setCmdInput('')
        } else if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            setMode('normal')
            setCmdInput('')
            setStatusMsg('')
        }
    }

    // Number of ~ marker rows to render below content
    const tildeCount = Math.max(0, 24 - lines.length)
    const gutterWidth = String(lines.length).length + 1

    return (
        <section className='flex flex-col h-full font-mono text-xs'>
            {/* Buffer area */}
            <div className='flex-1 overflow-y-auto p-2 leading-tight'>
                {lines.map((line, i) => (
                    <div key={i} className='flex'>
                        <span
                            className='text-neon/40 text-right pr-3 select-none tabular-nums'
                            style={{ minWidth: `${gutterWidth + 2}ch` }}
                        >
                            {i + 1}
                        </span>
                        <span className='text-neon-glow whitespace-pre-wrap break-words flex-1'>
                            {line || '\u00a0'}
                        </span>
                    </div>
                ))}
                {Array.from({ length: tildeCount }).map((_, i) => (
                    <div key={`tilde-${i}`} className='flex'>
                        <span
                            className='text-neon/40 text-right pr-3 select-none'
                            style={{ minWidth: `${gutterWidth + 2}ch` }}
                        >
                            ~
                        </span>
                    </div>
                ))}
            </div>

            {/* Status bar */}
            <div className='border-t border-neon/30 bg-black/85 px-2 py-0.5 flex items-center justify-between text-neon-glow/90'>
                <span className='truncate'>
                    {statusMsg ? (
                        <span className='text-red-400/90'>{statusMsg}</span>
                    ) : (
                        <>
                            <span className='text-neon-bright'>"{filename}"</span>{' '}
                            <span className='text-neon/70'>{lines.length}L, {bytes}B</span>
                        </>
                    )}
                </span>
                <span className='text-neon-bright shrink-0 mx-2'>
                    {mode === 'command' ? '-- COMMAND --' : '-- NORMAL --'}
                </span>
                <span className='text-neon/70 shrink-0 tabular-nums'>1,1   All</span>
            </div>

            {/* Command line */}
            {mode === 'command' && (
                <div className='border-t border-neon/30 bg-black/90 px-2 py-1 flex items-center text-neon-glow'>
                    <span className='text-neon-bright mr-1'>:</span>
                    <input
                        ref={cmdRef}
                        value={cmdInput}
                        onChange={(e) => setCmdInput(e.target.value)}
                        onKeyDown={onCmdKeyDown}
                        spellCheck={false}
                        autoComplete='off'
                        className='flex-1 bg-transparent outline-none caret-neon-bright'
                    />
                </div>
            )}
            {/* Hint when in normal mode */}
            {mode === 'normal' && !statusMsg && (
                <div className='bg-black/90 px-2 py-1 text-neon/40 text-[10px]'>
                    type <span className='text-neon-bright'>:q</span> to quit · or press <span className='text-neon-bright'>q</span>/<span className='text-neon-bright'>esc</span>
                </div>
            )}
        </section>
    )
}

export default VimView
