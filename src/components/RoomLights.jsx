import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const RoomLights = () => {
    const monitorLightRef = useRef()
    const rimLightRef = useRef()
    const rimTargetRef = useRef()
    const flickerRef = useRef(0)

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime

        if (monitorLightRef.current) {
            const pulse = 4.5 + Math.sin(t * 2.3) * 0.6 + Math.sin(t * 7.1) * 0.25
            flickerRef.current -= delta
            if (flickerRef.current <= 0) {
                flickerRef.current = 0.8 + Math.random() * 2.2
                monitorLightRef.current.userData.flicker = Math.random() < 0.35 ? 0.4 : 1
            }
            const flicker = monitorLightRef.current.userData.flicker ?? 1
            monitorLightRef.current.intensity = pulse * flicker
        }

        if (rimTargetRef.current && rimLightRef.current) {
            const px = state.pointer.x
            const py = state.pointer.y
            rimTargetRef.current.position.x = THREE.MathUtils.lerp(rimTargetRef.current.position.x, px * 6, 0.08)
            rimTargetRef.current.position.y = THREE.MathUtils.lerp(rimTargetRef.current.position.y, py * 4 - 2, 0.08)
            rimTargetRef.current.updateMatrixWorld()
            rimLightRef.current.target = rimTargetRef.current
        }
    })

    return (
        <group>
            <ambientLight intensity={0.25} color='#2a3550' />

            <directionalLight position={[10, 10, 10]} intensity={0.35} color='#f5f0e6' />

            {/* Monitor/CRT glow — pulsing cyan light in front of the desk */}
            <pointLight
                ref={monitorLightRef}
                position={[0.25, -3.2, 3]}
                color='#4cc9ff'
                intensity={5}
                distance={18}
                decay={2}
            />

            {/* Warm bounce from the right side of the room */}
            <pointLight
                position={[6, -1, 2]}
                color='#ff6a3d'
                intensity={1.2}
                distance={15}
                decay={2}
            />

            {/* Cursor-tracking rim spotlight — colored edge light that follows the mouse */}
            <object3D ref={rimTargetRef} position={[0, -2, 0]} />
            <spotLight
                ref={rimLightRef}
                position={[-8, 6, 6]}
                color='#b388ff'
                intensity={60}
                angle={0.5}
                penumbra={0.8}
                distance={40}
                decay={1.5}
            />
        </group>
    )
}

export default RoomLights
