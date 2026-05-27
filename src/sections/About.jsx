import { useState } from 'react'
import Decoder from '../components/Decoder'

const About = () => {
    const [hasCopied, setHasCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText('scy02718@gmail.com')
        setHasCopied(true)
        setTimeout(() => setHasCopied(false), 3000)
    }

    return (
        <section className='c-space my-4' id='about'>
            <h3 className='head-text'><Decoder text='About' /></h3>
            <div className='grid md:grid-cols-3 grid-cols-1 gap-3 mt-4'>
                <div className='grid-container md:col-span-1'>
                    <p className='grid-headtext'>$ whoami</p>
                    <p className='grid-subtext'>Hi, I'm Samuel. Software Engineer on the Video Editing & Creations team at Google Photos, with a Software Engineering Degree from the University of Auckland.</p>
                </div>

                <div className='grid-container md:col-span-1'>
                    <a href='#skills' className='cursor-pointer'>
                        <p className='grid-headtext'>$ ls ./stack <span>&#8594;</span></p>
                    </a>
                    <p className='grid-subtext'>Full-stack web development, cloud architecture, machine learning. Polyglot across Python, Java, JS/TS.</p>
                </div>

                <div className='grid-container md:col-span-1'>
                    <p className='grid-headtext'>$ pwd</p>
                    <p className='grid-subtext'>/sydney/australia — currently based in Sydney, Australia.</p>
                </div>

                <div className='grid-container md:col-span-2'>
                    <p className='grid-headtext'>$ cat profile.md</p>
                    <p className='grid-subtext'>Software Engineer on the Video Editing & Creations team at Google Photos, Sydney. Graduate with First Class Honours in Software Engineering from the University of Auckland (GPA 8.55/9). Strong problem-solver, eager learner, building products that help people. Holds 5 AWS certifications and deep experience across cloud, ML, and full-stack development.</p>
                </div>

                <div className='grid-container md:col-span-1'>
                    <p className='grid-headtext'>$ contact</p>
                    <div className='copy-container' onClick={handleCopy}>
                        <p className='grid-subtext'>scy02718@gmail.com</p>
                        <span className='text-xs text-neon-bright'>{hasCopied ? '[copied]' : '[copy]'}</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
