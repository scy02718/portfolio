import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Target = (props) => {
    // To play with the scene, we need a reference to the scene
    const targetRef = useRef();

    // Get the models from official React Three Fiber docs
    // We will create a mesh from scratch, in which we need a scene
    const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target-stand/model.gltf')

    // We can use GSAP to animate the scene
    // We can use the useGSAP hook to animate the scene
    // TargetRef can be used to modify the scene
    // The scene will move up and down by 0.5 units, with a duration of 1.5 seconds, and repeat infinitely
    useGSAP(() => {
        gsap.to(targetRef.current.position, {
            y: targetRef.current.position.y + 0.5,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
        })
    })

    // We can render a mesh, which contains a primitive
    // Mesh has to contain a Geometry and Material, which primitive does both
    // The mesh will get position information from the props, and the scene will be the object
    // This will simply render the scene
    // We need to animate it, using GSAP
    // When you pair Three.js with GSAP, an animation library, you become unstoppable
    return (
        <mesh {...props} ref={targetRef} rotation={[0, Math.PI / 5, 0]} scale={1.2}>
            <primitive object={scene}/>
        </mesh>
    )
}

export default Target