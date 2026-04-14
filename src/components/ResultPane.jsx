import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { subscribe } from '../lib/eventBus'
import HomeView from '../views/HomeView'
import TopView from '../views/TopView'
import VimView from '../views/VimView'
import About from '../sections/About'
import Education from '../sections/Education'
import Experience from '../sections/Experience'
import Certificates from '../sections/Certificates'
import Awards from '../sections/Awards'
import Skills from '../sections/Skills'
import Contact from '../sections/Contact'

const VIEW_MAP = {
    home: HomeView,
    about: About,
    education: Education,
    experience: Experience,
    certificates: Certificates,
    awards: Awards,
    skills: Skills,
    contact: Contact,
    top: TopView,
    vim: VimView,
}

const ResultPane = ({ view, arg, onExitTakeover }) => {
    const ViewComponent = VIEW_MAP[view] || HomeView
    // Distinct key for vim/arg so AnimatePresence retransitions when file changes
    const key = view === 'vim' ? `vim:${arg ?? ''}` : view
    const scrollRef = useRef(null)

    // Listen for terminal `scroll` commands
    useEffect(() => {
        return subscribe('pane:scroll', (direction) => {
            const el = scrollRef.current
            if (!el) return
            const step = el.clientHeight * 0.8
            if (direction === 'up')         el.scrollBy({ top: -step,         behavior: 'smooth' })
            else if (direction === 'down')  el.scrollBy({ top:  step,         behavior: 'smooth' })
            else if (direction === 'top')   el.scrollTo({ top: 0,             behavior: 'smooth' })
            else if (direction === 'bottom')el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
        })
    }, [])

    return (
        <div className='flex flex-col h-full bg-black/70 overflow-hidden'>
            <div className='flex items-center gap-2 px-3 py-2 border-b border-neon/20 bg-black/60 shrink-0 font-mono text-xs'>
                <span className='w-2.5 h-2.5 rounded-full bg-red-500/70' />
                <span className='w-2.5 h-2.5 rounded-full bg-yellow-500/70' />
                <span className='w-2.5 h-2.5 rounded-full bg-neon/70' />
                <span className='ml-3 text-neon-faint/80'>
                    samuel@portfolio: <span className='text-neon-bright'>~/{view}{view === 'vim' && arg ? `/${arg}.md` : ''}</span>
                </span>
                <span className='ml-auto text-neon/40 hidden sm:inline'>— viewer</span>
            </div>

            <div ref={scrollRef} className='flex-1 overflow-y-auto'>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className='min-h-full'
                    >
                        <ViewComponent arg={arg} onExit={onExitTakeover} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ResultPane
