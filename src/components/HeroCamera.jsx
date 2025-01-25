import { easing } from 'maath';
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const HeroCamera = ({ children, isMobile }) => {
    // This is a component that will be used to PAN the HackerRoom using mouse
    // The children will be the HackerRoom, and by getting them as a prop we have access to them

    const groupRef = useRef();

    // We declare what we want to change
    // We should slowly ease the camera to the new position, in which we need maath package
    // We can use the damp3 function to ease the camera to the new position, 0,0,20, with a damping factor of 0.25, for a change of delta
    // We don't want to move the camera on mobile as it is too heavy
    useFrame((state, delta) => {
        easing.damp3(state.camera.position, [0,0,20], 0.25, delta)

        if (!isMobile) {
            // This makes the HackerRoom to always face the mouse pointer.
            // Experiment with the values for maximum effect
            easing.dampE(groupRef.current.rotation, [-state.pointer.y / 3, state.pointer.x / 3, 0], 0.25, delta)
        }
    })

    return (
        <group ref={groupRef} scale={isMobile ? 1 : 1.1}>{children}</group>
    )
}

export default HeroCamera