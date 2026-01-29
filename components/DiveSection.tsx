"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import QuantumCore from "./3d/QuantumCore";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DiveSection() {
    return (
        <section className="relative w-full py-20 bg-black flex flex-col items-center">
            {/* Title Section - Separated from 3D */}
            <div className="z-10 text-center mb-10 px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-sm font-bold text-neon-purple uppercase tracking-widest mb-4"
                >
                    Neural Engine
                </motion.h2>
                <motion.h3
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-7xl font-display font-medium text-white"
                >
                    Dive into <span className="text-neon-cyan">XAIR</span>
                </motion.h3>
            </div>

            {/* 3D Container - Interactive Window */}
            <Link href="/immersive" className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden border-y border-white/10 group cursor-pointer block">
                <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>

                <Canvas camera={{ position: [0, 0, 18], fov: 45 }}>
                    <Suspense fallback={null}>
                        <QuantumCore />
                    </Suspense>
                </Canvas>

                {/* Overlay hint */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-neon-cyan text-sm font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none animate-pulse">
                    Click to Enter Immersive Mode
                </div>
            </Link>
        </section>
    );
}
