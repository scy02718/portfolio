import Globe from 'react-globe.gl';
import Button from '../components/Button';
import { useState } from 'react';

const About = () => {
    // State that will store whether the email has been copied to the clipboard
    // This state will be reset after 3 seconds
    const [hasCopied, setHasCopied] = useState(false);

    const handleCopy = () =>{
        // Copy the text to the clipboard
        navigator.clipboard.writeText('scy02718@gmail.com');

        setHasCopied(true);

        // Reset the state after 3 seconds
        setTimeout(() => {
            setHasCopied(false);
        }, 3000);
    }
    return (
        // c-space is a custom class that adds padding to the top and bottom of the section, my-20 adds margin to the top and bottom
        // The id of about allows any link with href="#about" to scroll to this section
        <section className='c-space my-20' id="about">
            {/* The section has a grid layout */}
            {/* The grid has 3 columns for extra large screens, 2 columns for medium screens, and 1 column for small screens */}
            {/* The grid has 6 rows for extra large screens, 3 rows for medium screens, and 1 row for small screens */}
            {/* The gap between the columns is 5 */}
            {/* The height of the grid is full */}
            <div className='grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-col-1 gap-5 h-full'>
                {/* span refers to the number of columns / rows the element will take */}
                {/* col-span-2 = The element will take 2 columns */}
                {/* row-span-3 = The element will take 3 rows */}
                {/* This image will take 1 column, and 3 rolws on extra large screens */}
                <div className='col-span-1 xl:row-span-3'>
                    {/* Custom class to add padding and rounded corners */}
                    <div className='grid-container'>
                        {/* Image */}
                        {/*w-full means the width is full, sm:h-[276px] = Height is 276px on small screens, h-fit = Height is fit to the content, object-contain = The image will not be stretched */}
                        <img src="/assets/grid1.png" alt="grid-1" className='w-full sm:h-[276px] h-fit object-contain' />
                        <p className='grid-headtext'>Hi, I'm Samuel!</p>
                        <p className='grid-subtext'>I am a recent graduate from the University of Auckland, with a Bachelor of Engineering in Software Engineering.</p>
                    </div>
                </div>
                <div className='col-span-1 xl:row-span-3'>
                    <div className='grid-container'>
                        <img src="assets/grid2.png" alt="grid-2" className='w-full sm:h-[276px] h-fit object-contain' />
                        <p className='grid-headtext'>Tech Stack</p>
                        <p className='grid-subtext'>My Tech Stack spans from Full-stack Web Development, Cloud Architecture, to Machine Learning and Deep Learning.</p>
                    </div>
                </div>

                {/* This div will take 1 column and 4 rows on extra large screens */}
                <div className='col-span-1 xl:row-span-4'>
                    <div className='grid-container'>
                        {/* Rounded-3xl = Rounded corners, w-full = Full width, sm:h-[326px] = Height is 326px on small screens, h-fit = Height is fit to the content */}
                        {/* flex = Flexbox, justify-center = Content is centered horizontally, items-center = Content is centered vertically */}
                        <div className='rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center'>
                            {/* Globe component. This is a package above Three.js */}
                            <Globe 
                                height={326}
                                width={326}
                                backgroundColor='rgba(0,0,0,0)'
                                backgroundImageOpacity={0.5}
                                showAtmosphere
                                showGraticules
                                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                                labelsData={[{
                                    lat: -36.7,
                                    lng: 174.7,
                                    text: "My Location",
                                    color: "white",
                                    size: 30,
                                }]}
                            />
                        </div>
                        <div>
                            <p className='grid-headtext'>Location</p>
                            <p className='grid-subtext'>I am currently based in Auckland, New Zealand.</p>

                            <Button name="Contact Me" isBeam containerClass='w-full mt-10' />
                        </div>
                    </div>
                </div>
                <div className='xl:col-span-2 xl:row-span-3'>
                    <div className='grid-container'>
                        <img src="/assets/grid3.png" alt="grid-3" className='w-full sm:h-[266px] h-fit object-contain' />
                        <div>
                            <p className='grid-headtext'>My Passion</p>
                            <p className='grid-subtext'>I want to use my expertise in Technology to give positive impact to the world.</p>
                        </div>
                    </div>
                </div>
                <div className='xl:col-span-1 xl:row-span-2'>
                    <div className='grid-container'>
                        {/* h-fit = Height is fit to the content, object-cover = The image will not be stretched */}
                        {/* The image will be cropped to fit the container */}
                        <img src="/assets/grid4.png" alt="grid-4" className='w-full md:h-[126px] sm:h-[276px] h-fit object-cover sm:object-top'/>
                        <div className='space-y-2'>
                            <p className='grid-headtext text-center'>Contact Me</p>
                            {/* when the email is clicked, the handleCopy function is called */}
                            <div className='copy-container grid-subtext' onClick={handleCopy}>
                                <p className='grid-subtext'>scy02718@gmail.com</p>
                                <img src={hasCopied ? "/assets/tick.svg" : "/assets/copy.svg"} alt="copy" className='w-5 h-5'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About