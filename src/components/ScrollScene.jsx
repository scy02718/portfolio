import React, { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'
import * as THREE from 'three'

const useScrollProgress = () => {
    const ref = useRef(0)
    useFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        ref.current = max > 0 ? window.scrollY / max : 0
    })
    return ref
}

const Stars = ({ count = 4000, radius = 18, color = '#a8c5ff', size = 0.025 }) => {
    const ref = useRef()
    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3)
        random.inSphere(arr, { radius })
        return arr
    }, [count, radius])

    useFrame((_, delta) => {
        if (!ref.current) return
        ref.current.rotation.y += delta * 0.02
        ref.current.rotation.x += delta * 0.005
    })

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach='attributes-position' args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={size}
                color={color}
                sizeAttenuation
                transparent
                opacity={0.85}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

const Nebula = ({ count = 800, color = '#7a3dff', position = [0, 0, 0] }) => {
    const ref = useRef()
    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3)
        random.inSphere(arr, { radius: 6 })
        return arr
    }, [count])

    useFrame((state) => {
        if (!ref.current) return
        const t = state.clock.elapsedTime
        ref.current.rotation.z = t * 0.04
        ref.current.material.opacity = 0.35 + Math.sin(t * 0.6) * 0.1
    })

    return (
        <points ref={ref} position={position}>
            <bufferGeometry>
                <bufferAttribute attach='attributes-position' args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.18}
                color={color}
                sizeAttenuation
                transparent
                opacity={0.4}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

const CameraRig = ({ progressRef }) => {
    const camRef = useRef()
    const target = useMemo(() => new THREE.Vector3(), [])

    useFrame((state, delta) => {
        if (!camRef.current) return
        const p = progressRef.current
        // Glide camera forward through space, drifting laterally as you scroll
        const z = THREE.MathUtils.lerp(8, -14, p)
        const x = Math.sin(p * Math.PI * 2) * 2.5
        const y = Math.cos(p * Math.PI * 1.5) * 1.5 - p * 1.5

        target.set(x, y, z)
        camRef.current.position.lerp(target, 0.08)
        camRef.current.rotation.z = THREE.MathUtils.lerp(camRef.current.rotation.z, p * 0.4, 0.05)
        // Subtle parallax from mouse
        camRef.current.position.x += state.pointer.x * 0.15
        camRef.current.position.y += state.pointer.y * 0.1
    })

    return <PerspectiveCamera ref={camRef} makeDefault position={[0, 0, 8]} fov={70} />
}

const Inner = () => {
    const progressRef = useScrollProgress()
    return (
        <>
            <CameraRig progressRef={progressRef} />
            <Stars count={5000} radius={20} color='#cfd8ff' size={0.022} />
            <Stars count={1500} radius={10} color='#76d6ff' size={0.04} />
            <Nebula count={900} color='#7a3dff' position={[-3, 1, -4]} />
            <Nebula count={700} color='#ff5c8a' position={[4, -2, -8]} />
        </>
    )
}

const ScrollScene = () => {
    return (
        <div className='fixed inset-0 z-0 pointer-events-none' aria-hidden>
            <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
                <Suspense fallback={null}>
                    <Inner />
                </Suspense>
            </Canvas>
        </div>
    )
}

export default ScrollScene
