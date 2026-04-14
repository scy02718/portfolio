import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const lines = [
    { text: 'samuel@portfolio:~$ ./boot.sh', delay: 0 },
    { text: '[  OK  ] mounting /dev/portfolio ...', delay: 220 },
    { text: '[  OK  ] loading neural pathways ............... done', delay: 420 },
    { text: '[  OK  ] establishing secure shell on :443 ...', delay: 620 },
    { text: '[  OK  ] decrypting samuel.profile ........ 100%', delay: 820 },
    { text: '[  OK  ] starting react@18 + three.js runtime', delay: 1020 },
    { text: '[  OK  ] welcome, visitor.', delay: 1240 },
    { text: '', delay: 1380 },
    { text: 'tip: press [⌘K] for command palette · [J/K] to navigate', delay: 1440 },
]

const TOTAL_MS = 2600

const BootSequence = () => {
    const [visible, setVisible] = useState(() => {
        if (typeof window === 'undefined') return false
        return !sessionStorage.getItem('booted')
    })
    const [shown, setShown] = useState(0)

    useEffect(() => {
        if (!visible) return
        const timers = lines.map((line, i) =>
            setTimeout(() => setShown(i + 1), line.delay)
        )
        const dismiss = () => {
            sessionStorage.setItem('booted', '1')
            setVisible(false)
        }
        const dismissTimer = setTimeout(dismiss, TOTAL_MS)
        const onKey = () => dismiss()
        window.addEventListener('keydown', onKey)
        return () => {
            timers.forEach(clearTimeout)
            clearTimeout(dismissTimer)
            window.removeEventListener('keydown', onKey)
        }
    }, [visible])

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className='fixed inset-0 z-[200] bg-black flex items-start justify-start p-8 sm:p-14 font-mono text-green-300'
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className='max-w-2xl w-full text-sm sm:text-base leading-relaxed'>
                        {lines.slice(0, shown).map((line, i) => {
                            const isLast = i === shown - 1
                            const isOk = line.text.startsWith('[  OK  ]')
                            return (
                                <div key={i} className='whitespace-pre'>
                                    {isOk ? (
                                        <>
                                            <span className='text-neon-bright'>[  OK  ]</span>
                                            <span className='text-green-200/80'>{line.text.slice(8)}</span>
                                        </>
                                    ) : (
                                        <span className={isLast ? 'text-neon-bright' : 'text-green-300'}>{line.text || '\u00a0'}</span>
                                    )}
                                    {isLast && <span className='inline-block w-2 h-4 bg-neon-bright ml-1 animate-pulse align-middle' />}
                                </div>
                            )
                        })}
                        <div className='mt-6 text-green-500/40 text-xs'>press any key to skip</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default BootSequence
