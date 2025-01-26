import { Canvas } from '@react-three/fiber'
import React, { Suspense, useState } from 'react'
import { workExperiences } from '../constants/index.js'
import { OrbitControls } from '@react-three/drei'
import CanvasLoader from '../components/CanvasLoader'
import Developer from '../components/Developer.jsx'

const Experience = () => {
    // This section will consist of two parts.
    // The Left container will contain a 3D model of my avatar.
    // The avatar will be created using "Ready Player Me" website.
    // I've created my own customised avatar that looks just like me!
    // Then, we will add animations to the model using Adobe Mixamo.
    // First we need to convert them into FBX format using "https://products.aspose.app/3d/conversion/glb-to-fbx"
    // FBX format is used for animation. Mixamo, using the rigged skeletons, will be able to map any animation into the model.
    // 레전드인데... after setting wanted animation, download them as FBX, in which we can use them into the code!
    // 와 되게 재밌닼ㅋㅋㅋㅋㅋㅋ 이제 애니메이션을 직접 만드는거임.. 대박 관절의 위치를 조정해주면 알아서 스켈레톤을 만들어줌
    // 어떻게 이런게 다 공짜지?
    // The Right container will contain a list of my work experience

    // This state will be used to automatically change the animation of the 3D model!
    const [animationName, setAnimationName] = useState('idle')

    return (
        // This section will have an id of experience
        // It will have a class of c-space which will add padding to the top and bottom
        // It will also have a margin of 20
        <section id='experience' className='c-space my-20'>
            {/* This div will be the container for the section */}
            {/* It will fill up the entire width of the screen, and all texts will be white */}
            <div className='w-full text-white-600'>
                <h3 className='head-text'>My Work Experience</h3>

                {/* This work container will contain two divs */}
                <div className='work-container'>
                    {/* The left container will contain the 3D model */}
                    <div className='work-canvas'>
                        <Canvas>
                            {/* Three light sources */}
                            {/* Ambient light will light up the entire scene with intensity of 7 */}
                            {/* Spot light will be positioned at 10,10,10 with an angle of 0.15 and penumbra of 1 */}
                            {/* Angle is the angle of the light cone, penumbra is the softness of the edge of the light */}
                            {/* Directional light will be positioned at 10,10,10 with an intensity of 1 */}
                            <ambientLight intensity={7} />
                            <spotLight position={[10,10,10]} angle={0.15} penumbra={1} />
                            <directionalLight position={[10,10,10]} intensity={1} />

                            {/* This allows users to interact with the 3D model */}
                            {/* They cannot zoom, and the angle is limited to front and side, not top */}
                            <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2}/>

                            {/* Suspense to execute while loading the model */}
                            {/* Inside will be the actual 3D model */}
                            {/* Simply displaying the Model is possible. Now, how do we animate them? */}
                            <Suspense fallback={<CanvasLoader />}>
                                <Developer animationName={animationName} position-y={-3} scale={3} />
                            </Suspense>
                        </Canvas>
                    </div>

                    {/* The right container will contain the list of work experience */}
                    <div className='work-content'>
                        {/* This is a div to create some spacing rules */}
                        <div className='sm:py-10 py-5 sm:px-5 px-2.5'>
                            {/* We will map through the workExperiences array, by using the map function */}
                            {/* You will need to pass in the item as arguments */}
                            {/* Work Experience array contains id, name, pos, duration, title, icon, animation */}
                            {/* Since the array contains unique id, we will use the id as the key */}
                            {workExperiences.map(({id, name, pos, duration, title, icon, animation}) => (
                                // This div will be the w-full container containing everything about that experience
                                // "group" class will add padding to the top and bottom
                                // The animation should be set appropriately so that it matches the desired actions
                                // When the div is hovered or clicked, the animation will change
                                <div key={id} className='work-content_container group' onClick={() => setAnimationName(animation.toLowerCase())}
                                onPointerOver={() => setAnimationName(animation.toLowerCase())} onPointerOut={() => setAnimationName('idle')}>
                                    {/* This div will contain the logo */}
                                    {/* It will take full height, justify the content to the start and center the items */}
                                    {/* Flex was used to use the justify and items properties */}
                                    <div className='flex flex-col h-full justify-start items-center py-2'>
                                        <div className='work-content_logo'>
                                            <img src={icon} alt="logo" className='w-full h-full' />
                                        </div>
                                        {/* This div creates a space between */}
                                        <div className='work-content_bar'/>
                                    </div>
                                    
                                    {/* This div will contain the details of the work experience */}
                                    <div className='sm:p-5 px-2.5 py-5'>
                                        <p className='font-bold text-white-800'>{name}</p>
                                        <p className='text-sm-mb-5'>{pos} -- {duration}</p>

                                        {/* group-hover is executed when any of the elements inside the GROUP, which is the parent div, is hovered */}
                                        {/* Hence if any of them are hovered, the text will change to white */}
                                        {/* transition ease-in-out duration-500 will make the text change color smoothly */}
                                        <p className='group-hover:text-white transition ease-in-out duration-500'>{title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Experience