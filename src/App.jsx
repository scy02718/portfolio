import React, { useEffect, useRef, useState, useCallback } from 'react'
import Terminal from './components/Terminal'
import ResultPane from './components/ResultPane'
import { applyTheme, getCurrentTheme } from './lib/themes'

// Views that "take over" the result pane and exit on q/Esc.
const TAKEOVER_VIEWS = new Set(['top'])

const App = () => {
  const [view, setViewRaw] = useState('home')
  const [previousView, setPreviousView] = useState('home')
  const terminalRef = useRef(null)

  // Apply persisted theme on first paint
  useEffect(() => {
    applyTheme(getCurrentTheme())
  }, [])

  // Public navigate — tracks previous view so takeover modes can restore on exit
  const navigate = useCallback((next) => {
    setViewRaw((current) => {
      if (next === current) return current
      setPreviousView(current)
      return next
    })
  }, [])

  // ⌘K / Ctrl+K → focus terminal · q/Esc → exit takeover view
  useEffect(() => {
    const onKey = (e) => {
      const isMeta = e.metaKey || e.ctrlKey
      if (isMeta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        terminalRef.current?.focus()
        return
      }

      const tag = document.activeElement?.tagName
      const inField = tag === 'INPUT' || tag === 'TEXTAREA'
      if (inField) return

      if (TAKEOVER_VIEWS.has(view) && (e.key === 'q' || e.key === 'Escape')) {
        e.preventDefault()
        // Restore the previous view directly, bypassing navigate so we don't
        // overwrite previousView with the takeover view itself.
        setViewRaw(previousView)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, previousView])

  return (
    <>
      <main className='h-screen w-screen flex flex-col md:flex-row overflow-hidden'>
        <div className='md:w-[30%] w-full h-1/2 md:h-full'>
          <Terminal ref={terminalRef} currentView={view} onChangeView={navigate} />
        </div>
        <div className='md:w-[70%] w-full h-1/2 md:h-full'>
          <ResultPane view={view} />
        </div>
      </main>
    </>
  )
}

export default App
