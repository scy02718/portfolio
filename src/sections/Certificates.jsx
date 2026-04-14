import React from 'react'
import { myCertificates } from '../constants/index.js'
import Decoder from '../components/Decoder'

const Certificates = () => {
    const open = (url) => () => url && window.open(url, '_blank', 'noreferrer')

    return (
        <section id='certificates' className='c-space my-4'>
            <div className='flex items-baseline justify-between'>
                <h3 className='head-text'>
                    <Decoder text='Certificates' />
                </h3>
                <span className='font-mono text-xs text-neon/60'>
                    {myCertificates.length} found
                </span>
            </div>

            <div className='mt-4 space-y-3 font-mono text-xs'>
                {myCertificates.map((cert, i) => (
                    <div
                        key={i}
                        className='border border-neon/30 bg-black/60 rounded-md p-3 shadow-neon-sm hover:border-neon-bright/50 hover:shadow-neon transition-all'
                    >
                        <div className='flex items-baseline gap-2 flex-wrap'>
                            <span className='text-neon/60'>$</span>
                            <span className='text-neon-glow/80'>{cert.provider}</span>
                            <span className='text-neon/40 ml-auto'>{cert.date}</span>
                        </div>
                        <p className='pl-4 mt-1 text-neon-bright font-semibold'>{cert.name}</p>

                        {cert.score && (
                            <div className='pl-4 mt-2'>
                                <p className='text-neon-glow/70'>
                                    score: <span className='text-neon-bright'>{(cert.score * 100).toFixed(1)}%</span>
                                </p>
                                <div className='mt-1 w-full h-1 bg-neon/10 rounded'>
                                    <div
                                        className='h-1 bg-neon-bright rounded shadow-neon-sm'
                                        style={{ width: `${(cert.score * 100).toFixed(1)}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <p className='pl-4 mt-2 text-neon-glow/70 leading-relaxed'>{cert.desc}</p>

                        <div className='pl-4 mt-3 flex gap-2'>
                            <button
                                onClick={open(cert.link)}
                                className='px-2 py-0.5 border border-neon/30 rounded text-neon-bright hover:border-neon-bright hover:bg-neon/10 transition-all'
                            >
                                [view]
                            </button>
                            {cert.cert && (
                                <button
                                    onClick={open(cert.cert)}
                                    className='px-2 py-0.5 border border-neon/30 rounded text-neon-bright hover:border-neon-bright hover:bg-neon/10 transition-all'
                                >
                                    [download]
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Certificates
