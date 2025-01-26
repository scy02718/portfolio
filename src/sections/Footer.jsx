import React from 'react'

const Footer = () => {
    return (
        <section className='c-space pt-7 pb-3 border-t border-black-300 flex justify-between items-center flex-wrap gap-5'>
            <div className='text-white-500 flex gap-2'>
                <p>Terms & Conditions</p>
                <p>|</p>
                <p>Privacy Policy</p>
            </div>

            <div className='flex gap-3'>
                <div className='social-icon'>
                    <a href="https://github.com/scy02718" target='_blank' rel='noreferrer' className='cursor-pointer flex justify-center items-center'>
                        <img src="/assets/github.svg" alt="github" className='w-1/2 h-1/2'/>
                    </a>
                </div>
                <div className='social-icon'>
                    <a href="linkedin.com/in/chanyoo/" target='_blank' rel='noreferrer' className='cursor-pointer flex justify-center items-center'>
                        <img src="/assets/linkedin.svg" alt="linkedin" className='w-1/2 h-1/2'/>
                    </a>
                </div>
                <div className='social-icon'>
                    <a href="https://www.instagram.com/samuel.yoo_/" target='_blank' rel='noreferrer' className='cursor-pointer flex justify-center items-center'>
                        <img src="/assets/instagram.svg" alt="instagram" className='w-1/2 h-1/2'/>
                    </a>
                </div>
            </div>

            <p className='text-white-500'>
                © 2025 Samuel Yoo. All rights reserved.
            </p>
        </section>
    )
}

export default Footer