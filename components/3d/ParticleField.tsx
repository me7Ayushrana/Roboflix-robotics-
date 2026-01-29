"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleField() {
    const count = 2000;
    const mesh = useRef<THREE.InstancedMesh>(null!);
    const light = useRef<THREE.PointLight>(null!);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        // animate light
        const t = state.clock.getElapsedTime();

        particles.forEach((particle, i) => {
            let { t: time, factor, speed, xFactor, yFactor, zFactor } = particle;

            // Update time
            particle.t += speed / 2;

            // Periodic movement
            const a = Math.cos(time) + Math.sin(time * 1) / 10;
            const b = Math.sin(time) + Math.cos(time * 2) / 10;

            // Update position
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((time / 10) * factor) + (Math.sin(time * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((time / 10) * factor) + (Math.cos(time * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((time / 10) * factor) + (Math.sin(time * 3) * factor) / 10
            );

            // Interactive mouse movement (small influence)
            // Note: passing mouse position to props would be cleaner, but simple calculation is:
            // dummy.position.x += (state.mouse.x * 10 - dummy.position.x) * 0.1
            // We'll keep it auto-animated for now for performance stability

            // Scale pulsating
            const s = Math.cos(time) * 0.1 + 0.5; // smaller particles generally
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);

            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <color attach="background" args={["#030303"]} />
            <fog attach="fog" args={["#030303", 10, 50]} />
            <pointLight ref={light} distance={40} intensity={8} color="#00f3ff" />
            <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial
                    color="#bc13fe"
                    emissive="#00f3ff"
                    emissiveIntensity={0.5}
                    roughness={0.5}
                    metalness={1}
                />
            </instancedMesh>
        </>
    );
}
