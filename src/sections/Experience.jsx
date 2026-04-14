import React from 'react'
import { workExperiences } from '../constants/index.js'
import Decoder from '../components/Decoder'

const Experience = () => {
    return (
        <section id='experience' className='c-space my-4'>
            <h3 className='head-text'>
                <Decoder text='Work Experience' />
            </h3>

            <div className='mt-4 space-y-3 font-mono text-xs'>
                {workExperiences.map(({ id, name, pos, duration, title }) => (
                    <div key={id} className='border border-green-500/30 bg-black/60 rounded-md p-3 shadow-neon-sm hover:border-green-400/50 hover:shadow-neon transition-all'>
                        <div className='flex items-baseline gap-2 flex-wrap'>
                            <span className='text-green-500/60'>$</span>
                            <span className='text-neon-bright font-semibold'>{name}</span>
                            <span className='text-green-500/40'>—</span>
                            <span className='text-green-200/80'>{pos}</span>
                            <span className='text-green-500/40 ml-auto'>{duration}</span>
                        </div>
                        <p className='mt-2 text-green-200/70 leading-relaxed pl-4'>{title}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Experience
