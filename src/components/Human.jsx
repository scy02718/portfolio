
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const Human = (props) => {
  const { nodes, materials } = useGLTF('/models/human.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} position={[-1, -2.1, 1.4]}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <group rotation={[-Math.PI / 2, 0, 2.5]} scale={50}>
            <primitive object={nodes._rootJoint} />
            <skinnedMesh
              geometry={nodes.Object_7.geometry}
              material={materials.hero}
              skeleton={nodes.Object_7.skeleton}
              castShadow
            />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/human.glb')

export default Human