import React from 'react'

const TerminalWindow = ({ title, app = 'bash', children }) => {
    return (
        <div className='relative my-3 mx-2 sm:mx-4 rounded-lg border border-green-500/30 bg-black/40 backdrop-blur-sm shadow-neon-sm overflow-hidden'>
            <div className='flex items-center gap-2 px-3 py-2 border-b border-green-500/20 bg-black/60 text-xs font-mono'>
                <span className='w-2.5 h-2.5 rounded-full bg-red-500/70' />
                <span className='w-2.5 h-2.5 rounded-full bg-yellow-500/70' />
                <span className='w-2.5 h-2.5 rounded-full bg-green-500/70' />
                <span className='ml-3 text-green-300/80 truncate'>
                    samuel@portfolio: <span className='text-neon-bright'>{title}</span>
                </span>
                <span className='ml-auto text-green-500/40 hidden sm:inline'>— {app}</span>
            </div>
            <div className='relative'>
                {children}
            </div>
        </div>
    )
}

export default TerminalWindow
