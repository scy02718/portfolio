import React, { useEffect, useRef, useState } from 'react'
import BootSequence from './components/BootSequence'
import Terminal from './components/Terminal'
import ResultPane from './components/ResultPane'

const App = () => {
  const [view, setView] = useState('home')
  const terminalRef = useRef(null)

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
      <BootSequence />
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
