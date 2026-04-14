import React, { useEffect, useRef, useState } from 'react'
import Terminal from './components/Terminal'
import ResultPane from './components/ResultPane'
import { applyTheme, getCurrentTheme } from './lib/themes'

const App = () => {
  const [view, setView] = useState('home')
  const terminalRef = useRef(null)

  // Apply persisted theme on first paint
  useEffect(() => {
    applyTheme(getCurrentTheme())
  }, [])

  // ⌘K / Ctrl+K focuses the terminal input
  useEffect(() => {
    const onKey = (e) => {
      const isMeta = e.metaKey || e.ctrlKey
      if (isMeta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        terminalRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <main className='h-screen w-screen flex flex-col md:flex-row overflow-hidden'>
        <div className='md:w-[30%] w-full h-1/2 md:h-full'>
          <Terminal ref={terminalRef} currentView={view} onChangeView={setView} />
        </div>
        <div className='md:w-[70%] w-full h-1/2 md:h-full'>
          <ResultPane view={view} />
        </div>
      </main>
    </>
  )
}

export default App
