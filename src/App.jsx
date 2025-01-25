import React from 'react'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'

const App = () => {
  return (
    // Ensure all structures have similar width of 7xl
    <main className='max-w-7xl mx-auto'>
      <Navbar />
      <Hero />
    </main>
  )
}

export default App