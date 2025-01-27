import React, { Suspense, useState } from 'react'
import { myCertificates } from '../constants/index.js'
import { Canvas } from '@react-three/fiber'
import { Center, OrbitControls } from '@react-three/drei'
import Certificate from '../components/Certificate'
import CanvasLoader from '../components/CanvasLoader'
import Floor from '../components/Floor'
import Human from '../components/Human.jsx'



const Lights= () => {
  return (
    <>
      <ambientLight
        visible={true}
        intensity={0.4}
      />
      <directionalLight
        visible={true}
        position={[
          -1.7,
          5.0,
          4.4,
        ]}
        castShadow={true}
      />
    </>
  )
}

const Certificates = () => {
  const [selectedCertificateIndex, setSelectedCertificateIndex] = useState(0)
  const currentCertificate = myCertificates[selectedCertificateIndex]

  const numCertificates = myCertificates.length

  const handleNavigation = (direction) =>
    setSelectedCertificateIndex((prevIndex) => {
      if (direction === "previous") {
        return prevIndex === 0 ? myCertificates.length - 1 : prevIndex - 1
      } else {
        return prevIndex === myCertificates.length - 1 ? 0 : prevIndex + 1
      }
    })

  const openLink = (link) => () => window.open(link, '_blank', 'noreferrer')
  const openDownload = (cert) => () => window.open(cert, '_blank', 'noreferrer')

  return (
    <section id='certificates' className='c-space my-20'>
      <div className='w-full text-white-600'>
        <h3 className='head-text'>My Certificates</h3>
        <div className='grid lg:grid-cols-2 grid-cols-1 mt-12 gap-5 w-full'>
          <div className='p-5 px-10 shadow-2xl shadow-black-200 bg-black-200 border-2 border-black-300 rounded-lg'>
            <div className='flex justify-between items-center mt-7'>
                <button className='arrow-btn' onClick={() => handleNavigation('previous')}>
                    <img src="/assets/left-arrow.png" alt="left-arrow" className='w-4 h-4' />
                </button>

                <div className='flex items-center gap-1'>
                    <p className='text-white-700'>{selectedCertificateIndex + 1}</p>
                    <p className='text-white-700'>/</p>
                    <p className='text-white-700'>{numCertificates}</p>
                </div>

                <button className='arrow-btn' onClick={() => handleNavigation('next')}>
                    <img src="/assets/right-arrow.png" alt="right-arrow" className='w-4 h-4' />
                </button>
            </div>
            <div className='flex flex-col gap-2 text-white-600 my-5 items-start'>
              <p className='animtedText'>{currentCertificate.provider}</p>
              <p className='text-2xl font-bold text-white animatedText'>{currentCertificate.name}</p>

              <div className='px-4 p-2 w-fit rounded-xl bg-black-300 mt-2'>
                <p>{currentCertificate.date}</p>
              </div>

              <p className='animatedText'>
                {currentCertificate.desc}
              </p>

              {currentCertificate.score && 
              <div className='w-full'>
                  <p className='text-white-700 mt-2'>Score: {(currentCertificate.score * 100).toFixed(1)}%</p>
                  <div className='w-full'>
                    <div className='bg-black-100 rounded-xl w-full'>
                      <div className='bg-white rounded-xl p-2' style={{ width: `${(currentCertificate.score * 100).toFixed(1)}%` }}></div>
                    </div>
                  </div>
              </div>
              }

              <div className='flex justify-start gap-3 mt-5'>
                <button onClick={openLink(currentCertificate.link)} className='btn btn-primary rounded-lg'><p className='text-white-700'>View Certificate</p></button>
                {currentCertificate.cert &&
                  <button onClick={openDownload(currentCertificate.cert)} className='btn btn-primary rounded-lg'><p className='text-white-700'>Download Certificate</p></button>
                }
              </div>
            </div>
          </div>

          <div className='border border-black-300 bg-black-200 rounded-lg h-96 md:h-full'>
            <Canvas shadows>
              <Lights />

              <Center>
                <Suspense fallback={<CanvasLoader />}>
                  <group scale={2} position={[0,0,0]} rotation={[0,-0.5,0]}>
                    <Certificate texture={currentCertificate.logo} />
                  </group>
                  <Human />
                </Suspense>
              </Center>

              <OrbitControls maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} enableZoom={false} />
              <Floor />
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Certificates