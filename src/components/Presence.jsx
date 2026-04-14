import React, { useEffect, useState } from 'react'

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))

const Presence = () => {
    const [userCount, setUserCount] = useState(() => Math.floor(Math.random() * 3) + 1)
    const [typing, setTyping] = useState(false)

    useEffect(() => {
        let mounted = true

        // Occasionally drift the user count between 1 and 5
        const userInterval = setInterval(() => {
            if (!mounted) return
            if (Math.random() < 0.3) {
                setUserCount((prev) => clamp(prev + (Math.random() < 0.5 ? -1 : 1), 1, 5))
            }
        }, 15000)

        // Occasionally show a "typing" indicator for 2-5 seconds
        const typingInterval = setInterval(() => {
            if (!mounted) return
            if (Math.random() < 0.25) {
                setTyping(true)
                setTimeout(() => {
                    if (mounted) setTyping(false)
                }, 2500 + Math.random() * 2500)
            }
        }, 12000)

        return () => {
            mounted = false
            clearInterval(userInterval)
            clearInterval(typingInterval)
        }
    }, [])

    return (
        <div className='shrink-0 border-t border-neon/20 bg-black/85 px-3 py-1 font-mono text-[10px] text-neon/60 flex items-center justify-between'>
            <span className='flex items-center gap-1.5'>
                <span className='inline-block w-1.5 h-1.5 rounded-full bg-neon-bright animate-pulse' />
                {userCount} {userCount === 1 ? 'user' : 'users'} connected
            </span>
            {typing && (
                <span className='text-neon-faint/70'>
                    samuel is typing<span className='animate-pulse'>...</span>
                </span>
            )}
        </div>
    )
}

export default Presence
