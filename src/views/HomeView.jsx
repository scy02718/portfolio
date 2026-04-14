import React from 'react'
import Decoder from '../components/Decoder'

const banner = ` ____                              _
/ ___|  __ _ _ __ ___  _   _  ___| |
\\___ \\ / _\` | '_ \` _ \\| | | |/ _ \\ |
 ___) | (_| | | | | | | |_| |  __/ |
|____/ \\__,_|_| |_| |_|\\__,_|\\___|_|
`

const HomeView = () => {
    return (
        <section className='c-space my-4 font-mono'>
            <pre className='text-neon-bright text-[10px] sm:text-xs leading-tight whitespace-pre overflow-x-auto'>{banner}</pre>

            <div className='mt-4 space-y-1 text-neon-glow/90 text-sm'>
                <p>
                    <span className='text-neon/60'>$</span> <Decoder text='whoami' className='text-neon-bright' />
                </p>
                <p className='pl-3'>samuel yoo — software development engineer @ aws</p>
                <p className='pl-3'>bse(hons) software engineering, university of auckland</p>
                <p className='pl-3'>auckland, new zealand</p>
            </div>

            <div className='mt-5 space-y-1 text-neon-glow/90 text-sm'>
                <p>
                    <span className='text-neon/60'>$</span> <Decoder text='cat README.md' className='text-neon-bright' speed={22} />
                </p>
                <p className='pl-3 text-neon-glow/70 leading-relaxed'>
                    welcome to my portfolio. this site is a terminal — type{' '}
                    <span className='text-neon-bright'>help</span> in the prompt on the left to see what you can do.
                </p>
                <p className='pl-3 text-neon-glow/70 leading-relaxed'>
                    try{' '}
                    <span className='text-neon-bright'>ls</span>,{' '}
                    <span className='text-neon-bright'>cd about</span>,{' '}
                    <span className='text-neon-bright'>cd experience</span>, or{' '}
                    <span className='text-neon-bright'>open github</span>.
                </p>
            </div>

            <div className='mt-5 space-y-1 text-neon-glow/90 text-sm'>
                <p>
                    <span className='text-neon/60'>$</span> <Decoder text='ls ./social' className='text-neon-bright' />
                </p>
                <ul className='pl-3 space-y-0.5 text-neon-glow/70'>
                    <li>
                        <a href='https://github.com/scy02718' target='_blank' rel='noreferrer' className='hover:text-neon-bright transition-colors'>
                            github.com/scy02718
                        </a>
                    </li>
                    <li>
                        <a href='https://linkedin.com/in/chanyoo/' target='_blank' rel='noreferrer' className='hover:text-neon-bright transition-colors'>
                            linkedin.com/in/chanyoo
                        </a>
                    </li>
                    <li>
                        <a href='https://www.instagram.com/samuel.yoo_/' target='_blank' rel='noreferrer' className='hover:text-neon-bright transition-colors'>
                            instagram.com/samuel.yoo_
                        </a>
                    </li>
                    <li>
                        <a href='mailto:scy02718@gmail.com' className='hover:text-neon-bright transition-colors'>
                            scy02718@gmail.com
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    )
}

export default HomeView
