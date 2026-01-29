"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function VisionSection() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start 0.9", "start 0.25"],
    });

    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

    return (
        <section
            ref={container}
            className="relative py-40 bg-black flex justify-center items-center overflow-hidden"
        >
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent opacity-20 pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-5xl z-10">
                <motion.div style={{ opacity, y }}>
                    <h3 className="text-sm font-bold text-neon-purple uppercase tracking-widest mb-8">The Vision</h3>
                    <p className="text-4xl md:text-6xl font-display font-medium text-white leading-tight">
                        We are building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">nervous system</span> of the future.
                        <span className="block mt-8 text-gray-500">
                            Where biological intelligence meets silicon precision to solve humanity's most complex physical challenges.
                        </span>
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 border-t border-white/10 pt-12">
                    {[
                        { label: "Latency", value: "< 1ms" },
                        { label: "Uptime", value: "99.99%" },
                        { label: "Scale", value: "Global" },
                        { label: "Security", value: "Bio-Locked" },
                    ].map((stat, i) => (
                        <div key={i}>
                            <h4 className="text-gray-500 text-sm uppercase tracking-widest mb-2">{stat.label}</h4>
                            <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
