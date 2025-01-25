import React from 'react'
import { useState } from 'react'
import { navLinks } from '../constants/index.js';

const NavItems = () => {
    // We will create a new file where we will store ALL the constants
    // This includes the menu items, projects, work experiences and more
    // Always store constants into /src/constants/index.js
    // This is a good practice to maintain the code and reduce repetition
    return (
        <ul className='nav-ul'>
            {/* Map through the navLinks array which is export constant from /src/constants/index.js */}
            {/* Destructure the id, href and name from the navLinks array */}
            {navLinks.map(({id, href, name}) => (
                // Key is required when you map through an array
                // For now, leave the onClick function empty
                <li key={id} className='nav-li'>
                    <a href={href} className='nav-li_a' onClick={() => {}}>
                        {name}
                    </a>
                </li>
            ))}
        </ul>
    )
}

const Navbar = () => {
    // useState is used to manage the state of the menu
    const [isOpen, setIsOpen] = useState(false)

    // Function to toggle the menu
    // You can use setIsOpen(!isOpen) as well, but this method is more reliable
    const toggleMenu = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen)
    }

    return (
        // Fixed = Position is fixed to the viewport, Top-0 = Stays at the very top
        // Left-0 = Stays at the very left, Right-0 = Stays at the very right
        // Z-50 = The content may be on top of other content, BG-black/90 = Background color is black with 90% opacity
        <header className='fixed top-0 left-0 right-0 z-50 bg-black/90'>
            {/* Max-w-7xl = Maximum width is 7xl (It is always good to maintain this 7xl), Mx-auto = Margin on the x-axis is auto */}
            <div className='max-w-7xl mx-auto'>
                {/* Flex = Flexbox, meaning the children will be in a row */}
                {/* Justify-between = Space between the children, Items-center = Align the children in the center */}
                {/* Py-5 = Padding on the y-axis is 5, Mx-auto = Margin on the x-axis is auto, C-space = Custom class */}
                {/* Custom class is created in the tailwind.config.js file */}
                <div className='flex justify-between items-center py-5 mx-auto c-space'>
                    {/* Text-neutral-400 = Text color is neutral-400, Font-bold = Font weight is bold, Text-xl = Text size is xl */}
                    {/* Hover:text-white = Text color changes to white on hover, Transition-colors = Smooth transition */}
                    <a href="/" className='text-neutral-400 font-bold text-xl hoverLtext-white transition-colors'>
                        Samuel
                    </a>

                    {/* focus:outline-none = Removes the outline when the button is focused */}
                    {/* Sm:hidden = Hidden on small screens, Flex = Flexbox, meaning the children will be in a row */}
                    {/* aria-label = Accessibility label, meaning it will be read by the screen reader */}
                    <button onClick={toggleMenu} className='text-neutral-400 hover:text-white focus:outline-none sm:hidden flex' aria-label='Toggle Menu'>
                        {/* If isOpen is true, then show close.svg, else show menu.svg */}
                        {/* W-6 = Width is 6, H-6 = Height is 6 */}
                        <img src={isOpen ? "assets/close.svg" : "assets/menu.svg"} alt="Toggle" className='w-6 h-6' />
                    </button>

                    {/* Sm:flex = Flexbox is only visible on small screens, Hidden on large screens */}
                    <nav className='sm:flex hidden'>
                        {/* NavItems component. Using components allows you to reuse the code, for mobile and desktop */}
                        <NavItems />
                    </nav>
                </div>
            </div>

            {/* This is only visible on small, mobile screens, takes full height of the screen */}
            <div className={`nav-sidebar ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <nav className='p-5'>
                    <NavItems />
                </nav>
            </div>
        </header>
    )
}

export default Navbar