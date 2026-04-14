import React, { useState } from 'react'
import { mySkills, myStrengths } from '../constants/index.js'
import Decoder from '../components/Decoder'

const Skills = () => {
    const [filterBy, setFilterBy] = useState('alphabetical')

    const toggleFilter = () => {
        setFilterBy(filterBy === 'alphabetical' ? 'proficiency' : 'alphabetical')
    }

    const sorted = [...mySkills].sort(
        filterBy === 'alphabetical'
            ? (a, b) => a.name.localeCompare(b.name)
            : (a, b) => b.proficiency - a.proficiency,
    )

    return (
        <section id='skills' className='c-space my-4'>
            <div className='flex justify-between items-center'>
                <h3 className='head-text'>
                    <Decoder text='Skills' />
                </h3>
                <button
                    onClick={toggleFilter}
                    className='px-2 py-1 text-xs font-mono border border-neon/30 rounded text-neon-bright hover:border-neon-bright hover:bg-neon/10 transition-all'
                >
                    sort: {filterBy}
                </button>
            </div>

            <div className='mt-4 space-y-3 font-mono text-xs'>
                <p className='text-neon/60'>$ ls ./strengths</p>
                <ul className='pl-3 space-y-1'>
                    {myStrengths.map(({ name, desc }, i) => (
                        <li key={i} className='text-neon-glow/80'>
                            <span className='text-neon-bright'>{String(i + 1).padStart(2, '0')} </span>
                            <span className='font-semibold text-neon-bright'>{name}</span>
                            <span className='text-neon/50'> — </span>
                            <span className='text-neon-glow/70'>{desc}</span>
                        </li>
                    ))}
                </ul>

                <p className='text-neon/60 mt-4'>$ cat skills.json</p>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-1.5 pl-3'>
                    {sorted.map(({ name, type }, i) => (
                        <div
                            key={i}
                            className='border border-neon/30 bg-black/60 rounded px-2 py-1 hover:border-neon-bright hover:bg-neon/5 transition-all'
                        >
                            <p className='text-neon-bright font-semibold'>{name}</p>
                            <p className='text-neon/60 text-[10px]'>{type}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Skills
