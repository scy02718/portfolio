import React from 'react'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import Experience from './sections/Experience'
import Education from './sections/Education'
import Certificates from './sections/Certificates'
import Skills from './sections/Skills'

const App = () => {
  return (
    // Ensure all structures have similar width of 7xl
    <main className='max-w-7xl mx-auto'>
      <Navbar />
      <Hero />
      <About />
      <Education />
      <Experience />
      <Certificates />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}

export default App