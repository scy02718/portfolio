import React, { useRef, useEffect } from 'react'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'

// Again used "https://gltf.pmnd.rs/" to convert the GLB file into JSX
// Downloaded GLB from Ready Player Me, uploaded to the website, and downloaded the JSX file
// Just by doing this, and setting appropriate canvas and suspense, we can see the 3D model in the website
// This is a revoluationary tool! Always use them when implementing 3D asset into the code

// We get the props of animationName, and set the default value to 'idle'
// Rest of the props can be written as ...props
const Developer = ({animationName = "idle", ...props }) => {
    // This is reference for the model. We can simply refer and modify the entire model using this reference
    const group = useRef();
    const { nodes, materials } = useGLTF('/models/animations/developer.glb')

    // I have downloaded the idle animation from Mixamo
    // We will extract the animations from the FBX file, using useFBX from drei
    // Then, those animations will be used  using useAnimations from drei
    // This will allow us to use the animations in the 3D model
    const { animations:  idleAnimations } = useFBX('/models/animations/idle.fbx')
    const { animations:  saluteAnimations } = useFBX('/models/animations/salute.fbx')
    const { animations:  clappingAnimations } = useFBX('/models/animations/clapping.fbx')
    const { animations:  victoryAnimations } = useFBX('/models/animations/victory.fbx')

    // We set the name of the animations accordingly.
    idleAnimations[0].name = 'idle'
    saluteAnimations[0].name = 'salute'
    clappingAnimations[0].name = 'clapping'
    victoryAnimations[0].name = 'victory'

    // We use the idle animation in the model I don't understand this part
    // By providing the animation and the reference to the group, this applies the animation to the model
    const { actions } = useAnimations([idleAnimations[0], saluteAnimations[0], clappingAnimations[0], victoryAnimations[0]], group)

    // So to summarise, when a user hovers / clicks certain section, a animationName state changes in Experience.jsx
    // This will change the animationName in Developer.jsx
    // This will trigger the useEffect, which will reset the animation, fade in the animation, and play the animation

    // This useEffect will run when anomationName changes!
    useEffect(() => {
        // This will reset the animation, fade in the animation, and play the animation
        actions[animationName].reset().fadeIn(0.5).play();

        // Cleanup function to fade out the animation after finished
        return () => actions[animationName].fadeOut(0.5);
    }, [animationName])

    return (
        <group {...props} dispose={null} ref={group}>
        <primitive object={nodes.Hips} />
        <skinnedMesh
            name="EyeLeft"
            geometry={nodes.EyeLeft.geometry}
            material={materials.Wolf3D_Eye}
            skeleton={nodes.EyeLeft.skeleton}
            morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
            morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
        />
        <skinnedMesh
            name="EyeRight"
            geometry={nodes.EyeRight.geometry}
            material={materials.Wolf3D_Eye}
            skeleton={nodes.EyeRight.skeleton}
            morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
            morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
        />
        <skinnedMesh
            name="Wolf3D_Head"
            geometry={nodes.Wolf3D_Head.geometry}
            material={materials.Wolf3D_Skin}
            skeleton={nodes.Wolf3D_Head.skeleton}
            morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
            morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
        />
        <skinnedMesh
            name="Wolf3D_Teeth"
            geometry={nodes.Wolf3D_Teeth.geometry}
            material={materials.Wolf3D_Teeth}
            skeleton={nodes.Wolf3D_Teeth.skeleton}
            morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
            morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
        />
        <skinnedMesh
            geometry={nodes.Wolf3D_Hair.geometry}
            material={materials.Wolf3D_Hair}
            skeleton={nodes.Wolf3D_Hair.skeleton}
        />
        <skinnedMesh
            geometry={nodes.Wolf3D_Glasses.geometry}
            material={materials.Wolf3D_Glasses}
            skeleton={nodes.Wolf3D_Glasses.skeleton}
        />
        <skinnedMesh
            geometry={nodes.Wolf3D_Outfit_Top.geometry}
            material={materials.Wolf3D_Outfit_Top}
            skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
        />
        <skinnedMesh
            geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
            material={materials.Wolf3D_Outfit_Bottom}
            skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
        />
        <skinnedMesh
            geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
            material={materials.Wolf3D_Outfit_Footwear}
            skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
        />
        <skinnedMesh
            geometry={nodes.Wolf3D_Body.geometry}
            material={materials.Wolf3D_Body}
            skeleton={nodes.Wolf3D_Body.skeleton}
        />
        </group>
    )
}

useGLTF.preload('/models/animations/developer.glb')

export default Developer