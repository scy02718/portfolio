import React, { useEffect, useState } from 'react'

// Fake processes — mix of real-ish system entries and jokes
const SEED = [
    { pid: 1247, user: 'samuel', cmd: 'react.exe' },
    { pid: 1832, user: 'samuel', cmd: 'vite' },
    { pid: 99,   user: 'root',   cmd: 'kernel_task' },
    { pid: 2451, user: 'samuel', cmd: 'chrome' },
    { pid: 4421, user: 'samuel', cmd: 'vibes.daemon' },
    { pid: 1313, user: 'samuel', cmd: 'caffeine.service' },
    { pid: 6669, user: 'samuel', cmd: 'existential_crisis' },
    { pid: 7777, user: 'samuel', cmd: 'samuel.brain' },
    { pid: 5042, user: 'samuel', cmd: 'regret.log' },
    { pid: 8080, user: 'samuel', cmd: 'tabs.hoarder' },
    { pid: 4040, user: 'root',   cmd: 'launchd' },
    { pid: 9012, user: 'samuel', cmd: 'spotify' },
    { pid: 1199, user: 'samuel', cmd: 'git.confused' },
    { pid: 3030, user: 'samuel', cmd: 'node' },
    { pid: 7172, user: 'samuel', cmd: 'docker' },
    { pid: 5550, user: 'samuel', cmd: 'imposter.syndrome' },
]

const rand = (lo, hi) => lo + Math.random() * (hi - lo)
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))

const formatClock = (date) => {
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const TopView = () => {
    const [procs, setProcs] = useState(() =>
        SEED.map((p) => ({
            ...p,
            cpu: rand(0.1, 60),
            mem: rand(0.5, 28),
        })).sort((a, b) => b.cpu - a.cpu),
    )
    const [now, setNow] = useState(() => new Date())
    const [load, setLoad] = useState(() => [rand(0.2, 1.5), rand(0.2, 1.5), rand(0.2, 1.5)])
    const [uptime] = useState(() => ({
        days: Math.floor(rand(1, 14)),
        hours: Math.floor(rand(0, 23)),
        mins: Math.floor(rand(0, 59)),
    }))

    useEffect(() => {
        const id = setInterval(() => {
            setNow(new Date())
            setProcs((prev) =>
                prev
                    .map((p) => ({
                        ...p,
                        cpu: clamp(p.cpu + (Math.random() - 0.5) * 10, 0.1, 99.9),
                        mem: clamp(p.mem + (Math.random() - 0.5) * 3, 0.1, 99.9),
                    }))
                    .sort((a, b) => b.cpu - a.cpu),
            )
            setLoad((prev) => prev.map((l) => clamp(l + (Math.random() - 0.5) * 0.15, 0.05, 4)))
        }, 1500)
        return () => clearInterval(id)
    }, [])

    const totalCpu = procs.reduce((s, p) => s + p.cpu, 0)
    const idleCpu = clamp(100 - totalCpu / 4, 0, 100)
    const usCpu = clamp(totalCpu / 6, 0, 100)
    const syCpu = clamp(totalCpu / 12, 0, 100)

    return (
        <section className='c-space my-2 font-mono text-xs leading-tight'>
            {/* Header */}
            <div className='space-y-0.5 text-neon-glow/90'>
                <p>
                    <span className='text-neon-bright'>top - {formatClock(now)}</span>
                    {' '}up {uptime.days} days, {String(uptime.hours).padStart(2, ' ')}:{String(uptime.mins).padStart(2, '0')},
                    {' '}1 user, load average:{' '}
                    <span className='text-neon-bright'>{load.map((l) => l.toFixed(2)).join(', ')}</span>
                </p>
                <p>
                    Tasks:{' '}
                    <span className='text-neon-bright'>{procs.length}</span> total,{' '}
                    <span className='text-neon-bright'>{Math.max(1, Math.floor(procs.length / 5))}</span> running,{' '}
                    <span className='text-neon-bright'>{procs.length - Math.max(1, Math.floor(procs.length / 5))}</span> sleeping
                </p>
                <p>
                    %Cpu(s):{' '}
                    <span className='text-neon-bright'>{usCpu.toFixed(1)}</span> us,{' '}
                    <span className='text-neon-bright'>{syCpu.toFixed(1)}</span> sy,{' '}
                    <span className='text-neon-bright'>{idleCpu.toFixed(1)}</span> id
                </p>
            </div>

            {/* Spacer */}
            <div className='h-3' />

            {/* Process table */}
            <div className='border-t border-b border-neon/20 py-1 mb-1'>
                <div className='grid grid-cols-[5ch_9ch_7ch_7ch_1fr] gap-2 text-neon-bright font-semibold'>
                    <span className='text-right'>PID</span>
                    <span>USER</span>
                    <span className='text-right'>%CPU</span>
                    <span className='text-right'>%MEM</span>
                    <span>COMMAND</span>
                </div>
            </div>
            <div className='space-y-0.5'>
                {procs.map((p, i) => (
                    <div
                        key={p.pid}
                        className={`grid grid-cols-[5ch_9ch_7ch_7ch_1fr] gap-2 ${i === 0 ? 'text-neon-bright' : 'text-neon-glow/80'} tabular-nums`}
                    >
                        <span className='text-right'>{p.pid}</span>
                        <span className='text-neon-faint/80'>{p.user}</span>
                        <span className='text-right'>{p.cpu.toFixed(1)}</span>
                        <span className='text-right'>{p.mem.toFixed(1)}</span>
                        <span className='truncate'>{p.cmd}</span>
                    </div>
                ))}
            </div>

            {/* Exit hint */}
            <div className='mt-4 text-neon/60'>
                press <span className='text-neon-bright'>q</span> or{' '}
                <span className='text-neon-bright'>esc</span> to exit
            </div>
        </section>
    )
}

export default TopView
