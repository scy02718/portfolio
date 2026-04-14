import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const commands = [
    { id: 'home', label: 'Go to Home', hint: 'cd ~', kind: 'nav', target: '#home' },
    { id: 'about', label: 'Go to About', hint: 'cd about', kind: 'nav', target: '#about' },
    { id: 'education', label: 'Go to Education', hint: 'cd education', kind: 'nav', target: '#education' },
    { id: 'experience', label: 'Go to Experience', hint: 'cd experience', kind: 'nav', target: '#experience' },
    { id: 'certificates', label: 'Go to Certificates', hint: 'cd certs', kind: 'nav', target: '#certificates' },
    { id: 'awards', label: 'Go to Awards', hint: 'cd awards', kind: 'nav', target: '#awards' },
    { id: 'skills', label: 'Go to Skills', hint: 'cd skills', kind: 'nav', target: '#skills' },
    { id: 'contact', label: 'Go to Contact', hint: 'cd contact', kind: 'nav', target: '#contact' },
    { id: 'github', label: 'Open GitHub', hint: 'open github', kind: 'link', target: 'https://github.com/scy02718' },
    { id: 'linkedin', label: 'Open LinkedIn', hint: 'open linkedin', kind: 'link', target: 'https://linkedin.com/in/chanyoo/' },
    { id: 'instagram', label: 'Open Instagram', hint: 'open instagram', kind: 'link', target: 'https://www.instagram.com/samuel.yoo_/' },
    { id: 'email', label: 'Send Email', hint: 'mail samuel', kind: 'mail', target: 'chanyoo02718@gmail.com' },
    { id: 'top', label: 'Scroll to Top', hint: 'top', kind: 'scroll', target: 'top' },
    { id: 'bottom', label: 'Scroll to Bottom', hint: 'bottom', kind: 'scroll', target: 'bottom' },
]

const fuzzyMatch = (query, text) => {
    if (!query) return true
    const q = query.toLowerCase()
    const t = text.toLowerCase()
    let i = 0
    for (const ch of t) {
        if (ch === q[i]) i++
        if (i === q.length) return true
    }
    return false
}

const CommandPalette = ({ open, onClose }) => {
    const [query, setQuery] = useState('')
    const [active, setActive] = useState(0)
    const inputRef = useRef(null)
    const listRef = useRef(null)

    const filtered = useMemo(() => {
        const q = query.trim()
        if (!q) return commands
        return commands.filter(c => fuzzyMatch(q, c.label) || fuzzyMatch(q, c.hint) || fuzzyMatch(q, c.id))
    }, [query])

    useEffect(() => { setActive(0) }, [query])

    useEffect(() => {
        if (open) {
            setQuery('')
            setActive(0)
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [open])

    useEffect(() => {
        const el = listRef.current?.querySelector('[data-active="true"]')
        el?.scrollIntoView({ block: 'nearest' })
    }, [active])

    const execute = (cmd) => {
        if (!cmd) return
        if (cmd.kind === 'nav') {
            document.querySelector(cmd.target)?.scrollIntoView({ behavior: 'smooth' })
        } else if (cmd.kind === 'link') {
            window.open(cmd.target, '_blank', 'noreferrer')
        } else if (cmd.kind === 'mail') {
            window.location.href = `mailto:${cmd.target}`
        } else if (cmd.kind === 'scroll') {
            window.scrollTo({ top: cmd.target === 'top' ? 0 : document.body.scrollHeight, behavior: 'smooth' })
        }
        onClose()
    }

    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive(a => Math.min(a + 1, filtered.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive(a => Math.max(a - 1, 0))
        } else if (e.key === 'Enter') {
            e.preventDefault()
            execute(filtered[active])
        } else if (e.key === 'Escape') {
            e.preventDefault()
            onClose()
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className='fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/70 backdrop-blur-sm'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className='w-full max-w-xl rounded-lg border border-green-500/40 bg-black/95 shadow-[0_0_40px_rgba(34,197,94,0.25)] font-mono text-green-300 overflow-hidden'
                        initial={{ y: -20, opacity: 0, scale: 0.98 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -20, opacity: 0, scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex items-center gap-2 px-3 py-2 border-b border-green-500/20 text-xs text-green-500/70'>
                            <span className='w-2.5 h-2.5 rounded-full bg-red-500/70' />
                            <span className='w-2.5 h-2.5 rounded-full bg-yellow-500/70' />
                            <span className='w-2.5 h-2.5 rounded-full bg-green-500/70' />
                            <span className='ml-2'>samuel@portfolio: ~</span>
                        </div>
                        <div className='flex items-center px-4 py-3 border-b border-green-500/20'>
                            <span className='text-green-400 mr-2'>{'>'}</span>
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder='type a command...'
                                className='flex-1 bg-transparent outline-none placeholder:text-green-500/40 text-green-200 caret-green-400'
                            />
                        </div>
                        <ul ref={listRef} className='max-h-72 overflow-y-auto py-1'>
                            {filtered.length === 0 && (
                                <li className='px-4 py-3 text-green-500/50 text-sm'>command not found</li>
                            )}
                            {filtered.map((cmd, i) => {
                                const isActive = i === active
                                return (
                                    <li
                                        key={cmd.id}
                                        data-active={isActive}
                                        onMouseEnter={() => setActive(i)}
                                        onClick={() => execute(cmd)}
                                        className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm ${isActive ? 'bg-green-500/10 text-green-100' : 'text-green-300/80'}`}
                                    >
                                        <span className='flex items-center gap-2'>
                                            <span className={isActive ? 'text-green-400' : 'text-green-500/50'}>{isActive ? '▶' : '·'}</span>
                                            {cmd.label}
                                        </span>
                                        <span className='text-xs text-green-500/50'>{cmd.hint}</span>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className='flex items-center justify-between px-4 py-2 border-t border-green-500/20 text-[10px] text-green-500/50'>
                            <span>↑↓ navigate · ↵ run · esc close</span>
                            <span>⌘K</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default CommandPalette
