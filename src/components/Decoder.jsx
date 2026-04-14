import React, { useEffect, useRef, useState } from 'react'

const CHARS = '!<>-_\\/[]{}—=+*^?#$%@&'

const Decoder = ({ text, speed = 28, className = '', as: As = 'span' }) => {
    const [output, setOutput] = useState('')
    const frameRef = useRef(0)
    const intervalRef = useRef(null)

    useEffect(() => {
        frameRef.current = 0
        if (intervalRef.current) clearInterval(intervalRef.current)
        const target = text || ''
        const len = target.length
        intervalRef.current = setInterval(() => {
            const settled = Math.floor(frameRef.current / 2)
            let out = target.slice(0, Math.min(settled, len))
            for (let i = settled; i < len; i++) {
                const ch = target[i]
                out += ch === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
            }
            setOutput(out)
            frameRef.current++
            if (settled >= len) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }, speed)
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [text, speed])

    return <As className={className}>{output}</As>
}

export default Decoder
