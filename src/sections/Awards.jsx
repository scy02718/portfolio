import React from 'react'
import { myAwards } from '../constants/index.js'
import Decoder from '../components/Decoder'

const Awards = () => {
    return (
        <section id='awards' className='c-space my-4'>
            <div className='flex items-baseline justify-between'>
                <h3 className='head-text'>
                    <Decoder text='Awards' />
                </h3>
                <span className='font-mono text-xs text-neon/60'>
                    {myAwards.length} found
                </span>
            </div>

            <div className='mt-4 space-y-3 font-mono text-xs'>
                {myAwards.map((award, i) => (
                    <div
                        key={i}
                        className='border border-neon/30 bg-black/60 rounded-md p-3 shadow-neon-sm hover:border-neon-bright/50 hover:shadow-neon transition-all'
                    >
                        <div className='flex items-baseline gap-2 flex-wrap'>
                            <span className='text-neon/60'>$</span>
                            <span className='text-neon-glow/80'>{award.provider}</span>
                            <span className='text-neon/40 ml-auto'>{award.year}</span>
                        </div>
                        <p className='pl-4 mt-1 text-neon-bright font-semibold'>{award.title}</p>
                        <p className='pl-4 mt-2 text-neon-glow/70 leading-relaxed'>{award.desc}</p>
                        <p className='pl-4 mt-2 text-neon-glow/80'>
                            received: <span className='text-neon-bright'>{award.reward}</span>
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Awards
