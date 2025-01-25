import React from 'react'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'

const App = () => {
  return (
    // Ensure all structures have similar width of 7xl
    <main className='max-w-7xl mx-auto'>
      <Navbar />
      <Hero />
      <About />
    </main>
  )
}

export default App