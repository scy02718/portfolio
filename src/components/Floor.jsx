export default function Floor() {
    return (
      <mesh scale={0.4} rotation-x={-1.5} position={[0,-2,0]} receiveShadow>
        <circleGeometry args={[10]} />
        <meshStandardMaterial />
      </mesh>
    )
  }