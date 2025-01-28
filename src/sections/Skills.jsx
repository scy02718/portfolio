import React, { useState } from 'react'
import { mySkills, myStrengths } from '../constants/index.js'

const Skills = () => {
  const [filterBy, setFilterBy] = useState('alphabetical');

  const toggleFilter = () => {
    setFilterBy(filterBy === 'alphabetical' ? 'proficiency' : 'alphabetical');
  };

  return (
    <section id='skills' className='c-space my-20'>
        <div className='w-full text-white-600'>
          <div className='flex justify-between'>
            <h3 className='head-text'>My Skills</h3>
            <button onClick={toggleFilter} className='bg-black-300 rounded-lg p-3 font-bold flex items-center justify-center transition-all ease-in-out duration-500 cursor-pointer hover:bg-black-500'>
              {filterBy === 'alphabetical' ? 'Sort by Proficiency' : 'Sort Alphabetically'}
            </button>
          </div>
          <div className='mt=10'>
            <div className='sm:py-10 py-5 sm:px-5 px-2.5'>
                {myStrengths.sort(
                    {alphabetical: (a, b) => a.name.localeCompare(b.name), proficiency: (a, b) => b.proficiency - a.proficiency}[filterBy]
                ).map(({name, desc}, index) => (
                    <div key={index} className='work-content_container group'>
                        <div className='flex flex-col h-full items-center py-2'>
                            <div className='work-content_logo flex align-center justify-center items-center'>
                                <p className='font-bold text-xl'>{index + 1}</p>
                            </div>
                            <div className='flex-1 w-0.5 mt-4 h-full bg-white group-hover:bg-black-500 group-last:hidden'/>
                        </div>
                        <div className='sm:p-5 px-2.5 py-5'>
                            <p className='font-bold text-white-800'>{name}</p>
                            <p className='text-sm-mb-5'>{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
          <div className='grid xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-5 h-full mt-5'>
                {mySkills.sort(
                    {alphabetical: (a, b) => a.name.localeCompare(b.name), proficiency: (a, b) => b.proficiency - a.proficiency}[filterBy]
                ).map(({name, type, proficiency}, index) => (
                    <div className='bg-black-300 rounded-lg p-5 hover:bg-black-500 transition-all ease-in-out duration-100'>
                      <div className='flex justify-between overflow-auto'>
                          <p className='text-xl font-bold'>{name}</p>
                          <p className='text-lg'>{proficiency}⭐</p>
                      </div>
                      <div className='flex justify-between'>
                          <p className='text-sm'>{type}</p>
                      </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default Skills