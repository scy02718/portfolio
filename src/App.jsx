import React, { useEffect, useState } from 'react'
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
import Awards from './sections/Awards'
import CommandPalette from './components/CommandPalette'

const App = () => {
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      const isMeta = e.metaKey || e.ctrlKey
      if (isMeta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(o => !o)
      } else if (e.key === '/' && !paletteOpen) {
        const tag = document.activeElement?.tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault()
          setPaletteOpen(true)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paletteOpen])

  return (
    // Ensure all structures have similar width of 7xl
    <main className='max-w-7xl mx-auto'>
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <Hero />
      <About />
      <Education />
      <Experience />
      <Certificates />
      <Awards />
      <Skills />
      {/*<Projects />*/}
      <Contact />
      <Footer />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </main>
  )
}

export default App
