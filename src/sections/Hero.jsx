import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, Ring } from '@react-three/drei'
import HackerRoom from '../components/HackerRoom'
import CanvasLoader from '../components/CanvasLoader'
import { Leva, useControls } from 'leva';
import { useMediaQuery } from 'react-responsive'
import { calculateSizes } from '../constants/index.js'
import Target from '../components/Target.jsx'
import ReactLogo from '../components/ReactLogo.jsx'
import Cube from '../components/Cube.jsx'
import Rings from '../components/Rings.jsx'
import HeroCamera from '../components/HeroCamera.jsx'
import Button from '../components/Button.jsx'

const Hero = () => {
    // useControls is a hook that is used to create controls for the model
    // The first parameter is the name of the model, the second parameter is an object with the controls
    // value = The initial value of the control, min = The minimum value of the control, max = The maximum value of the control
    // This is attached to Leva tag to show the controls on the screen
    // The controls can be used to FIND the best position, rotation, and scale for the model
    /*
    const x = useControls('HackerRoom', {
        positionX:{
            value: 2.5,
            min: -10,
            max: 10,
        },
        positionY:{
            value: 2.5,
            min: -10,
            max: 10,
        },
        positionZ:{
            value: 2.5,
            min: -10,
            max: 10,
        },
        rotationX:{
            value: 0,
            min: -10,
            max: 10,
        },
        rotationY:{
            value: 0,
            min: -10,
            max: 10,
        },
        rotationZ:{
            value: 0,
            min: -10,
            max: 10,
        },
        scale:{
            value: 1,
            min: 0.1,
            max: 2,
        }
    })
    */
    
    // This is a hook that is used to check if the screen is mobile or tablet, determined by the width
    // We can dynamically change the size of the model based on the screen size
    const isSmall = useMediaQuery({ maxWidth: 440 });
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });

    // The sizes object contains the experimentally found best position, rotation, and scale for the model
    const sizes = calculateSizes(isSmall, isMobile, isTablet);

    return (
        // min-h-screen makes sure the section is at least the height of the screen
        // w-full makes sure the section takes the full width of the screen
        // flex + flex-col makes sure the children are in a column
        // relative is used to position the elements inside the section
        // The id of home allows any link with href="#home" to scroll to this section. Animation is automatically added
        <section className='min-h-screen w-full flex flex-col relative' id="home">
            {/* mx-auto is used to center the content */}
            {/* Different mt between mobile and web are to counteract the navbar height */}
            <div className='w-full mx-auto flex flex-col sm:mt-36 mt-20 c-space gap-3'>
                {/* sm:text-3xl = Text size is 3xl on small screens, text-2xl = Text size is 2xl */}
                {/* font-medium = Font weight is medium, text-white = Text color is white */}
                {/* text-center = Text is centered, font-generalsans = Font is generalsans */}
                <p className='sm:text-3xl text-2xl font-medium text-white text-center font-generalsans'>Hi, I am Samuel<span className='waving-hand'>👋</span></p>
                <p className='hero_tag text-gray_gradient'>Software Engineer</p>
            </div>

            {/* absolute + inset-0 makes sure the element takes the rest of the space below the texts */}
            {/* w-full + h-full makes sure the element takes the full width and height */} 
            <div className='w-full h-full absolute inset-0'>
                {/* This has to be outside of the Canvas tag */}
                {/* This is not required anymore, as the values have been found */}
                {/*<Leva />*/}
                {/* This is the start of Three JS */}
                {/* npm install three @react-three/fiber @react-three/drei react-responsive leva */}
                <Canvas className='w-full h-full'>
                    {/* Suspense is used to show a fallback component while the model is loading */}
                    {/* If Suspense is not used, the page will be blank until the model is loaded */}
                    <Suspense fallback={<CanvasLoader />}>
                        {/* Within a canvas we must have a camera */}
                        <PerspectiveCamera makeDefault position={[0, 0, 20]} />
                        {/* With the camera and canvas, we add a model, in this case, HackerRoom */}
                        {/* This currently does not work as vanilla. We should manually experiment with position, rotation, and scale */}
                        {/* For control, use the useControl variables. However, we cannot directly use it in the component */}
                        {/* This will lead to HTML tag inside Canvas, which is not allowed */}
                        {/* This gives Input is not part of the THREE namespace! error */}
                        {/* We need to move the HTML tag (Leva) outside of the Canvas */}
                        <HeroCamera isMobile={isMobile}>
                            <HackerRoom 
                                position={sizes.deskPosition}
                                rotation={[0, -Math.PI, 0]}
                                scale={sizes.deskScale}
                            />
                        </HeroCamera>

                        {/* Inside the group are custom component for floating elemtents */}
                        {/* Again, within Canvas we cannot have <div> tags */}
                        <group>
                            <Target position={sizes.targetPosition}/>
                            <ReactLogo position={sizes.reactLogoPosition}/>
                            <Cube position={sizes.cubePosition}/>
                            <Rings position={sizes.ringPosition}/>
                        </group>

                        {/* Without Light, we cannot see the model */}
                        {/* AmbientLight is a light that affects all objects in the scene equally */}
                        <ambientLight intensity={1} />
                        {/* DirectionalLight is a light that is emitted from a specific direction */}
                        <directionalLight position={[10, 10, 10]} intensity={0.5} />
                    </Suspense>
                </Canvas>

            </div>

            {/* This is the button that is at the bottom of the section */}
            {/* The button is a link to the contact section, and is a custom component to reuse in the future */}
            {/* absolute + bottom-7 makes sure the button is at the bottom of the section */}
            {/* left-0 + right-0 makes sure the button takes the full width of the section */}
            {/* z-10 makes sure the button is on top of the other elements */}
            <div className='absolute bottom-7 left-0 right-0 w-full z-10 c-space'>
                {/* w-fit makes sure the button is only as wide as the content */}
                {/* When you give href as #about, it will scroll to the section with the id about */}
                <a href="#about" className='w-fit'>
                    {/* isBeam is a prop that makes the button have a beam effect */}
                    {/* containerClass is a prop that is used to style the button, input to the component*/}
                    <Button name="About Me" isBeam containerClass="sm:w-fit w-full sm:min-w-96"/>
                </a>
            </div>
        </section>
    )
}

export default Hero