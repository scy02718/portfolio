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
                    {educations.map(({id, provider, degree, duration, logo, gpa, transcript }) => (
                        <div key={id} className='education-content_container'>
                            <div className='flex gap-10 justify-start items-center'>
                                <div className='flex flex-col h-full justify-start items-center py-2'>
                                    <div className='education-content_logo'>
                                        <img src={logo} alt="logo" className='w-full h-full' />
                                    </div>
                                </div>
                                <div>
                                    <p className='education-text_provider'>{provider}</p>
                                    <p className='education-text_major'>{degree} -- {duration}</p>
                                    <p className='mt-2 text-3xl font-bold group-hover:text-white transition ease-in-out duration-500'>GPA : {gpa}</p>
                                </div>
                            </div>

                            <button className='w-full mt-10 bg-black-300 rounded-lg p-3 font-bold flex items-center justify-center transition-all ease-in-out duration-500 cursor-pointer hover:bg-black-500 '
                                onClick={openTranscript(transcript)}>
                                View Transcript
                                <img src="/assets/right-arrow.png" alt="arrow" className='w-3 h-3 ml-2' />
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Education