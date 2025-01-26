import { useState, Suspense } from 'react'
import { myProjects } from '../constants/index.js'
import { Canvas } from '@react-three/fiber'
import { Center, OrbitControls } from '@react-three/drei'
import CanvasLoader from '../components/CanvasLoader'
import DemoComputer from '../components/Democomputer.jsx'

const Projects = () => {
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(0)

    // This value will change as the user swipes through the projects
    const currentProject = myProjects[selectedProjectIndex]

    const handleNavigation = (direction) => {
        // This function will be used to navigate through the projects
        // The direction will be either 'previous' or 'next'
        // If the direction is 'previous', we will navigate to the previous project
        // If the direction is 'next', we will navigate to the next project

        // prevIndex is an internal state for setSelectedProjectIndex, which is the current project index
        setSelectedProjectIndex((prevIndex) => {
            if (direction === "previous") {
                return prevIndex === 0 ? myProjects.length - 1 : prevIndex - 1
            } else {
                return prevIndex === myProjects.length - 1 ? 0 : prevIndex + 1
            }
        })
    }

    return (
        // The section tag contains the projects section
        // Each component should have a section tag
        // c-space is a custom class that adds padding to the top and bottom of the section
        // my-20 adds margin to the top and bottom
        <section className='c-space my-20' id="work">
            {/* The section has a grid layout */}
            {/* The grid has 2 columns for large screens, and 1 column for small screens */}
            {/* The gap between the columns is 5, with a margin top of 12 */}
            {/* The width of the grid is full */}
            <p className='head-text'>My Work</p>
            <div className='grid lg:grid-cols-2 grid-cols-1 mt-12 gap-5 w-full'>
                <div className='flex flex-col gap-5 relative sm:p-10 py-10 px-5 shadow-2xl shadow-black-200'>
                    {/* This is to shine a spotlight to the project */}
                    {/* Each project has its unique spotlight image, coming from the constants file */}
                    {/* The spotlight is placed at the top right, absolute position meaning it is placed relative to the parent */}
                    {/* w-full = Full width, h-96 = Height is 96, object-cover = The image will cover the container */}
                    <div className='absolute top-0 right-0'>
                        <img src={currentProject.spotlight} alt='Spotlight' className='w-full h-96 object-cover rounded-xl' />
                    </div>

                    {/* The project logo */}
                    {/* p-3 = Padding on all sides is 3, backdrop-filter = Adds a blur effect to the background */}
                    {/* backdrop-blur-3xl = The blur effect is 3xl, w-fit = Width is fit to the content, rounded-lg = Rounded corners */}
                    {/* shadow-sm = Small shadow */}
                    <div className='p-3 backdrop-filter backdrop-blur-3xl w-fit rounded-lg' style={currentProject.logoStyle}>
                        <img src={currentProject.logo} alt='Logo' className='w-10 h-10 shadow-sm' />
                    </div>

                    {/* The project title and description */}
                    {/* flex = Flexbox, flex-col = Children are in a column, gap-5 = Gap between the children is 5 */}
                    {/* text-white-600 = Text color is white-600, my-5 = Margin on the y-axis is 5 */}
                    <div className='flex flex-col gap-5 text-white-600 my-5'>
                        {/* text-2xl = Text size is 2xl, font-semibold = Font weight is semibold */}
                        {/* animatedText = Custom class for the animation */}
                        <p className='text-white text-2xl font-semibold animatedText'>
                            {currentProject.title}
                        </p>
                        <p className='animatedText'>
                            {currentProject.desc}
                        </p>
                        <p className='animatedText'>
                            {currentProject.subdesc}
                        </p>
                    </div>
                    
                    {/* The project tags and live site link */}
                    {/* What exactly is a flexbox? = Flexbox is a layout model that allows elements to align and distribute space within a container */}
                    {/* items-center = Align the children in the center, justify-between = Space between the children, which are a div and a link */}
                    {/* flex-wrap = Wrap the children if they overflow, gap-5 = Gap between the children is 5 */}
                    <div className='flex items-center justify-between flex-wrap gap-5'>
                        {/* The project tags */}
                        {/* flex = Flexbox, items-center = Align the children in the center, which are the logos, gap-3 = Gap between the children is 3 */}
                        <div className='flex items-center gap-3'>
                            {/* Map through the tags, in which you provide index as key */}
                            {currentProject.tags.map((tag, index) => (
                                <div key={index} className='tech-logo'>
                                    <img src={tag.path} alt={tag.name}/>    
                                </div>
                            ))}
                        </div>

                        {/* The live site link */}
                        {/* flex = Flexbox, items-center = Align the children (the arrow and text - 각자의 child 에게만 적용된된) in the center, gap-2 = Gap between the children is 2 */}
                        {/* cursor-pointer = Cursor changes to pointer on hover, text-white-600 = Text color is white-600 */}
                        {/* The link goes to the project's href, target='_blank' = Opens in a new tab, rel='noreferrer' = Security measure  required when you use target='_blank' */}
                        <a className='flex items-center gap-2 cursor-pointer text-white-600' href={currentProject.href} target='_blank' rel='noreferrer'>
                            <p>Check Live Site</p>
                            <img src="assets/arrow-up.png" className='w-3 h-3' alt="arrow" />
                        </a>
                    </div>

                    {/* The navigation buttons */}
                    {/* flex = Flexbox, justify-between = Space between the buttons, items-center = Align the children in the center, mt-7 = Margin top is 7 */}
                    <div className='flex justify-between items-center mt-7'>
                        <button className='arrow-btn' onClick={() => handleNavigation('previous')}>
                            <img src="/assets/left-arrow.png" alt="left-arrow" className='w-4 h-4' />
                        </button>
                        <button className='arrow-btn' onClick={() => handleNavigation('next')}>
                            <img src="/assets/right-arrow.png" alt="right-arrow" className='w-4 h-4' />
                        </button>
                    </div>
                </div>
                
                {/* Interactive project display, using 3D models */}
                {/* border = Border around the container, border-black-300 = Border color is black-300, bg-black-200 = Background color is black-200 */}
                {/* rounded-lg = Rounded corners, h-96 = Height is 96, md:h-full = Height is full on medium screens */}
                <div className='border border-black-300 bg-black-200 rounded-lg h-96 md:h-full'>
                    {/* First draw the canvas, which acts as the container for the 3D models */}
                    {/* Again, you cannot have an HTML tag inside a canvas */}
                    <Canvas>
                        {/* Define two lights, ambient and directional */}
                        <ambientLight intensity={Math.PI} />
                        <directionalLight position={[10,10,5]} intensity={1} />

                        {/* Center is a component from drei, which easily centers the children into the canvas*/}
                        <Center>
                            {/* Again, suspense is what you show while you are loading the 3D models */}
                            <Suspense fallback={<CanvasLoader />}>
                                {/* Inside will be a group of 3D models */}
                                {/* The parameters scale, position and rotation are manually set */}
                                {/* Inside will be computer, which is a component just like other 3D models */}
                                <group scale={2} position={[0,-3,0]} rotation={[0,-0.1,0]}>
                                    {/* Provide the texture to the computer, which is stored in index.js */}
                                    <DemoComputer texture={currentProject.texture} />
                                </group>
                            </Suspense>
                        </Center>

                        {/* OrbitControls is a component from drei, which allows you to rotate and zoom the 3D models */}
                        {/* maxPolarAngle = Maximum angle the camera can rotate vertically */}
                        {/* We will disable zoom for this project */}
                        <OrbitControls maxPolarAngle={Math.PI / 2} enableZoom={false} />
                    </Canvas>
                </div>
            </div>
        </section>
    )
}

export default Projects