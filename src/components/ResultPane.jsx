import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import HomeView from '../views/HomeView'
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
}

const ResultPane = ({ view }) => {
    const ViewComponent = VIEW_MAP[view] || HomeView

    return (
        <div className='flex flex-col h-full bg-black/70 overflow-hidden'>
            <div className='flex items-center gap-2 px-3 py-2 border-b border-green-500/20 bg-black/60 shrink-0 font-mono text-xs'>
                <span className='w-2.5 h-2.5 rounded-full bg-red-500/70' />
                <span className='w-2.5 h-2.5 rounded-full bg-yellow-500/70' />
                <span className='w-2.5 h-2.5 rounded-full bg-green-500/70' />
                <span className='ml-3 text-green-300/80'>
                    samuel@portfolio: <span className='text-neon-bright'>~/{view}</span>
                </span>
                <span className='ml-auto text-green-500/40 hidden sm:inline'>— viewer</span>
            </div>

            <div className='flex-1 overflow-y-auto'>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className='min-h-full'
                    >
                        <ViewComponent />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ResultPane
