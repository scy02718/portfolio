
import React, { useEffect, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Certificate = ({ texture, ...props }) => {
    const group = useRef()
    const txt = useTexture(texture);

    useEffect(() => {
        gsap.from(group.current.rotation, {
            y: Math.PI * 2,
            duration: 1,
            ease: "power1.inOut",
        });
    }, [txt]);

    useGSAP(() => {
        gsap.to(group.current.position, {
            y: group.current.position.y + 0.2,
            duration: 1.5,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
        })
    })

    return (
        <group ref={group} {...props}>
            <mesh castShadow>
                <boxGeometry args={[1.2, 1.2, 0.03]} />
                <meshStandardMaterial map={txt} />
            </mesh>
        </group>
    );
};

export default Certificate;
