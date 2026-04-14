import React, { useEffect, useRef, useState } from 'react'
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
import BootSequence from './components/BootSequence'
import TerminalHUD, { sectionOrder } from './components/TerminalHUD'

const App = () => {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [lastCommand, setLastCommand] = useState('')
  const lastCmdTimer = useRef(null)
  const gPressedAt = useRef(0)

  const echo = (cmd) => {
    setLastCommand(cmd)
    if (lastCmdTimer.current) clearTimeout(lastCmdTimer.current)
    lastCmdTimer.current = setTimeout(() => setLastCommand(''), 1800)
  }

  const jumpToIndex = (i) => {
    const clamped = Math.max(0, Math.min(sectionOrder.length - 1, i))
    const target = sectionOrder[clamped]
    const el = document.getElementById(target.id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      echo(`cd ./${target.id}`)
    }
  }

  const currentIndex = () => {
    // find section closest to top of viewport
    const mid = window.innerHeight * 0.35
    let best = 0
    let bestDist = Infinity
    sectionOrder.forEach(({ id }, i) => {
      const el = document.getElementById(id)
      if (!el) return
      const rect = el.getBoundingClientRect()
      const dist = Math.abs(rect.top - mid)
      if (dist < bestDist) { bestDist = dist; best = i }
    })
    return best
  }

  useEffect(() => {
    const onKey = (e) => {
      const isMeta = e.metaKey || e.ctrlKey
      if (isMeta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(o => !o)
        return
      }

      const tag = document.activeElement?.tagName
      const inField = tag === 'INPUT' || tag === 'TEXTAREA'
      if (paletteOpen || inField) return

      if (e.key === '/') {
        e.preventDefault()
        setPaletteOpen(true)
        return
      }

      // vim-style nav
      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault()
        jumpToIndex(currentIndex() + 1)
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault()
        jumpToIndex(currentIndex() - 1)
      } else if (e.key === 'G') {
        e.preventDefault()
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        echo('G  (jump to bottom)')
      } else if (e.key === 'g') {
        // double-tap g to jump to top (vim gg)
        const now = Date.now()
        if (now - gPressedAt.current < 400) {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          echo('gg (jump to top)')
          gPressedAt.current = 0
        } else {
          gPressedAt.current = now
        }
      } else if (/^[1-8]$/.test(e.key)) {
        e.preventDefault()
        jumpToIndex(parseInt(e.key, 10) - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paletteOpen])

  return (
    <>
      <BootSequence />
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
      <TerminalHUD lastCommand={lastCommand} />
    </>
  )
}

export default App
