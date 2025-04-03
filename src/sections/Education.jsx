import React from 'react'
import { educations } from '../constants/index.js'

const Education = () => {

    const openTranscript = (transcript) => {
        return () => {
            window.open(transcript, '_blank', 'noreferrer')
        }
    }
    return (
        <section id='education' className='c-space my-20'>
            <div className='w-full text-white-600'>
                <h3 className='head-text'>My Education</h3>
                <div className='education-container'>
                    {educations.map(({id, provider, degree, duration, logo, gpa, transcript, skills, overview }) => (
                        <div key={id} className='education-content_container'>
                            <div className='flex justify-between lg:flex-row flex-col gap-10'>
                                <div className='flex gap-10 justify-start items-center'>
                                    <div className='flex flex-col h-full justify-start items-center py-2'>
                                        <div className='education-content_logo'>
                                            <img src={logo} alt="logo" className='w-full h-full rounded-lg' />
                                        </div>
                                    </div>
                                    <div>
                                        <p className='education-text_provider'>{provider}</p>
                                        <p className='education-text_major'>{degree} -- {duration}</p>
                                        <p className='mt-2 text-2xl group-hover:text-white transition ease-in-out duration-500'>{gpa}</p>
                                    </div>
                                </div>

                                <div className='flex lg:flex-col flex-row justify-start items-end gap-2'>
                                    {skills.map((skill, index) => (
                                        <div className='bg-black-300 border border-black-300 rounded-lg px-3 py-1'>
                                            <p key={index} className='text-xs'>
                                                {skill}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <p className='mt-5'>
                                {overview}
                            </p>

                            <hr className='border border-black-300 mt-10' />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Education