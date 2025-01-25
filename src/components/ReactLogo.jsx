import React from 'react'
import { Float, useGLTF } from '@react-three/drei'

const ReactLogo = (props) => {
  const { nodes, materials } = useGLTF('/models/react.glb')
  // Float is a property from drei that is used to create a floating effect for the model
  // Manually adjust the scale, position, and rotation of the model to make it look gopd
  return (
    <Float floatIntensity={1}>
        <group position={[8,8,0]} {...props} scale={1.2} dispose={null}>
            <mesh
                geometry={nodes['React-Logo_Material002_0'].geometry}
                material={materials['Material.002']}
                position={[0, 0.079, 0.181]}
                rotation={[0, 0, -Math.PI / 2]}
                scale={[0.1146, 0.1146, 0.1581]}
            />
        </group>
    </Float>
  )
}

useGLTF.preload('/models/react.glb')

export default ReactLogo