"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";

export default function QuantumCore() {
    const groupRef = useRef<THREE.Group>(null!);
    const coreRef = useRef<THREE.Mesh>(null!);
    const materialRef = useRef<any>(null!);

    // State for interactivity
    const [hovered, setHovered] = useState(false);
    const [chaosLevel, setChaosLevel] = useState(0);

    // Particles for the accretion disk
    const particleCount = 1000;
    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            // Flat disk distribution
            const angle = Math.random() * Math.PI * 2;
            const r = 4 + Math.random() * 8; // Wider spread
            // Spiral arms
            const spiralOffset = (r * 0.5);
            const finalAngle = angle + spiralOffset;

            pos[i * 3] = Math.cos(finalAngle) * r;
            pos[i * 3 + 1] = Math.sin(finalAngle) * r; // Y is up/down in this orientation? adapting to previous
            pos[i * 3 + 2] = (Math.random() - 0.5) * 1; // Flight flatness
        }
        return pos;
    }, []);

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();

        // Mouse velocity calculation for Chaos
        const mouseX = state.mouse.x;
        const mouseY = state.mouse.y;
        // Simple distance from center as chaos metric
        const dist = Math.sqrt(mouseX * mouseX + mouseY * mouseY);

        // Smoothly interpolate chaos level
        // If mouse is moving fast or near edges, chaos increases
        const targetChaos = hovered ? 0.8 + dist * 0.5 : 0.2;
        setChaosLevel(THREE.MathUtils.lerp(chaosLevel, targetChaos, 0.05));

        // Core Animation
        if (materialRef.current) {
            // Distort increases with chaos
            materialRef.current.distort = 0.4 + chaosLevel * 0.6;
            materialRef.current.speed = 2 + chaosLevel * 5;

            // Color Shift: Blue/Cyan (Calm) -> Orange/Red (Chaos)
            const calmColor = new THREE.Color("#00f3ff");
            const chaosColor = new THREE.Color("#ff3300");
            materialRef.current.color.lerpColors(calmColor, chaosColor, chaosLevel * 0.8);
            materialRef.current.emissive.lerpColors(calmColor, chaosColor, chaosLevel * 0.8);
        }

        // Rotation - spins faster with chaos
        groupRef.current.rotation.z += delta * (0.2 + chaosLevel * 1.5);
        groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
        groupRef.current.rotation.y = Math.cos(time * 0.3) * 0.2;

        // Scale pulse
        const pulse = 1 + Math.sin(time * 10) * 0.05 * chaosLevel;
        coreRef.current.scale.setScalar(pulse);
    });

    return (
        <>
            <color attach="background" args={["#000000"]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />

            <group
                ref={groupRef}
                rotation={[Math.PI / 3, 0, 0]} // Tilt the system to face camera
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                {/* LIQUID CORE */}
                <Sphere ref={coreRef} args={[2.5, 64, 64]}>
                    <MeshDistortMaterial
                        ref={materialRef}
                        color="#00f3ff"
                        emissive="#00f3ff"
                        emissiveIntensity={2}
                        roughness={0.1}
                        metalness={1}
                        distort={0.4}
                        speed={2}
                    />
                </Sphere>

                {/* Chaos Field Particles */}
                <points>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={particleCount}
                            array={positions}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        size={0.08}
                        color={chaosLevel > 0.5 ? "#ffaa00" : "#00f3ff"}
                        transparent
                        opacity={0.8}
                        blending={THREE.AdditiveBlending}
                        sizeAttenuation={true}
                    />
                </points>

                {/* Aggressive Orbital Rings */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[5, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.2, 1.2, 1.2]}>
                    <torusGeometry args={[5, 0.01, 16, 100]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
                </mesh>
            </group>

            {/* Dynamic Lighting that follows chaos */}
            <pointLight
                position={[0, 0, 0]}
                intensity={2 + chaosLevel * 5}
                color={chaosLevel > 0.5 ? "#ff0000" : "#00f3ff"}
                distance={20}
            />
        </>
    );
}
