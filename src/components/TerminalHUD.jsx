import React, { useEffect, useState } from 'react'

export const sectionOrder = [
    { id: 'home', label: '~' },
    { id: 'about', label: '~/about' },
    { id: 'education', label: '~/education' },
    { id: 'experience', label: '~/experience' },
    { id: 'certificates', label: '~/certificates' },
    { id: 'awards', label: '~/awards' },
    { id: 'skills', label: '~/skills' },
    { id: 'contact', label: '~/contact' },
]

const TerminalHUD = ({ lastCommand }) => {
    const [activeId, setActiveId] = useState('home')

    useEffect(() => {
        const observers = []
        sectionOrder.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (!el) return
            const obs = new IntersectionObserver(
                (entries) => {
                    entries.forEach((e) => {
                        if (e.isIntersecting) setActiveId(id)
                    })
                },
                { rootMargin: '-40% 0px -55% 0px' }
            )
            obs.observe(el)
            observers.push(obs)
        })
        return () => observers.forEach((o) => o.disconnect())
    }, [])

    const active = sectionOrder.find((s) => s.id === activeId) || sectionOrder[0]

    return (
        <div className='fixed bottom-0 left-0 right-0 z-[80] pointer-events-none'>
            <div className='mx-auto max-w-7xl px-4 pb-3 flex items-end justify-between gap-3 font-mono text-xs'>
                <div className='pointer-events-auto bg-black/85 backdrop-blur-sm border border-green-500/30 rounded-md px-3 py-1.5 shadow-neon-sm flex items-center gap-1 min-w-0'>
                    <span className='text-green-500/70'>samuel@portfolio:</span>
                    <span className='text-neon-bright truncate'>{active.label}</span>
                    <span className='text-green-500/70'>$</span>
                    {lastCommand && (
                        <span className='ml-2 text-green-200/90 truncate'>{lastCommand}</span>
                    )}
                    <span className='inline-block w-1.5 h-3 bg-neon-bright ml-1 animate-pulse' />
                </div>
                <div className='hidden md:flex pointer-events-auto bg-black/85 backdrop-blur-sm border border-green-500/30 rounded-md px-3 py-1.5 shadow-neon-sm gap-3 text-green-300/70'>
                    <span><span className='text-neon-bright'>J</span>/<span className='text-neon-bright'>K</span> nav</span>
                    <span className='text-green-500/30'>·</span>
                    <span><span className='text-neon-bright'>1</span>–<span className='text-neon-bright'>8</span> jump</span>
                    <span className='text-green-500/30'>·</span>
                    <span><span className='text-neon-bright'>⌘K</span> cmd</span>
                    <span className='text-green-500/30'>·</span>
                    <span><span className='text-neon-bright'>g</span>/<span className='text-neon-bright'>G</span> top/bot</span>
                </div>
            </div>
        </div>
    )
}

export default TerminalHUD
