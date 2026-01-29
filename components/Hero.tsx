"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ParticleField from "./3d/ParticleField";
import GlitchText from "./GlitchText";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative w-full h-screen overflow-hidden bg-black">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
                    <Suspense fallback={null}>
                        <ParticleField />
                    </Suspense>
                </Canvas>
            </div>

            {/* Overlay Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="pointer-events-auto"
                >
                    <h2 className="text-neon-cyan/80 tracking-[0.2em] mb-4 text-sm font-bold uppercase">
                        The Future of Automation
                    </h2>
                    <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-6 tracking-tighter mix-blend-difference">
                        X AI <GlitchText text="ROBOTICS" className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple" />
                    </h1>
                    <p className="max-w-2xl text-gray-400 text-lg md:text-xl mb-10 font-light leading-relaxed">
                        Pioneering autonomous systems and neural architecture for the next generation of industrial efficiency.
                    </p>

                    <motion.div
                        className="flex flex-col md:flex-row gap-6 justify-center items-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <button className="group relative px-8 py-4 bg-transparent border border-neon-cyan text-neon-cyan font-display font-bold uppercase tracking-widest overflow-hidden hover:text-black transition-colors duration-300">
                            <div className="absolute inset-0 w-full h-full bg-neon-cyan -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out -z-10"></div>
                            Explore Technology
                        </button>
                        <a
                            href="https://www.instagram.com/xair.live/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors uppercase text-sm tracking-widest"
                        >
                            Watch Demo <ArrowRight className="w-4 h-4" />
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative Gradients */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
        </section>
    );
}
