"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Overlay() {
    // We need to sync with the same 500vh scroll container logic or use absolute positioning
    // To keep it simple and synced, we can put this INSIDE the ScrollyCanvas or as a sibling that uses absolute positioning
    // But standard way is to have it fixed/sticky over the canvas.

    // Actually, the blueprint says: "Create text sections that sit *on top* of the canvas... fade in/out... parallax speed"

    // We'll treat this as absolute positioned elements within the tall container
    return (
        <div className="absolute inset-0 z-10 pointer-events-none">
            <Section progressStart={0} progressEnd={0.2} align="center">
                <h1 className="text-6xl md:text-9xl font-display font-black text-white mix-blend-difference text-center leading-none">
                    MEET <span className="text-neon-cyan">CHICHI</span>
                    <span className="block text-2xl md:text-4xl font-mono text-gray-400 mt-4 tracking-[0.5em] uppercase">The Robodog</span>
                </h1>
            </Section>

            <Section progressStart={0.3} progressEnd={0.5} align="left">
                <h2 className="text-5xl md:text-8xl font-display font-bold text-white max-w-4xl leading-tight pl-10 md:pl-20">
                    ADVANCED <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-white">AI COMPANION.</span>
                </h2>
            </Section>

            <Section progressStart={0.6} progressEnd={0.8} align="right">
                <h2 className="text-5xl md:text-8xl font-display font-bold text-white max-w-4xl leading-tight text-right pr-10 md:pr-20 ml-auto">
                    THE FUTURE OF <br />
                    <span className="text-neon-cyan">ROBOTICS.</span>
                </h2>
            </Section>
        </div>
    );
}

function Section({ children, progressStart, progressEnd, align }: any) {
    const { scrollYProgress } = useScroll(); // This will track global scroll.
    // Since the parent is 500vh, 0-1 covers the whole sequence.

    const opacity = useTransform(scrollYProgress,
        [progressStart, progressStart + 0.05, progressEnd - 0.05, progressEnd],
        [0, 1, 1, 0]
    );

    const y = useTransform(scrollYProgress,
        [progressStart, progressEnd],
        [50, -50] // Parallax effect
    );

    return (
        <div className={`fixed inset-0 flex items-center ${align === 'center' ? 'justify-center' : align === 'left' ? 'justify-start' : 'justify-end'}`}>
            <motion.div style={{ opacity, y }} className="relative">
                {children}
            </motion.div>
        </div>
    );
}
