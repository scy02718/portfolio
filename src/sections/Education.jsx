import React from 'react'
import { educations } from '../constants/index.js'
import Decoder from '../components/Decoder'

const Education = () => {
    const openTranscript = (transcript) => () => {
        if (transcript) window.open(transcript, '_blank', 'noreferrer')
    }

    return (
        <section id='education' className='c-space my-4'>
            <h3 className='head-text'>
                <Decoder text='Education' />
            </h3>

            <div className='mt-4 space-y-3 font-mono text-xs'>
                {educations.map(({ id, provider, degree, duration, gpa, transcript, skills, overview }) => (
                    <div key={id} className='border border-green-500/30 bg-black/60 rounded-md p-3 shadow-neon-sm hover:border-green-400/50 hover:shadow-neon transition-all'>
                        <div className='flex items-baseline gap-2 flex-wrap'>
                            <span className='text-green-500/60'>$</span>
                            <span className='text-neon-bright font-semibold'>{provider}</span>
                            <span className='text-green-500/40 ml-auto'>{duration}</span>
                        </div>
                        <p className='pl-4 mt-1 text-green-200/80'>{degree}</p>
                        <p className='pl-4 mt-1 text-green-200/70'>
                            <span className='text-green-500/60'>↳ </span>{gpa}
                        </p>
                        <p className='pl-4 mt-2 text-green-200/70 leading-relaxed'>{overview}</p>
                        {skills?.length > 0 && (
                            <div className='pl-4 mt-2 flex flex-wrap gap-1.5'>
                                {skills.map((skill, i) => (
                                    <span key={i} className='px-1.5 py-0.5 border border-green-500/30 rounded text-green-200/80'>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                        {transcript && (
                            <div className='pl-4 mt-2'>
                                <button
                                    onClick={openTranscript(transcript)}
                                    className='text-neon-bright hover:underline'
                                >
                                    [view transcript]
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Education
