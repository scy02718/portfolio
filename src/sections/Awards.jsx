import React, { useState } from 'react'
import { myAwards } from '../constants/index.js'
import Decoder from '../components/Decoder'

const Awards = () => {
    const [idx, setIdx] = useState(0)
    const total = myAwards.length
    const award = myAwards[idx]

    const next = () => setIdx((i) => (i + 1) % total)
    const prev = () => setIdx((i) => (i - 1 + total) % total)

    return (
        <section id='awards' className='c-space my-4'>
            <h3 className='head-text'>
                <Decoder text='Awards' />
            </h3>

            <div className='mt-4 font-mono text-xs'>
                <div className='flex items-center justify-between mb-2 text-green-300/70'>
                    <button onClick={prev} className='px-2 py-0.5 border border-green-500/30 rounded hover:border-neon-bright hover:text-neon-bright transition-colors'>
                        ← prev
                    </button>
                    <span className='text-green-500/60'>
                        [{idx + 1}/{total}]
                    </span>
                    <button onClick={next} className='px-2 py-0.5 border border-green-500/30 rounded hover:border-neon-bright hover:text-neon-bright transition-colors'>
                        next →
                    </button>
                </div>

                <div className='border border-green-500/30 bg-black/60 rounded-md p-3 shadow-neon-sm'>
                    <div className='flex items-baseline gap-2 flex-wrap'>
                        <span className='text-green-500/60'>$</span>
                        <span className='text-green-200/80'>{award.provider}</span>
                        <span className='text-green-500/40 ml-auto'>{award.year}</span>
                    </div>
                    <p className='pl-4 mt-1 text-neon-bright font-semibold'>{award.title}</p>
                    <p className='pl-4 mt-2 text-green-200/70 leading-relaxed'>{award.desc}</p>
                    <p className='pl-4 mt-2 text-green-200/80'>
                        received: <span className='text-neon-bright'>{award.reward}</span>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Awards
