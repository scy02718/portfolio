import React, { useEffect, useRef, useState, useCallback } from 'react'
import Terminal from './components/Terminal'
import ResultPane from './components/ResultPane'
import { applyTheme, getCurrentTheme } from './lib/themes'

// Views that "take over" the result pane and exit on q/Esc.
const TAKEOVER_VIEWS = new Set(['top', 'vim'])

const App = () => {
  const [viewState, setViewState] = useState({ id: 'home', arg: null })
  const [previousViewState, setPreviousViewState] = useState({ id: 'home', arg: null })
  const terminalRef = useRef(null)

  // Apply persisted theme on first paint
  useEffect(() => {
    applyTheme(getCurrentTheme())
  }, [])

  // Public navigate — tracks previous view so takeover modes can restore on exit
  const navigate = useCallback((next, arg = null) => {
    setViewState((current) => {
      if (next === current.id) {
        // Same view, just update arg (e.g. `vim experience` while already in vim)
        return { id: current.id, arg }
      }
      setPreviousViewState(current)
      return { id: next, arg }
    })
  }, [])

  const exitTakeover = useCallback(() => {
    setViewState(previousViewState)
  }, [previousViewState])

  // ⌘K → focus terminal · q/Esc → exit takeover view (when nothing else is focused)
  useEffect(() => {
    const onKey = (e) => {
      if (e.defaultPrevented) return

      const isMeta = e.metaKey || e.ctrlKey
      if (isMeta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        terminalRef.current?.focus()
        return
      }

      const tag = document.activeElement?.tagName
      const inField = tag === 'INPUT' || tag === 'TEXTAREA'
      if (inField) return

      if (TAKEOVER_VIEWS.has(viewState.id) && (e.key === 'q' || e.key === 'Escape')) {
        e.preventDefault()
        exitTakeover()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewState.id, exitTakeover])

  return (
    <>
      <main className='h-screen w-screen flex flex-col md:flex-row overflow-hidden'>
        <div className='md:w-[30%] w-full h-1/2 md:h-full'>
          <Terminal ref={terminalRef} currentView={viewState.id} onChangeView={navigate} />
        </div>
        <div className='md:w-[70%] w-full h-1/2 md:h-full'>
          <ResultPane view={viewState.id} arg={viewState.arg} onExitTakeover={exitTakeover} />
        </div>
      </main>
    </>
  )
}

export default App
